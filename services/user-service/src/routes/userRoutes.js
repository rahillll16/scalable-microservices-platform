const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { 
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

module.exports = router;