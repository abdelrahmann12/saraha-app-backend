import nodemailer from "nodemailer"

export function sendMail({to , html , subject }){
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:"al3sar.2016@gmail.com",
            pass:"lbqdjviltxaxuojh",

        }
    })
    transporter.sendMail({
        to,
        from:"'Saraha App'<al3sar.2016@gmail.com>",
        html,
        subject
    })
}