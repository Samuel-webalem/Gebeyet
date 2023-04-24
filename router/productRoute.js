const productController = require("../controller/productController");
const authController = require("../controller/authController");
const express = require("express");
const productrouter = express.Router();

productrouter
  .route("/")
  .get(productController.getproduct)
  .post(
    // authController.protect,
    // authController.restrictTo("saler", "admin"),
    productController.createproduct
  );


productrouter
  .route("/productsStatus")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    productController.proudctStatus
  );
productrouter
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("saler"),
    productController.updateproduct
  )
  .get(productController.getsingleproduct)
  .delete(
    authController.protect,
    authController.restrictTo("saler", "admin"),
    productController.deleteproduct
  );
module.exports = productrouter;
