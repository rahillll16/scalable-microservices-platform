const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    getCircuitBreaker,
    deleteOrder

} = require("../controllers/orderController");

const router = express.Router();

// cicuit-breaker-status API
router.get("/circuit-breakers",authMiddleware, getCircuitBreaker);

router.post("/", authMiddleware, createOrder);

router.get("/",authMiddleware, adminMiddleware, getAllOrders);

router.get("/user/:userId", authMiddleware, getOrdersByUserId); // should be above "/:id" route

router.get("/:id",authMiddleware, getOrderById);

router.delete("/:id",authMiddleware, deleteOrder);

module.exports = router;