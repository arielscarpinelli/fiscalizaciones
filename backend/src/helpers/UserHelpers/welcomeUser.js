const sendWelcomeEmail = require("../../mails/opt/sendWelcomeEmail");

const welcomeUser = async (user) => {
  try {
    await user.generateResetToken();
    sendWelcomeEmail(user.email, user.resetToken);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = welcomeUser;
