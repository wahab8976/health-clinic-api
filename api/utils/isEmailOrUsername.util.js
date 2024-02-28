/**
 * Determines whether a given string is an email or a username.
 * @param {string} str - The string to be checked.
 * @returns {string} - Returns "email" if the string matches the email format, otherwise returns "username".
 */
const isEmailOrUsername = (str) => {
  // Check if the string matches the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(str)) {
    return "email";
  } else {
    return "username";
  }
};

module.exports = { isEmailOrUsername };
