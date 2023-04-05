const userController = require("../controller/userController");
const authController = require("../controller/authController");
const express = require("express");
const router = express.Router();

router.post("/signup", authController.SignUp);
router.patch("/updateme", authController.protect, userController.updateMe);
router.patch("/deleteme",authController.protect,userController.deleteMe)
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getusers
);
router.post("/login", authController.login);

router.post(
  "/forgotpassword",
  authController.protect,
  authController.forgotPassword
);

router.patch(
  "/resetpassword/:token",
  authController.protect,
  authController.resetPassword
);
router.patch(
  "/updatemypassword",
  authController.protect,
  authController.updatePassword
);
router
  .route("/:id")
  .patch(userController.updateMe)
  .delete(userController.deleteMe);
module.exports = router;
