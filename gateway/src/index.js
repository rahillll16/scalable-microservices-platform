const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();


// creating global limiter
const globalLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

// creating login limiter
const loginLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Try again in 15 minutes."
    }
});


// SERVICE-HEALTH REGISTRY
const serviceHealth = {
    users: {
        "http://localhost:3001": true,
        "http://localhost:3004": true
    },

    products: {
        "http://localhost:3002": true,
        "http://localhost:3005": true
    },

    orders: {
        "http://localhost:3003": true,
        "http://localhost:3006": true
    },
};

const checkServiceHealth = async ()  => {

    console.log("HEALTH CHECK RUNNING");

    for(const [serviceType, instances] of Object.entries(serviceHealth)) {

        for(const url of Object.keys(instances)) {

            try {

                const response = await axios.get(`${url}/health`);

                serviceHealth[serviceType][url] = 
                    response.data.status === "UP";
                    
            } catch(error) {
                serviceHealth[serviceType][url] = false;
            }
        }
    }

    // console.log(serviceHealth);
};

checkServiceHealth();

// Running Health Check Periodically Every 10 seconds
setInterval(
    checkServiceHealth,
    10000
);

// CREATING ROUND-ROBIN LOADBALANCER

// const createRoundRobin = (services) => {
//     let current = 0;

//     return () => {
//         const service = services[current];

//         current = (current + 1) % services.length;

//         return service;
//     };
// };

// LOAD BALANCING TO DIFFERENT REPLICAS
// const loadBalancers = {
//     users: createRoundRobin(
//         Object.keys(serviceHealth.users)
//     ),

//     products: createRoundRobin(
//         Object.keys(serviceHealth.products)
//     ),

//     orders: createRoundRobin(
//         Object.keys(serviceHealth.orders)
//     )
// };

// Health-Aware LOADBALANCER
const currentIdx = {
    users:0,
    products:0,
    orders:0
};

const getNextHealthyService = (serviceType) => {

    const healthyServices = 
        Object.entries(serviceHealth[serviceType])
            .filter(([url, isHealthy]) => isHealthy)
            .map(([url]) => url);

    if(healthyServices.length === 0){
        throw new Error(`No Healthy ${serviceType} instances available`);
    }

    currentIdx[serviceType] = currentIdx[serviceType] % healthyServices.length;

    const service = healthyServices[currentIdx[serviceType]];

    currentIdx[serviceType] = (currentIdx[serviceType] + 1) % healthyServices.length;

    return service;
};

// app.use(express.json()); // removed as not good for post requests(get stucked)

// GLOBAL RATE LIMITER
app.use(globalLimiter);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "api-gateway",
        status: "UP"
    });
});

// Health-Monitoring API
app.get("/system-health", async (req, res) => {
    try {

        const [userService, productService, orderService] = 
            await Promise.allSettled([
                axios.get("http://localhost:3001/health"),
                axios.get("http://localhost:3002/health"),
                axios.get("http://localhost:3003/health")

            ]);

        // function to get microsevice status
        const getStatus = (service) =>
            service.status === "fulfilled" &&
            service.value.data.status === "UP"
                ? "UP"
                : "DOWN";

        const services = {
            userService : getStatus(userService),
            productService: getStatus(productService),
            orderService: getStatus(orderService)
        }

        res.status(200).json({
            gateway : "UP",
            services,
            timestamp : new Date().toISOString()
        });

    } catch(error){
        res.status(500).json({
            gateway: "DOWN",
            message: error.message
        });
    }
});


// LOGIN RATE LIMITER
app.use(
    "/users/login",
    loginLimiter
);


// USER MICROSERVICE

app.use(
    "/users",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true,

        router: () => {
            const target = getNextHealthyService("users");

            console.log(`Routing User Request To: ${target}`);

            return target;
        },

        pathRewrite: (path) => {
            return "/api/users" + path;
        }
    })
);

// PRODUCT MICROSERVICE

app.use(
    "/products",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true,

        router: () => {
            const target = getNextHealthyService("products");

            console.log(`Routing Product Request To: ${target}`);

            return target;
        },

        pathRewrite: (path) => {
            return "/api/products" + path;
        }
    })
);

// ORDER MICROSERVICE

app.use(
    "/orders",
    createProxyMiddleware({
        target: "http://localhost:3003",
        changeOrigin: true,

        router: () => {
            const target = getNextHealthyService("orders");;

            console.log(`Routing Order Request To: ${target}`);

            return target;
        },
        
        pathRewrite: (path) => {
            return "/api/orders" + path;
        }
    })
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});