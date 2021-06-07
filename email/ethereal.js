const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'clovis.kris@ethereal.email',
        pass: 'XV2WSN8xc6KzP7bXnF'
    }
});

const enviarEthereal = (asunto, mensaje) => {
    const mailOptions ={
        from: 'Servidor Node.js',
        to: 'clovis.kris@ethereal.email',
        subject: asunto,
        html: mensaje
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        }
        else console.log(info);
    })
}

module.exports = enviarEmail();