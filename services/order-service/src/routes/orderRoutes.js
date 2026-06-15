const express = require("express");

const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId

} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/user/:userId", getOrdersByUserId); // should be above "/:id" route

router.get("/:id", getOrderById);

module.exports = router;