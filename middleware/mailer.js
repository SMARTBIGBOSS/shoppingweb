let nodemailer = require('nodemailer');

function send (receiver, url) {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
        {
            host: 'smtp.qq.com',
            port: 465,// secure:true for port 465, secure:false for port 587
            secure: true,
            auth: {
                user: '425765498@qq.com',//overseasshopping@foxmail.com
                pass: 'yifkypwddjlrbghj'//kviuslgnmnrtbjib
            },
            tls: {
                rejectUnauthorized: false
            }
            // logger: true,
            // debug: false // include SMTP traffic in the logs
        }
    );
    let mailOptions = {
        from: '"425765498" <425765498@qq.com>', // sender address
        to: receiver, // list of receivers overseasshopping@foxmail.com
        subject: "Welcome to register", // Subject line
        // text: "Please click the following link to complete the register:", // plain text body
        html: "<h3>Welcome to register</h3>" +
            "<body><p>Please click the following link to complete the register:</p></br>" +
            "<a href='"+ url + "'></a></body>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }

        console.log('Message sent successfully!');
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // only needed when using pooled connections
        transporter.close();
    });
}

module.exports.send = send;
