
const adminMiddleware = (req, res, next) => {

    console.log("ADMIN MIDDLEWARE HIT");
    console.log(req.user);

    if(req.user.role !== "admin"){

        return res.status(403).json({
            success: false,
            message: "Admin acess required"
        });
    }

    next();
};

module.exports = adminMiddleware;