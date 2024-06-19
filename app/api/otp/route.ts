import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    console.log(email+" "+otp+"--")
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address
      port: 465, // SMTP server port
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Setup email data
    const mailOptions = {
      from: process.env.SMTP_FROM, // Sender address
      to: email, // List of recipients
      subject: `Your OTP`, // Subject line
      text: `Hi, this is your OTP: ${otp}`, // Plain text body
      html: `<p>Hello, this is your OTP: <strong>${otp}</strong></p>`, // HTML body
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    return NextResponse.json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { message: "An error occurred while sending the OTP." },
      { status: 500 }
    );
  }
}