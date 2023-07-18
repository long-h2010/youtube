const general = require('../../utils/helper/general.js')

class HomeController {
    home(req, res) {
        res.render('admin/index', {
            layout: 'admin.hbs',
            title: 'Home'
        })
    }

    setting(req, res) {
        general.getGeneralSetting()
            .then(data => {

                console.log("Max Size and Time Video: ", data)

                res.render('admin/setting/index', {
                    layout: 'admin.hbs',
                    title: 'Setting',
                    sizeAndTimeVideo: data,
                    message: req.flash('message'),
                    statusMessage: req.flash('message-status'),
                })
            })
            .catch(err => {
                throw err
            })
    }


    saveSetting(req, res) {
        let maxSize = req.body['video-size']
        let maxTime = req.body['time-size']

        console.log("Data post setting: ", req.body)
        console.log("Max Size and Time Video:", maxSize, maxTime)

        general.setGeneralSettings(maxSize, maxTime)
        req.flash('message', 'Change Settings Success')
        req.flash('message-status', 'success')

        res.redirect('/admin/setting')
    }

}

module.exports = new HomeController;