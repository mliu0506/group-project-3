const express = require("express");
const router = express.Router();

// connect with controller - product controller folder
const productController = require("../../controllers/productController")

// @route   GET api/addProduct
// @desc    Get All api/addProduct

router
    .route("/")
    .get(productController.findAll)

// //matches with route("api/items/:id")
// router
//     .route("/addProduct/:id")
//     .get(productController.findById)
//     .put(productController.update)
//     .delete(productController.remove);

//posting a new product
router
    .route('/')
    .post(productController.create)


module.exports = router;