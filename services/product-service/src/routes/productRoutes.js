const express = require("express");

const {

    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts

} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);

router.get("/",getAllProducts);

router.get("/search/:name", searchProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;