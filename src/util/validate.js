const validate = require("validator");

const inputvalidator = (data) => {
  var { emailId, password, firstName, lastName, photoUrl, skills,gender } = data;

    if (!firstName || !lastName) {
      throw new Error("Invalid User Name");
    } else if (!validate.isStrongPassword(password)) {
      throw new Error("Password is too weak");
    } else if (!validate.isEmail(emailId)) {
      throw new Error("Invalid Email address");
    } else if (!photoUrl || !validate.isURL(photoUrl)) {
      photoUrl = "https://default.url.com/photo.jpg";
    } else if (!Array.isArray(skills)) {
      skills = [];
    }
  return { emailId, password, firstName, lastName, photoUrl, skills,gender };
};
module.exports = inputvalidator;
