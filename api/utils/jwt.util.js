const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT token based on the provided user ID.
 * @param {string} _id - The ID of the user (Admin, Patient, Doctor).
 * @param {string} role - The role of the user (Admin, Patient, Doctor).
 * @returns {Promise<string>} The generated JWT token.
 */
const generateToken = async (_id, role) => {
  const tokenData = { _id, role };

  const signedToken = await JWT.sign(tokenData, JWT_SECRET);
  return signedToken;
};

module.exports = {
  generateToken,
};
