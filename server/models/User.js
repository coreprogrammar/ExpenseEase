const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const cryptoAlgorithm = process.env.DB_CRYPTO_ALGO;
const cryptoKey = Buffer.from(process.env.DB_CRYPTO_KEY, 'hex');
const cryptoIv = Buffer.from(process.env.DB_CRYPTO_IV, 'hex');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: validateEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  passwordHash: {
    type: String,
    alias: "password",
    required: [true, 'Password is required']
  },
  passwordSalt: { type: String },
  profileImage: {
    type: String,
    default: ""
  },

  // ✅ New Fields for Forgot/Reset Password
  resetToken: { type: String },
  resetTokenExpire: { type: Date }

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
  return regExp.test(email);
}

module.exports = mongoose.model('User', UserSchema);
