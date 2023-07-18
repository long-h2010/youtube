const videoModel = require('../../models/admin/VideoModel.js')

class VideoController {
    index(req, res) {
        videoModel.getVideos()
            .then(videos => {
                console.log("Danh sách video: " + JSON.stringify(videos))
                res.render('admin/videos/index', {
                    layout: 'admin.hbs',
                    title: 'Manage Video',
                    videos: videos,
                    status: req.flash('status'),
                    message: req.flash('message'),
                })
            })
            .catch(err => {
                throw err
            })
    }

    blockVideo(req, res) {
        let _idVideo = req.params.id

        videoModel.blockVideoById(_idVideo)
            .then(result => {
                req.flash('status', result[0])
                req.flash('message', result[1])
                res.redirect('/admin/videos')
            })
            .catch(err => {
                throw err
            })
    }

    unblockVideo(req, res) {
        let _idVideo = req.params.id

        videoModel.unblockVideoById(_idVideo)
            .then(result => {
                req.flash('status', result[0])
                req.flash('message', result[1])
                res.redirect('/admin/videos')
            })
            .catch(err => {
                throw err
            })
    }

    showUnapprovedVideo(req, res) {
        videoModel.getUnapprovedVideo()
            .then(videos => {
                res.render('admin/videos/unapproved', {
                    layout: 'admin.hbs',
                    title: 'Manage Video',
                    videos: videos,
                    status: req.flash('status'),
                    message: req.flash('message'),
                })
            })
            .catch(err => {
                throw err
            })
    }

    detail(req, res) {
        let _idVideo = req.params.id

        videoModel.getUnapprovedVideoById(_idVideo)
            .then(video => {
                if (!video) {
                    req.flash('status', 'danger')
                    req.flash('message', 'Video không tìm thấy')
                    return res.redirect('/admin/videos/unapproved')
                }

                res.render('admin/videos/detail', {
                    layout: 'admin.hbs',
                    title: 'Manage Video',
                    video: video,
                    message: req.flash('message'),
                })
            })
            .catch(err => {
                throw err
            })
    }

    approvedVideo(req, res) {
        let _idVideo = req.params.id

        videoModel.approvedVideoById(_idVideo)
            .then(() => {
                req.flash('status', 'success')
                req.flash('message', 'Duyệt video thành công')

                res.redirect('/admin/videos/unapproved')
            })
            .catch(err => {
                throw err
            })
    }

    deleteVideo(req, res) {
        let _idVideo = req.params.id

        videoModel.deleteVideoById(_idVideo)
            .then(() => {
                req.flash('status', 'success')
                req.flash('message', 'Xóa video thành công')

                res.redirect('/admin/videos')
            })
            .catch(err => {
                throw err
            })
    }

    featureVideo(req, res) {
        let videoId = req.params.id

        videoModel.setFeatureVideo(videoId)
            .then(numRows => {
                if (numRows > 0) {
                    req.flash('status', 'success')
                    req.flash('message', 'Thiết lập video feature thành công')
                } else {
                    req.flash('status', 'danger')
                    req.flash('message', 'Thiết lập video feature thất bại')
                }

                res.redirect('/admin/videos')
            })
            .catch(err => {
                throw err
            })
    }

    unfeatureVideo(req, res) {
        let videoId = req.params.id

        videoModel.setUnfeatureVideo(videoId)
            .then(numRows => {
                if (numRows > 0) {
                    req.flash('status', 'success')
                    req.flash('message', 'Hủy thiết lập video feature thành công')
                } else {
                    req.flash('status', 'danger')
                    req.flash('message', 'Hủy thiết lập video feature thất bại')
                }

                res.redirect('/admin/videos')
            })
            .catch(err => {
                throw err
            })
    }
}

module.exports = new VideoController