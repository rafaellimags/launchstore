const nodemailer = require("nodemailer")

//NOTE: servidor smtp - mailtrap
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "",
    pass: ""
  }
});

module.exports = transport