const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const reviewRouter = express.Router({mergeParams:true});

reviewRouter
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = reviewRouter;
