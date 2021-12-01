const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../middleware/walidation.js");
// const User = require("../schemas/userSchema.js");
const { NotAuthorizedErr } = require("../helpers/errors.js");
const { JWT_SECRET } = process.env;

const authValidation = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new NotAuthorizedErr("Not authorized"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(new NotAuthorizedErr("Not authorized"));
  }

  try {
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);
    if (!user.token) {
      next(new NotAuthorizedErr("Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authValidation;
