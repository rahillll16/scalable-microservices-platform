const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        // console.log("AUTH HEADER:", authHeader);
        // console.log("TOKEN:", token);
        // console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // console.log("DECODED:", decoded);

        req.user = decoded;

        // console.log("BEFORE NEXT");

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = authMiddleware;