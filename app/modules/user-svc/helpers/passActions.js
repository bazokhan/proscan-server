const bcrypt = require('bcryptjs');

exports.encryptPass = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.comparePass = ({ password, hashedPassword }) => {
  return bcrypt.compare(password, hashedPassword);
};
