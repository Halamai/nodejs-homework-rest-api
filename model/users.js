/* eslint-disable semi, quotes */

const User = require("../schemas/userSchema");

const signupUser = async (body) => {
  try {
    const user = await User.create(body);
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

const loginUser = async (_id, token) => {
  try {
    const user = await User.findByIdAndUpdate(_id, { token });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

const logoutUser = async (_id) => {
  try {
    await User.findByIdAndUpdate(_id, { token: null });
  } catch (error) {
    console.log(error.message);
  }
};

const getCurrentUser = async (_id) => {
  try {
    const user = await User.findById(_id);
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
