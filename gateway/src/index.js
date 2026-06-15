const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "api-gateway",
        status: "UP"
    });
});

app.use((req, res, next) => {
    console.log("Gateway received:", req.method, req.url);
    next();
});

app.use(
    "/users",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true,
        pathRewrite: (path) => {
            return "/api/users" + path;
        }
    })
);

app.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true,
        pathRewrite: (path) => {
            return "/api/products" + path;
        }
    })
);

app.use(
    "/orders",
    createProxyMiddleware({
        target: "http://localhost:3003",
        changeOrigin: true,
        pathRewrite: (path) => {
            return "/api/orders" + path;
        }
    })
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});