require('dotenv').config();

const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const { connectRedis } = require("./config/redis");

const app = express();

app.use(express.json());

connectDB();
connectRedis();

app.use((req, res, next) => {
    console.log(
         `${req.method} ${req.originalUrl} on PORT: ${process.env.PORT}`
    );

    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "product-service",
        instance: process.env.PORT,
        status: "UP"
    });
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});