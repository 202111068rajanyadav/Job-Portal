import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    user: 'ry2761249621@gmail.com',
    pass: 'yqwounxkyvgknram',
  },
});

const sendMail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: '"ry2761249621@gmail.com"',
    to: to,
    subject: subject,
    text: text,
    // html: "<b>Hello world?</b>", // to send HTML email
  });

  return info; 
};

export { sendMail };
