const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

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
router.get("/circuit-breakers", getCircuitBreaker);

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/user/:userId", getOrdersByUserId); // should be above "/:id" route

router.get("/:id", getOrderById);

router.delete("/:id",authMiddleware, deleteOrder);

module.exports = router;