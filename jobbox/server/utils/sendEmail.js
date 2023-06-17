const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        },{
            // default message fields
            from: process.env.USER
        });

        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text
        })
        console.log("Email sent Successfully");
    } catch (error) {
        console.log("Email NOT sent ");
        console.log(error);
    }
}