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
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const awatarUpload = require("../middleware/awatarUpload.js");
const { v4: uuidv4 } = require("uuid");
const sender = require("../helpers/mailer.js");
// console.log(awatarUpload);

router.post("/signup", userValidator, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const data = await User.findOne({ email });
    if (data) {
      throw new ConflictErr("User already exist, try to log in");
    }
    const token = uuidv4();
    const user = new User({ email, verifyToken: token });
    user.setPassword(password);
    await userFuncs.signupUser(user);
    const msg = {
      to: email,
      subject: "Registration confirmation",
      html: `<a href='http://localhost:3000/api/users/verify/${token}'>Comfirm email</a>`,
    };
    await sender(msg);
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

router.patch(
  "/avatars",
  authValidation,
  awatarUpload.single("avatar"),

  async (req, res, next) => {
    const { _id } = req.user;
    console.log(_id);
    const { path: TMP_DIR, originalname } = req.file;
    console.log(TMP_DIR);
    const [fileExt] = originalname.split(".").reverse();
    const fileName = `${_id}.${fileExt}`;
    const DEST_DIR = path.join(__dirname, "../", "public/avatars", fileName);
    console.log(DEST_DIR);

    if (!_id) {
      next(new NotAuthorizedErr("Not authorized"));
    }
    try {
      await Jimp.read(TMP_DIR).then((originalname) => {
        return originalname.resize(250, 250).write(TMP_DIR);
      });
      await fs.rename(TMP_DIR, DEST_DIR, () => {});
      const avatar = path.join("avatars", fileName);
      const data = await userFuncs.updAvatar(_id, avatar);
      await res.json({
        status: "OK",
        code: 200,
        avatarURL: data,
      });
    } catch (error) {
      await fs.unlink(TMP_DIR, () => {});
      next(error);
    }
  }
);

router.get("/verify/:verificationToken", async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verifyToken: verificationToken });
  if (!user) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  const { _id } = user;
  await User.findByIdAndUpdate(_id, {
    verifyToken: null,
    verify: true,
  });
  res.json({
    status: "success",
    code: 200,
    message: "Verification successful",
  });
});

router.post("/verify", async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    const error = new Error("missing required field email");
    error.status = 400;
    throw error;
  }
  const user = await User.findOne({ email });
  const token = user.verifyToken;
  if (!user.verify) {
    const msg = {
      to: email,
      subject: "Registration confirmation",
      html: `<a href="http://localhost:3000/api/users/verify/${token}">Comfirm email</a>`,
    };
    await sender(msg);
  } else {
    const error = new Error("Verification has already been passed");
    error.status = 400;
    throw error;
  }
  res.json({
    status: "success",
    code: 200,
    message: "Verification email sent",
  });
});

module.exports = router;
