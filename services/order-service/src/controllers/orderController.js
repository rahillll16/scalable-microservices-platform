const Order = require("../models/Order");
const mongoose = require("mongoose");
const axios = require("axios"); // for service-to-service communication

// CREATE ORDER
const createOrder = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if(!userId || !productId || quantity === undefined){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if(quantity < 1){
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // await axios.get(
        //     `http://localhost:3001/api/users/${userId}`
        // );
    
        // await axios.get(
        //     `http://localhost:3002/api/products/${productId}`
        // );

        await Promise.all([
            axios.get(`http://localhost:3001/api/users/${userId}`),
            axios.get(`http://localhost:3002/api/products/${productId}`)
        ]);

        const order = await Order.create({
            userId,
            productId,
            quantity
        });

        res.status(201).json({
            success: true,
            order
        });

    } catch(error) {

        if(error.response){
            return res.status(error.response.status).json({
                success: false,
                message: error.response.data.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json({
            success : true,
            count : orders.length,
            orders
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
    try {
        
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID"
            });
        }

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });
        }

        res.status(200).json({
            success : true,
            order
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ORDERS BY USER ID
const getOrdersByUserId = async (req, res) => {
    try {
        
        const { userId } = req.params;

        const orders = await Order.find({
            userId
        });

        res.status(200).json({
            success : true,
            count : orders.length,
            orders
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
};