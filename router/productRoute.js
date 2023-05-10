const express = require("express");
const productController = require("../controller/productController");
const authController = require("../controller/authController");
const reviewRouter = require('./reviewRoute')
const productrouter = express.Router();

productrouter.use("/:productId/reviews", reviewRouter);
productrouter.route("/")
  .get(productController.getproduct)
  .post(
  authController.protect,
  authController.restrictTo("saler", "admin"),
  productController.createproduct
);
productrouter
  .route("/top-5-cheap")
  .get(productController.topproduct, productController.getproduct);
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
