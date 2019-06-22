const jwt = require('jsonwebtoken');

exports.genToken = ({ id, email }) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 2
  });
};
