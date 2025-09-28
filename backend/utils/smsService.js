const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
exports.sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

// Send alert SMS
exports.sendAlertSMS = async (user, alert) => {
  const message = `SmartSpray Alert: ${alert.title}. ${alert.message}`;
  return await this.sendSMS(user.phone, message);
};

// Send verification code
exports.sendVerificationCode = async (phone, code) => {
  const message = `Your SmartSpray verification code is: ${code}`;
  return await this.sendSMS(phone, message);
};