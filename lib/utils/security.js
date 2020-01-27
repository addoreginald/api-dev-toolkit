// dependencies
const bcrypt = require("bcryptjs");
const Validator = require("node-input-validator");

/**
 *  This function generates a salt string
 */

module.exports.generateSalt = () => {
  return bcrypt.genSaltSync(10);
};

/**
 * This password hases a password with a provided salt
 * @param {*} password
 * @param {*} salt
 */
module.exports.hashpassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

/**
 * This function validates a salted password
 * @param {*} plainText
 * @param {*} encryptedText
 */

module.exports.validatePassword = (plainText, encryptedText) => {
  return bcrypt.compareSync(plainText, encryptedText);
};

module.exports.validateInput = (input, rules) => {
  return new Promise((resolve, reject) => {
    const validator = new Validator(input, rules);

    // check validation
    validator.check().then(matched => {
      if (!matched) {
        reject(validator.errors);
      } else {
        resolve();
      }
    });
  });
};
