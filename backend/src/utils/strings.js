const getFirstNCharactersOf = (string, count = 2) => string.slice(0, count);
const getLastNCharactersOf = (string, count = 2) => string.slice(-count);

const maskString = (string, startCharacters = 2, endCharacters = 2) => {
  const maskLength = string.length - (startCharacters + endCharacters);
  const realMaskLength = maskLength > 1 ? maskLength : 0;

  // Si el email es muy corto (3 caracteres o menos), no se enmascara.
  if (maskLength < 1) {
    startCharacters = 0;
    endCharacters = 0;
  }

  return (
    getFirstNCharactersOf(string, startCharacters) +
    "x".repeat(realMaskLength) +
    getLastNCharactersOf(string, endCharacters)
  );
};

const getProtectedPhone = (phone) => {
  const protectedPhone = maskString(phone, 0, 4);
  return protectedPhone;
};

const getProtectedEmail = (email) => {
  const [mail, domain] = email.split("@");
  const protectedMail = maskString(mail);
  return protectedMail + "@" + domain;
};

module.exports = {
  maskString,
  getFirstNCharactersOf,
  getLastNCharactersOf,
  getProtectedPhone,
  getProtectedEmail,
};
