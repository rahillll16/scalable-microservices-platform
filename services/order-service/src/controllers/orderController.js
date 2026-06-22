const Order = require("../models/Order");
const mongoose = require("mongoose");
const axios = require("axios"); // for service-to-service communication
const axiosRetry = require("axios-retry").default;

// Circuit Breaker
const createCircuitBreaker = require("../utils/circuitBreaker");

const userBreaker = createCircuitBreaker("USER");
const productBreaker = createCircuitBreaker("PRODUCT");

const getCircuitBreaker = async (req, res) => {


    res.json({
        userService: userBreaker.getCircuitStatus(),
        productService: productBreaker.getCircuitStatus()
    });
};


// Configuring Retry
axiosRetry(axios, {
    retries: 3,

    retryDelay: (retryCount, error) => {
        console.log(
            `Retry Attempt ${retryCount}: ${error.config.url}`
        );
    
        return retryCount * 1000;
    },

    retryCondition: (error) => {
        return (
            error.code === "ECONNREFUSED" ||
            error.code === "ECONNABORTED" ||
            (error.response && error.response.status >= 500)
        );
    }
});

// CREATE ORDER

const createOrder = async (req, res) => {
    try {

        const userId = req.user.userId;

        const { productId, quantity } = req.body;

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


        // await Promise.all([
        //     axios.get(`http://localhost:3001/api/users/${userId}`),
        //     axios.get(`http://localhost:3002/api/products/${productId}`)
        // ]);

        // USER SERVICE

        if(!userBreaker.canRequest()) {
            return res.status(503).json({
                success: false,
                message: "User Service Circuit OPEN"
            });
        }

        try {

            await axios.get(
                `http://localhost:3000/users/${userId}`,
                {
                    headers: {
                        Authorization: req.headers.authorization // user/:id is protected bu auth
                    }
                }
            );
        
            userBreaker.recordSuccess();
        
        } catch(error) {
            // console.log(error.response?.data);
        
            userBreaker.recordFailure();
        
            throw error;
        }
        
        
        // PRODUCT SERVICE
        
        if(!productBreaker.canRequest()) {
            return res.status(503).json({
                success: false,
                message: "Product Service Circuit OPEN"
            });
        }
        
        try {

            await axios.get(
                `http://localhost:3000/products/${productId}`
            );
        
            productBreaker.recordSuccess();
        
        } catch(error) {
            // console.log(error.response?.data);
        
            productBreaker.recordFailure();
        
            throw error;
        }      

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
            message: error.message || "Internal Server Error"
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

        if(
            req.user.role !== "admin" &&
            order.userId !== req.user.userId
        ){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

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

        if(
            req.user.role !== "admin" &&
            req.user.userId !== req.params.userId
        ){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        
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

// DELETE ORDER
const deleteOrder = async (req, res) => {

    try {

        const { id } = req.params;

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

        // OWNER CHECK

        if(
            order.userId !== req.user.userId &&
            req.user.role !== "admin"
        ){
            return res.status(403).json({
                success: false,
                message: "You can only delete your own orders"
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully"
        });

    } catch(error){

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
    getOrdersByUserId,
    getCircuitBreaker,
    deleteOrder
};