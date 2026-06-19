const express = require("express");

const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    getCircuitBreaker

} = require("../controllers/orderController");

const router = express.Router();

// cicuit-breaker-status API
router.get("/circuit-breakers", getCircuitBreaker);

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/user/:userId", getOrdersByUserId); // should be above "/:id" route

router.get("/:id", getOrderById);

module.exports = router;