const express = require("express");
const router = express.Router();

// connect with controller - product controller folder
const productController = require("../../controllers/productController")

// @route   GET api/items
// @desc    Get All Items

router.route("/addProduct")
    .get(productController.findAll)
    .post(productController.create)

//matches with route("api/items/:id")
router
    .route("/addProduct/:id")
    .get(productController.findById)
    .put(productController.update)
    .delete(productController.remove);

router.route("/addProducts")
    .post(productController.create)


module.exports = router;