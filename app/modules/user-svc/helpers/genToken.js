const jwt = require('jsonwebtoken');

const signJWT = ({ id, email }) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 2 });
};

module.exports = signJWT;
