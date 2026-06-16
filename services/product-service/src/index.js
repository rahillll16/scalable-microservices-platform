require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const { connectRedis } = require("./config/redis");

const app = express();

app.use(express.json());

connectDB();
connectRedis();

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        services : "product-services",
        status : "UP"
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});