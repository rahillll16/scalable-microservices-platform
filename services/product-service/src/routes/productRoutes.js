const express = require("express");

const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const {

    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getRedisMetrics

} = require("../controllers/productController");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createProduct);

router.get("/", getAllProducts);

router.get("/redis/metrics",getRedisMetrics);

router.get("/search/:name", searchProducts);

router.get("/:id", getProductById);

router.put("/:id",authMiddleware, adminMiddleware, updateProduct);

router.delete("/:id",authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;