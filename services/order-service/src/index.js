const express = require("express");
const connectDB = require("./config/db");

const dotenv = require("dotenv");
dotenv.config();

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "order-service",
        status: "UP"
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});