const bcrypt = require('bcrypt');
const convertBuffer2Boolean = require('../utils/helper/helper.js').convertBuffer2Boolean;

const videoModel = require('../models/VideoModel.js');
const commentModel = require('../models/CommentModel.js');
const userModel = require('../models/UserModel.js');
const subscribeModel = require('../models/SubscribeModel.js');
const likeModel = require('../models/LikeModel.js');
const playlistModel = require('../models/PlaylistModel.js');
const playlistContentModel = require('../models/PlaylistContentModel.js');

class IndexController {
    getIndex(req, res) {
        videoModel.loadVideo(1).then((video) => {
            console.log(video);
            res.render('index', {
                title: 'TDTUTube',
                videos: video,
                next: 2,
                canBack: false,
            });
        })
    };

    getNextIndex(req, res, next) {
        var id = req.params.id;
        videoModel.loadVideo(id).then((video) => {
            res.render('index', {
                title: 'TDTUTube',
                videos: video,
                next: id + 1,
                back: id - 1,
                canBack: true
            });
        })
    }

    getNextListVideo(req, res) {
        var id = req.params.id;

        videoModel.loadVideo(id)
            .then((videos) => {
                res.render('load-video', {
                    layout: false,
                    videos: videos,
                });
            })
            .catch(err => {
                throw err;
            })
    }

    getLogin(req, res) {
        // If already login redirect to homepage
        if (req.session.userlogin) {
            return res.redirect('/');
        }

        res.render('login', {
            title: 'Login',
            layout: 'blank',
            type: req.flash('type'),
            message: req.flash('message'),
        });
    };

    login(req, res) {
        // Validate input
        if (req.form.errors.length > 0) {
            req.flash('type', 'danger');
            req.flash('message', req.form.errors[0]);
            return res.redirect('/login');
        }

        let { email, password, rememberme } = req.body;

        userModel.getUserByEmail(email)
            .then(user => {
                // Check if user with email exist
                if (!user) {
                    req.flash('type', 'danger');
                    req.flash('message', 'Email hoặc mật khẩu không chính xác!');

                    return res.redirect('/login');
                }

                // Check if password is correct
                if (!bcrypt.compareSync(password, user.password)) {
                    req.flash('type', 'danger');
                    req.flash('message', 'Email hoặc mật khẩu không chính xác!');

                    return res.redirect('/login');
                }

                // Check if account is lock
                if (user.status == 1) {
                    req.flash('type', 'danger');
                    req.flash('message', 'Tài khoản đã bị khóa!');
                }

                // Remove password from object before set it to session or cookie
                delete user.password;

                req.session.userlogin = user;

                // console.log("Data login: " + JSON.stringify(user));

                if (rememberme) {
                    // Set a cookie with the user's login credentials
                    res.cookie('userlogin', { user }, { maxAge: 604800000 }); // 7 days
                }

                // Redirect to home page or admin by role
                if (user.role_id === 1) {
                    res.redirect('/admin')
                } else {
                    res.redirect('/');
                }
            })
            .catch(err => {
                throw err;
            })
    };

    register(req, res) {
        // Validate input
        if (req.form.errors.length > 0) {
            req.flash('type', 'danger');
            req.flash('message', req.form.errors[0]);
            return res.redirect('/login');
        }

        let { email, name, password } = req.body;

        userModel.getUserByEmail(email)
            .then(user => {
                if (user) {
                    req.flash('type', 'danger');
                    req.flash('message', 'Email đã được sử dụng!');

                    return res.redirect('/login');
                }

                let hashedPassword = bcrypt.hashSync(password, 10);

                let data = [name, email, hashedPassword, 2]; //2 là role user đóa

                userModel.createAccountForUser(data)
                    .then(() => {
                        req.flash('type', 'success');
                        req.flash('message', 'Tạo tài khoản thành công');

                        res.redirect('/login');
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            });
    };

    logout(req, res) {
        // Clear session and cookies.
        req.session.destroy();
        if (req.cookies.userlogin) {
            res.clearCookie('userlogin');
        }
        res.redirect('/');
    };

    getChannel(req, res) {
        let currUserId = null;

        // Check if user has login
        if (req.session.userlogin) {
            currUserId = req.session.userlogin.id;
        }

        userModel.getUserByMeta(req.params.meta)
            .then((user) => {
                // Check if user exists or not lock
                if (user.length == 0 || !convertBuffer2Boolean(user[0].status)) {
                    return res.render('layouts/main', {
                        layout: false,
                        title: 'TDTUTube',
                        body: '<h1>Kênh này không còn hoạt động</h1>',
                    });
                }

                videoModel.getVideoByUser(user[0].id, false)
                    .then((videos) => {
                        playlistModel.getPlaylistsByUser(user[0].id, false)
                            .then((playlists) => {
                                // Check if user has login
                                if (currUserId) {
                                    // Get subscribe state
                                    subscribeModel.getSubscribeState(currUserId, user[0].id)
                                        .then((subscribeState) => {
                                            // Add subscribe row if this is the first time user visit this channel
                                            if (subscribeState.length == 0 && currUserId != user[0].id) {
                                                subscribeModel.addSubscribe(currUserId, user[0].id);
                                                subscribeState = false;
                                            } else {
                                                if (currUserId != user[0].id) {
                                                    subscribeState = !convertBuffer2Boolean(subscribeState[0].subscribe_state);
                                                }
                                            }
                                            // Render page
                                            res.render('channel', {
                                                title: user[0].name + ' channel',
                                                user: user[0],
                                                videos: videos,
                                                playlists: playlists,
                                                subscribe_state: subscribeState
                                            });
                                        })
                                        .catch((error) => {
                                            throw error;
                                        });
                                } else {
                                    // Ignore loading subscribe if haven't login and render page
                                    res.render('channel', {
                                        title: user[0].name + ' channel',
                                        user: user[0],
                                        videos: videos,
                                        playlists: playlists
                                    });
                                }
                            })
                            .catch((error) => {
                                throw error;
                            });
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    };

    watch(req, res, next) {
        // Store user watch history
        if (req.session.userlogin) {
            const { v } = req.query;
            const user_id = req.session.userlogin.id;

            // Check if video id is set
            if (!v) {
                return res.redirect('/');
            }

            userModel.addVideosHistory(user_id, v);
        }
        next();
    };

    getWatch(req, res) {
        // v is video id
        // list is playlist id
        const numberOfCommentPerLoad = 10;
        let { v, list } = req.query;
        let getList = true;
        let currUserId = null;
        let curr_video_id = v;

        // Check if user has login
        if (req.session.userlogin) {
            currUserId = req.session.userlogin.id;
        }

        // Check if video id is set
        if (!v) {
            return res.redirect('/');
        }

        // Check if playlist id is set, if not set it as -1
        if (!list && list != '') {
            list = -1;
            getList = false;
        }

        playlistModel.getPlaylistById(list)
            .then((playlist) => {
                // Set playlist a temp value if user not request playlist
                if (!getList) {
                    playlist[0] = { id: -1 };
                }

                // Check if playlist exist
                if (playlist.length == 0) {
                    return res.redirect('/watch?v=' + v);
                }

                // Check if playlist is private
                if (getList && !convertBuffer2Boolean(playlist[0].privacy) && currUserId != playlist[0].user_id) {
                    return res.redirect('/watch?v=' + v);
                } else {
                    // Get playlist videos
                    playlistContentModel.getPlaylistContentsById(playlist[0].id)
                        .then((playlistcontents) => {
                            // Set playlist as null if user not request playlist
                            if (!getList) {
                                playlist = null;
                            }

                            // Get current video
                            videoModel.getVideo(v)
                                .then((video) => {
                                    // Check if video exists
                                    if (video.length == 0 || !convertBuffer2Boolean(video[0].status)) {
                                        return res.render('layouts/main', {
                                            layout: false,
                                            title: 'TDTUTube',
                                            body: '<h1>Video này không còn hoạt động</h1>',
                                        });
                                    }

                                    // Check if video is private
                                    if (!convertBuffer2Boolean(video[0].privacy) && currUserId != video[0].user_id) {
                                        return res.render('layouts/main', {
                                            layout: false,
                                            title: 'TDTUTube',
                                            body: '<h1>Đây là video riêng tư</h1>',
                                        });
                                    }

                                    // Check if video is blocked
                                    if (!convertBuffer2Boolean(video[0].hide)) {
                                        return res.render('layouts/main', {
                                            layout: false,
                                            title: 'TDTUTube',
                                            body: '<h1>Video này không còn hoạt động</h1>',
                                        });
                                    }

                                    // Increase view count
                                    videoModel.increaseVideoViewCountById(v);

                                    // Get video comments
                                    commentModel.getCommentsByVideoId(video[0].id, 1, numberOfCommentPerLoad)
                                        .then((comments) => {
                                            // Get recommend videos with same tag on top
                                            videoModel.getVideosOrderByTag(video[0].id, video[0].tag_meta)
                                                .then((videos) => {
                                                    // Check if user has login
                                                    if (currUserId) {
                                                        // Get subscribe state
                                                        subscribeModel.getSubscribeState(currUserId, video[0].user_id)
                                                            .then((subscribeState) => {
                                                                // Add subscribe row if this is the first time user visit this channel
                                                                if (subscribeState.length == 0 && currUserId != video[0].user_id) {
                                                                    subscribeModel.addSubscribe(currUserId, video[0].user_id);
                                                                    subscribeState = false;
                                                                } else {
                                                                    if (currUserId != video[0].user_id) {
                                                                        subscribeState = !convertBuffer2Boolean(subscribeState[0].subscribe_state);
                                                                    }
                                                                }
                                                                // Get like state
                                                                likeModel.getLikeState(currUserId, video[0].id)
                                                                    .then((likeState) => {
                                                                        // Add like row if this is the first time user visit this video
                                                                        if (likeState.length == 0) {
                                                                            likeModel.addLike(currUserId, video[0].id);
                                                                            likeState = false;
                                                                        } else {
                                                                            likeState = !convertBuffer2Boolean(likeState[0].like_state);
                                                                        }
                                                                        // Get user playlists
                                                                        playlistModel.getPlaylistsByUserId(currUserId, video[0].id)
                                                                            .then((playlists) => {
                                                                                // Render page
                                                                                res.render('watch', {
                                                                                    curr_video_id: curr_video_id,
                                                                                    title: video[0].title,
                                                                                    video: video[0],
                                                                                    playlist: playlist,
                                                                                    playlistcontents: playlistcontents,
                                                                                    comments: comments,
                                                                                    videos: videos,
                                                                                    subscribe_state: subscribeState,
                                                                                    like_state: likeState,
                                                                                    playlists: playlists
                                                                                });
                                                                            })
                                                                            .catch((error) => {
                                                                                throw error;
                                                                            });
                                                                    })
                                                                    .catch((error) => {
                                                                        throw error;
                                                                    });
                                                            })
                                                            .catch((error) => {
                                                                throw error;
                                                            });
                                                    } else {
                                                        // Ignore loading subscribe and like if haven't login and render page
                                                        res.render('watch', {
                                                            curr_video_id: curr_video_id,
                                                            title: video[0].title,
                                                            video: video[0],
                                                            playlist: playlist,
                                                            playlistcontents: playlistcontents,
                                                            comments: comments,
                                                            videos: videos,
                                                        });
                                                    }
                                                })
                                                .catch((error) => {
                                                    throw error;
                                                });
                                        })
                                        .catch((error) => {
                                            throw error;
                                        });
                                })
                                .catch((error) => {
                                    throw error;
                                });
                        })
                        .catch((error) => {
                            throw error;
                        });
                }
            })
            .catch((error) => {
                throw error;
            });
    };

    getWatchComment(req, res) {
        let { videoId, page, limit } = req.query;
        // Render partial view comment of video with page and number of comment per page
        commentModel.getCommentsByVideoId(videoId, page, limit)
            .then((comments) => {
                res.render('watch-comment', {
                    layout: false,
                    comments: comments,
                });
            })
            .catch((error) => {
                throw error;
            });
    };

    getSearch(req, res) {
        const search_query = req.query.search_query.trim();
        // Check if doesn't have search query redirect to homepage
        if (!search_query) {
            return res.redirect('/');
        }
        userModel.getUsersByName(search_query)
            .then((channels) => {
                videoModel.getFeatureVideosByTitle(search_query)
                    .then((videos) => {
                        res.render('search', {
                            title: 'Search Video',
                            videos: videos,
                            channels: channels
                        });
                    })
                    .catch((error) => {
                        throw error;
                    });
            })
            .catch((error) => {
                throw error;
            });
    };
}

module.exports = new IndexController;