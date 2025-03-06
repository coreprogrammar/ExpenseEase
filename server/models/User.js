// models/User.js
const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const cryptoAlgorithm = process.env.DB_CRYPTO_ALGO;
const cryptoKey = Buffer.from(process.env.DB_CRYPTO_KEY, 'hex');
const cryptoIv = Buffer.from(process.env.DB_CRYPTO_IV, 'hex');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Name is required'
    } },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Email is required'
    },
    unique: {
      value: true,
    },
    validate: {
      validator: validateEmail,
      message: '{VALUE} is not a valid email'
    }},
  passwordHash: {
    type: String,
    alias:"password",
    required: {
      value: true,
      message: 'Password is required'
    } },
  passwordSalt: { type: String }
}, { timestamps: true });

function encrypt(text) {
  const cipher = crypto.createCipheriv(cryptoAlgorithm, cryptoKey, cryptoIv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipheriv(cryptoAlgorithm, cryptoKey, cryptoIv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

function validateEmail(email) {
  let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regExp.test(email)
}

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("email")) {
    user.email = user.email.toLowerCase();
  }

  if (user.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(Number(process.env.DB_CRYPTO_SALT_ROUNDS));
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    user.passwordSalt = salt;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
