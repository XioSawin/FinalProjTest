const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'backend.sawin@gmail.com',
        pass: 'Wednesday#02'
    }
});

const enviarGmail = (asunto, mensaje, adjunto, to) => {
    const mailOptions ={
        from: 'Servidor Node.js',
        to: to,
        subject: asunto,
        html: mensaje, 
        attachments: [
            {
                path: adjunto,
                filename: 'profile.jpg',
            }
        ]
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        }
        else console.log(info);
    })
}

module.exports = enviarEmail();