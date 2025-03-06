const User = require("../models/User");

const router = require("express").Router();

class AuthController {

  register = async (req, res) => {
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    } catch (error) {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "User registered successfully" });
  }
}

const authController = new AuthController();

router.post("/register", authController.register);

module.exports = router;
