const { getProtectedEmail } = require("../utils/strings");

const sendValidationCodeEmail = require("../mails/opt/sendValidationCodeEmail");

const sendCodeViaEmail = async (fiscal) => {
  try {

    const email = fiscal.email

    fiscal.mustValidateEmail();
    fiscal.generateValidationCode();

    await fiscal.save();

    sendValidationCodeEmail(email, fiscal.code);

    return {
      email: getProtectedEmail(email),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = sendCodeViaEmail;
