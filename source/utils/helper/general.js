const fs = require('fs')
const path = require('path')

module.exports.getGeneralSetting = async function() {
    var filename = 'max_size_time_video.txt'
    var filepath = path.join(__dirname, filename)

    console.log("File path", filepath)

    var dataSizeAndTime

    try {
        var data = await fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' })
            // console.log("Data from file: ", data)
        let sizeAndTime = data.split(' ')

        dataSizeAndTime = {
            size: sizeAndTime[0],
            time: sizeAndTime[1]
        }


    } catch (err) {
        console.log(err)
        throw err
    }

    return dataSizeAndTime
}

module.exports.setGeneralSettings = function(sizeVideo, timeVideo) {
    var filename = 'max_size_time_video.txt'
    var filepath = path.join(__dirname, filename)

    console.log("File path", filepath)

    let data = `${sizeVideo} ${timeVideo}`

    fs.writeFileSync(filepath, data, function(err) {
        if (err) {
            throw err
        }

        return true
    })
}