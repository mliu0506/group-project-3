const express = require("express");
const router = express.Router();

// connect with controller - product controller folder
const productController = require("../../controllers/productController")

// @route   GET api/addProduct
// @desc    Get All api/addProduct

router
    .route("/")
    .get(productController.findAll)


router
    .route('/')
    .post(productController.create)


module.exports = router;