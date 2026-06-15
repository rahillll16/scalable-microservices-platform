const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "api-gateway",
        status: "UP"
    });
});

app.use(
    "/users",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true
    })
);

app.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true
    })
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});