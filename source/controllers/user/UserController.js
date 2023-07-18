const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration');

const userModel = require('../../models/UserModel.js');
const videoModel = require('../../models/VideoModel.js');
const likeModel = require('../../models/LikeModel.js');
const subscribeModel = require('../../models/SubscribeModel.js');
const commentModel = require('../../models/CommentModel.js');
const tagModel = require('../../models/admin/TagModel.js');
const playlistModel = require('../../models/PlaylistModel.js');
const playlistContentModel = require('../../models/PlaylistContentModel.js');

const helper = require('../../utils/helper/helper.js');
const general = require('../../utils/helper/general.js');

class UserController {
    checkLogin(req, res, next) {
        // Redirect to login if not login
        if (!req.session.userlogin) {
            return res.redirect('/login');
        }
        next();
    };

    index(req, res) {
        const meta = req.session.userlogin.meta;

        userModel.getUserByMeta(meta)
            .then((user) => {
                videoModel.getVideoByUser(user[0].id, true)
                    .then((videos) => {
                        playlistModel.getPlaylistsByUser(user[0].id, true)
                            .then((playlists) => {
                                res.render('account/mychannel', {
                                    title: 'My channel',
                                    user: user[0],
                                    videos: videos,
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
    };

    settings(req, res) {
        const user = req.session.userlogin;

        res.render('account/settings', {
            title: 'Settings',
            user: user,
        });
    };

    updateProfile(req, res) {
        const email = req.session.userlogin.email;

        let { avatar, name, meta } = req.body;

        if (req.file) {
            avatar = req.file.originalname;
        }

        userModel.updateProfile(email, name, avatar, meta)
            .then(() => {
                userModel.getUserByEmail(email)
                    .then(user => {
                        req.flash('type', 'success');
                        req.flash('message', 'Cập nhật thành công!');

                        if (req.cookies.userlogin) {
                            res.clearCookie('userlogin');
                            res.cookie('userlogin', { user }, { maxAge: 604800000 });
                        }

                        req.session.userlogin = user;

                        res.redirect('/account/settings');
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                throw err;
            })
    };

    changePassword(req, res) {
        const user = req.session.userlogin;

        let { oldpass, newpass, confirmpass } = req.body;

        if (!oldpass || !newpass || !confirmpass) {
            req.flash('type', 'danger');
            req.flash('message', 'vui lòng nhập đủ thông tin!');

            return res.redirect('/account/settings');
        } else {
            if (!bcrypt.compareSync(oldpass, user.password)) {
                req.flash('type', 'danger');
                req.flash('message', 'Mật khẩu cũ không chính xác!');

                return res.redirect('/account/settings');
            } else if (oldpass === newpass) {
                req.flash('type', 'danger');
                req.flash('message', 'Mật khẩu mới không được trùng với mật khẩu cũ!');

                res.redirect('/account/settings');
            } else if (newpass != confirmpass) {
                req.flash('type', 'danger');
                req.flash('message', 'Mật khẩu xác nhận không chính xác!');

                return res.redirect('/account/settings');
            } else {
                let pass = bcrypt.hashSync(newpass, 10);
                userModel.changePassword(user.email, pass)
                    .then(() => {
                        req.flash('type', 'success');
                        req.flash('message', 'Đổi mật khẩu thành công!');

                        res.redirect('/account/settings');
                    })
                    .catch(err => {
                        throw err;
                    })
                return;
            }
        }

        res.redirect('/account/settings');
    }

    editVideo(req, res) {
        const video_id = req.body.videoid;

        videoModel.getVideoById(video_id)
            .then(video => {
                videoModel.getTag()
                    .then(tags => {
                        return res.render('account/editvideo', {
                            title: 'Edit video',
                            video: video,
                            tags: tags,
                        });
                    })
            })
            .catch(err => {
                throw err;
            })
    };

    updateVideo(req, res) {
        let { videoid, thumbnail, title, privacy, description, tag } = req.body;

        // console.log("Data updated video: ", videoid, thumbnail, title, privacy, description, tag)

        if (req.file) {
            thumbnail = req.file.originalname;
        }

        videoModel.updateVideo(videoid, thumbnail, title, privacy, description, tag)
            .then(result => {
                return res.redirect('/account');
            })
            .catch(err => {
                throw err;
            })
    };

    history(req, res) {
        const user = req.session.userlogin;

        if (!user) {
            return res.render('requestlogin', {
                title: 'History',
                nav_id: 'history',
            });
        }

        videoModel.getVideosHistoryByUser(user.id)
            .then(result => {
                res.render('account/videos_horizontal', {
                    title: 'History',
                    videos: result,
                    nav_id: 'history',
                });
            })
            .catch(err => {
                throw err;
            })
    };

    subscriptions(req, res) {
        const user = req.session.userlogin;

        if (!user) {
            return res.render('requestlogin', {
                title: 'Subscriptions',
                nav_id: 'subscriptions',
            });
        }

        subscribeModel.getUserSubscriptions(user.id)
            .then(users => {
                res.render('account/subscriptions', {
                    title: 'Subscriptions',
                    users: users,
                });
            })
            .catch(err => {
                throw err;
            })
    };

    liked(req, res) {
        var user;
        if (req.cookies.userlogin) {
            user = req.cookies.userlogin.user;
        } else {
            user = req.session.userlogin;
        }

        if (!user) {
            return res.render('requestlogin', {
                title: 'Liked video',
                nav_id: 'liked',
            });
        }

        videoModel.getVideosLikedByUser(user.id)
            .then(result => {
                res.render('account/videos_horizontal', {
                    title: 'History',
                    videos: result,
                    nav_id: 'liked',
                });
            })
            .catch(err => {
                throw err;
            })
    };

    upload(req, res) {
        tagModel.getTags()
            .then(tags => {
                res.render('account/uploadvideo', {
                    title: 'Upload video',
                    tags: tags,
                    message: req.flash('message'),
                    type: req.flash('type'),
                });
            })
            .catch(err => {
                throw err;
            })
    };

    uploadVideo(req, res) {
        let { title, description, privacy, tag } = req.body
        let videoUpload = req.files['video']
        let thumbnailUpload = req.files['thumbnail']
        let user = req.session.userlogin
        let videoDir = path.join(__dirname, '..', '..', 'public', 'Uploads', 'videos')
        let thumbnailDir = path.join(__dirname, '..', '..', 'public', 'Uploads', 'thumbnails')

        let oldPathVideos = path.join(__dirname, '..', '..', videoUpload[0].path)
        let oldPathThumbnail = path.join(__dirname, '..', '..', thumbnailUpload[0].path)

        console.log("Data thumbnail: " + JSON.stringify(videoUpload));
        console.log("Data video: " + JSON.stringify(thumbnailUpload));
        console.log("Data from body: ", title, description, privacy, tag);
        console.log("Video path: " + videoDir);
        console.log("Thumbnail path: " + thumbnailDir);

        Promise.all([helper.getNumberVideoCurr(),
                general.getGeneralSetting(),
                getVideoDurationInSeconds(oldPathVideos),
            ])
            .then(result => {
                console.log("Promise 1 resolved: " + JSON.stringify(result[0]))
                console.log("Promise 2 resolved: " + JSON.stringify(result[1]))
                console.log("Promise 3 resolved: " + JSON.stringify(result[2]))

                const NUM_VIDEO = parseInt(result[0].NUM_VIDEO)
                let maxSizeVideo = result[1].size
                let maxTimeVideo = result[1].time
                let timeVideo = result[2]

                if (videoUpload.size > maxSizeVideo * 1024 * 1024) {
                    //req.flash('type', 'danger');
                    //req.flash('message', 'Size of video bigger than 500MB')
                    //return res.redirect('/account/uploadvideo')
                    return res.json({ code: 1, message: 'Size of video bigger than 500' })
                }

                if (timeVideo > maxTimeVideo * 60) {
                    //req.flash('type', 'danger');
                    //req.flash('message', 'Time of video longer than 30 minutes')
                    //return res.redirect('/account/uploadvideo')
                    return res.json({ code: 2, message: 'Time of video longer than 30 minutes' })
                }

                let videoPath = (NUM_VIDEO + 1) + '.mp4'
                let thumbnailPath = (NUM_VIDEO + 1) + '.png'
                let minutesVideo = Math.round(result[2] / 60)
                let secondsVideo = Math.round(result[2] % 60)
                let _timeVideo = `${minutesVideo}:${secondsVideo}`
                let meta = (NUM_VIDEO + 1)

                videoModel.addVideo(user.id, tag, title, description, _timeVideo, thumbnailPath, videoPath, meta, privacy)
                    .then(() => {
                        //move file
                        fs.rename(oldPathVideos, videoDir + '/' + videoPath, function(err) {
                            if (err) {
                                throw err
                            }

                            fs.rename(oldPathThumbnail, thumbnailDir + '/' + thumbnailPath, function(err) {
                                if (err) {
                                    throw err
                                }

                                // fs.unlinkSync(oldPathThumbnail)
                                // fs.unlinkSync(oldPathVideos)

                                //res.redirect('/account');
                                return res.json({ code: 0, message: 'Upload video successfully' })
                            })
                        })
                    })
                    .catch(err => {
                        throw err
                    })
            })
            .catch(err => {
                throw err
            })
    }

    putLike(req, res) {
        const currUserId = req.session.userlogin.id;
        const { videoId, state } = req.body;
        likeModel.updateLike(currUserId, parseInt(videoId), parseInt(state))
            .then((result) => {
                res.json({ code: 200, message: 'Cập nhật like thành công' });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Cập nhật like thất bại: ' + error.message });
            });
    };

    putSubscribe(req, res) {
        const currUserId = req.session.userlogin.id;
        const { subscribeUserId, state } = req.body;
        subscribeModel.updateSubscribe(currUserId, parseInt(subscribeUserId), parseInt(state))
            .then((result) => {
                res.json({ code: 200, message: 'Cập nhật subscribe thành công' });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Cập nhật subscribe thất bại: ' + error.message });
            });
    };

    postComment(req, res) {
        const currUserId = req.session.userlogin.id;
        const { videoId, content } = req.body;
        commentModel.addComment(currUserId, parseInt(videoId), content)
            .then((result) => {
                res.json({ code: 200, message: 'Thêm bình luận thành công' });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Thêm bình luận thất bại: ' + error.message });
            });
    };

    postPlaylist(req, res) {
        const currUserId = req.session.userlogin.id;
        const { name, privacy, videoId } = req.body;
        playlistModel.addPlaylist(currUserId, name, privacy)
            .then((playlistId) => {
                playlistContentModel.addPlaylistContent(playlistId, videoId)
                    .then((result) => {
                        res.json({ code: 200, message: 'Thêm video vào playlist thành công' });
                    });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Thêm playlist thất bại: ' + error.message });
            });
    };

    postPlaylistContent(req, res) {
        const { playlistId, videoId } = req.body;
        playlistContentModel.addPlaylistContent(playlistId, videoId)
            .then((result) => {
                res.json({ code: 200, message: 'Thêm video vào playlist thành công' });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Thêm video vào playlist thất bại: ' + error.message });
            });
    };

    deletePlaylistContent(req, res) {
        const { playlistId, videoId } = req.body;
        playlistContentModel.deletePlaylistContent(playlistId, videoId)
            .then((result) => {
                res.json({ code: 200, message: 'Xóa video khỏi playlist thành công' });
            })
            .catch((error) => {
                res.json({ code: 500, message: 'Xóa video khỏi playlist thất bại: ' + error.message });
            });
    };
}

module.exports = new UserController;