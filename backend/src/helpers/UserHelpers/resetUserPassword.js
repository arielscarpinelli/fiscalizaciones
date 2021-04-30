const sendResetPasswordEmail = require("../../mails/opt/sendResetPasswordEmail");

const resetUserPassword = async (user) => {
  try {
    await user.generateResetToken();
    console.log(user.resetToken);
    sendResetPasswordEmail(user.email, user.resetToken);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = resetUserPassword;
