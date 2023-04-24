const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const sendMail = require("../util/email");
const cookie = require('cookie')
const sendToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signtoken(user._id);
 const cookieOption = {
   expires: new Date(
     Date.now() + process.env.JWT_TOKEN_EXPIRES * 24 * 60 * 60 * 1000
   ),
   httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token,cookieOption)
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.SignUp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email })) {
      return next(
        res.status(400).json({
          status: "failed",
          message: "The email already exist please login",
        })
      );
    }
    if (req.body.password !== req.body.passwordConfirmation) {
      return next(
        res.status(400).json({
          status: "failed",
          message: "The password and password confirmation is not the same",
        })
      );
    }

    const user = await User.create({
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      image: req.body.image,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    createSendToken(User, 200, res);
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      res.status(400).json({
        status: "failed",
        message: "Please provide email and password",
      })
    );
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || (await user.correctPassword(password, user.password))) {
    return next(
      res.status(401).json({
        status: "failed",
        message: "incorrect email or password",
      })
    );
  }
  const token = sendToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      res.status(401).json({
        status: "failed",
        message: "You are not loged in please login",
      })
    );
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETE);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        res.status(401).json({
          status: "failed",
          message: "The user belonging to this token does no longer exit",
        })
      );
    }

    if (freshUser.changedPassword(decoded.iat)) {
      return next(
        res.status(401).json({
          status: "failed",
          message: "User recently change password please log in again!",
        })
      );
    }
    req.user = freshUser;
    res.locals.user = freshUser;
  } catch (error) {
    return next(
      res.status(401).json({
        status: "failed",
        message: "Invalid token please try again",
      })
    );
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)||!roles) {
      next(res.status(400).json({
        status: "failed",
        message: "you dont have a permition to perform this task",
      }));
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(
        res.status(404).json({
          status: "failed",
          message: "There is no user with this email address",
        })
      );
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    resetURL = `${req.protocol}//${req.get(
      "host"
    )}/api/users/resetpassword/${resetToken}`;

    const message = `Forgot your password? submit a patch reqest with your new password and passconfirmation to:${resetURL}`;

    await sendMail({
      email: user.email,
      subject: "your password resetToken is valid for 10 minute",
      message,
    });

    res.status(200).json({
      status: "success",
      resetToken,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        res.status(400).json({
          status: "failed",
          message: "Token is invalid or Expired",
        })
      );
    }

    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save();
    return next(
      res.status(200).json({
        status: "success",
      })
    );
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (
      !user ||
      (await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(
        res.status(401).json({
          status: "failed",
          message: "incorrect email or password",
        })
      );
    }

    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    await user.save();
    createSendToken(User, 200, res);

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};
