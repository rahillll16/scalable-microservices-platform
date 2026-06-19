const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();


// creating global limiter
const globalLimiter = rateLimit({
    windowMs: 2*60*1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

// creating login limiter
const loginLimiter = rateLimit({
    windowMs: 10*60*1000,
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

// HEALTH-AWARE LOADBALANCER
const currentIdx = {
    users:0,
    products:0,
    orders:0
};

const currentTarget = {
    users: null,
    products: null,
    orders: null
};

const lastRequestTime = {
    users: null,
    products: null,
    orders: null
};

const getNextHealthyService = (serviceType) => {

    const healthyServices = 
        Object.entries(serviceHealth[serviceType])
            .filter(([url, isHealthy]) => isHealthy)
            .map(([url]) => url);

    if(healthyServices.length === 0){
        
        currentTarget[serviceType] = null;

        throw new Error(`No Healthy ${serviceType} instances available`);
    }

    currentIdx[serviceType] = currentIdx[serviceType] % healthyServices.length;

    const service = healthyServices[currentIdx[serviceType]];

    currentTarget[serviceType] = service;

    lastRequestTime[serviceType] = new Date().toISOString();

    currentIdx[serviceType] = (currentIdx[serviceType] + 1) % healthyServices.length;

    return service;
};


// app.use(express.json()); // removed as not good for post requests(get stucked)

app.use((cors()));

// GLOBAL RATE LIMITER
app.use(globalLimiter);

// Load-Balancer-Status API
app.get("/load-balancer-status", async (req, res) => {

    res.status(200).json({
        users: {
            instances: serviceHealth.users,
            currentTarget: currentTarget.users
        },

        products: {
            instances: serviceHealth.products,
            currentTarget: currentTarget.products
        },

        orders: {
            instances: serviceHealth.orders,
            currentTarget: currentTarget.orders
        }
    });
});

// Health API
app.get("/health", (req, res) => {
    res.status(200).json({
        service: "api-gateway",
        status: "UP"
    });
});

// Health-Monitoring API
app.get("/system-health", (req, res) => {

    const getOverallStatus = (instances) => {

        const hasHealthyInstance =
            Object.values(instances).some(
                status => status === true
            );

        return hasHealthyInstance ? "UP" : "DOWN";
    };

    const overallServices = {
        userService: getOverallStatus(serviceHealth.users),

        productService: getOverallStatus(serviceHealth.products),

        orderService: getOverallStatus(serviceHealth.orders)
    };

    res.status(200).json({
        gateway: "UP",

        overallServices,

        instances: serviceHealth,

        timestamp: new Date().toISOString()
    });
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

            if(path === "/health"){
                return "/health";
            }

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

            if(path === "/health"){
                return "/health";
            }

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

            if(path === "/health"){
                return "/health";
            }

            return "/api/orders" + path;
        }
    })
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});