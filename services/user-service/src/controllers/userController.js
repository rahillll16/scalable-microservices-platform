const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//LOGIN
const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found... Please Register"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
        // console.log("ROLE:", user.role);


        res.status(200).json({
            success: true,
            token,
            role: user.role,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//REGISTER
const registerUser = async (req,res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log("User Created");

        res.status(201).json({
            success: true,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//GET PROFILE
const getProfile = async (req, res) => {
    // console.log("GET PROFILE HIT");

    try {
        // console.log("REQ.USER:", req.user);

        const user = await User.findById(
            req.user.userId
        ).select("-password");

        // console.log("USER FOUND:", user);

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        // console.log("PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET USER BY ID
const getUserById = async (req, res) => {
    // console.log("GET PROFILE HIT");

    try {
        
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: false,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getUserById
};