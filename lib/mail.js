var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'raspicamproject@gmail.com',
        pass: 'raspis2i'
    }
});

exports.send = function (picture, callback) {
    var mailOptions = {
        to: 'raspicamproject@gmail.com',
        subject: 'ALERT - New face detected',
        generateTextFromHTML: true,
        html: '<p style="margin-bottom: 20px">A new face has been detected by the Raspberry Pi</p><div><img src="' + picture + '" alt="face detected"/></div>'
    }
    smtpTransport.sendMail(mailOptions, function (err, response) {
        callback(err, response);
    });
}