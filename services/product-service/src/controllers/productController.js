const Product = require("../models/Product");
const mongoose = require("mongoose"); //for checking ObjectId Validation
const { redisClient } = require("../config/redis");

// CREATE
const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if(
            !name || 
            !description || 
            price === undefined // as edge case for price == 0
        ){
            return res.status(400).json({
                success : false,
                message:"All fields are required"
            });
        }

        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }
        
        const product = await Product.create({
            name,
            description,
            price
        });

        //ALL PRODUCTS(LIST stored in redis as it is not containing this product) CACHE INVALIDATED
        await redisClient.del("products");
        console.log("ALL PRODUCTS CACHE INVALIDATED");

        res.status(201).json({
            success: true,
            product
        });

    } catch(error) {
        res.status(500).json({
            success : false,
            message: error.message
        });
    }
};

//GET PRODUCTS
const getAllProducts = async (req, res) => {

    try {

        const cachedProducts = await redisClient.get("products");

        if(cachedProducts){

            console.log("ALL PRODUCTS CACHE HIT");

            const products = JSON.parse(cachedProducts);

            return res.status(200).json({
                success: true,
                count: products.length,
                products
            });

        }

        console.log("ALL PRODUCTS CACHE MISS");

        const products = await Product.find();

        await redisClient.set(
            "products",
            JSON.stringify(products),
            {
                EX: 100
            }
        );

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch(error) {
        
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const cachedProduct = await redisClient.get(
            `product:${id}`
        );

        if(cachedProduct) {
            console.log("CACHE HIT");

            const product = JSON.parse(cachedProduct);

            return res.status(200).json({
                success: true,
                product
            });
        }

        console.log("CACHE MISS");

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        await redisClient.set(
            `product:${id}`,
            JSON.stringify(product),
            {
                EX: 180
            }
        );

        res.status(200).json({
            success: true,
            product
        });

    } catch(error) {
        
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req,res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const { name, description, price } = req.body;

        if(price != undefined && price < 0){
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price
            },
            {
                new: true,
                runValidators: true
            }
        );

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // CACHE INVALIDATION
        await redisClient.del(`product:${id}`);

        //ALL PRODUCTS(LIST stored in redis as it is containing this updated product) CACHE INVALIDATED
        await redisClient.del("products");

        console.log("ALL PRODUCT CACHE / CACHE INVALIDATED");

        res.status(200).json({
            success: true,
            product
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        // CACHE INVALIDATION
        await redisClient.del(`product:${id}`);

        //ALL PRODUCTS(LIST stored in redis as it is containing this product) CACHE INVALIDATED
        await redisClient.del("products");
        
        console.log("ALL PRODUCT CACHE / CACHE INVALIDATED");

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};