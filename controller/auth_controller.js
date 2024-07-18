const errorHandler = require("../utils/error");
const bcyptjs = require("bcryptjs");
const User = require("../models/user_model");

const test = (req, res) => {
  res.json({
    message: "API  is Working",
  });
};

// Updated user

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcyptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ------------------
// Delete User
// -----------------

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

const signOut = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "SignOut success" });
};

module.exports = { test, updateUser, deleteUser, signOut };
