const express = require("express");
require("dotenv").config();
const router = express.Router();
const { userValidator } = require("../middleware/walidation.js");
const userFuncs = require("../model/users.js");
const { NotAuthorizedErr, ConflictErr } = require("../helpers/errors.js");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema.js");
const { JWT_SECRET } = process.env;
const authValidation = require("../middleware/auth.js");

router.post("/signup", userValidator, async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const data = await User.findOne({ email });
    if (data) {
      throw new ConflictErr("User already exist, try to log in");
    }
    const user = new User({ email });
    user.setPassword(password);
    await userFuncs.signupUser(user);
    res.status(201).json({
      status: "created",
      code: 201,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", userValidator, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      throw new NotAuthorizedErr("Email or password is wrong");
    }
    const { _id } = user;
    const payload = { _id };
    const token = jwt.sign(payload, JWT_SECRET);
    await userFuncs.loginUser(_id, token);
    res.json({
      status: "OK",
      code: 200,
      data: {
        token,
        user: {
          email: email,
          password: password,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authValidation, async (req, res, next) => {
  const { _id } = req.user;
  try {
    await userFuncs.logoutUser(_id);
    res.json({
      status: "No Content",
      code: 204,
      message: "success logout",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/current", authValidation, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await userFuncs.getCurrentUser(_id);
    res.json({
      status: "OK",
      code: 200,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
