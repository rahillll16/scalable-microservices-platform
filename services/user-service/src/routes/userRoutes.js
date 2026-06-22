const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { 
    registerUser,
    loginUser,
    getProfile,
    getUserById

} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
    "/profile",
    authMiddleware,
    getProfile
); //

router.get("/:id",authMiddleware, getUserById); //Put it after specific routes like: otherwise /profile may be interpreted as an id.

module.exports = router;