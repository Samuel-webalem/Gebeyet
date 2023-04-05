const User = require("../model/usermodel");

const filterObj = (obj, ...allowedObj) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowedObj.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getusers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(
      res.status(400).json({
        status: "failed",
        message: error,
      })
    );
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        res.status(404).json({
          status: "failed",
          message: error,
        })
      );
    }

    const filteredBody = filterObj(req.body, "email", "phonenumber", "name");

    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(
      res.status(400).json({
        status: "failed",
        message: error,
      })
    );
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.id, { active: false });

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    return next(
      res.status(400).json({
        status: "failed",
        message: error,
      })
    );
  }
};
