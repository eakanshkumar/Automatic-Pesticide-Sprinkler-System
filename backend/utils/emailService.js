const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_API_KEY
  }
});

// Send email
exports.sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to KrishiNetra';
  const html = `
    <h1>Welcome to SmartSpray, ${user.name}!</h1>
    <p>Thank you for joining our precision agriculture platform.</p>
    <p>Your farm ${user.farmName} has been successfully registered.</p>
    <p>If you have any questions, please contact our support team.</p>
  `;
  
  return await this.sendEmail(user.email, subject, html);
};

// Send alert email
exports.sendAlertEmail = async (user, alert) => {
  const subject = `SmartSpray Alert: ${alert.title}`;
  const html = `
    <h2>${alert.title}</h2>
    <p>${alert.message}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
    <p>Please check your dashboard for more details.</p>
  `;
  
  return await this.sendEmail(user.email, subject, html);
};