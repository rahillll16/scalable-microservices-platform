require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/users", userRoutes); //POST /api/users/register or login or other

app.get("/health", (req,res) => {
    res.status(200).json({
        service : "user-services",
        status : "UP"
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});