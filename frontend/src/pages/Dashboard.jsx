import StatusCard from "../components/StatusCard";
import MetricPanel from "../components/MetricPanel";

import { use, useEffect, useState } from "react";
import { getSystemHealth } from "../services/healthService";
import { getLoadBalancerStatus } from "../services/loadBalancerService";
import { getCircuitBreakerStatus } from "../services/circuitBreakerService";



function Dashboard() {

    const [health, setHealth] = useState(null);
    const [loadBalancer, setLoadBalancer] = useState(null);
    const [circuitBreakers, setCircuitBreakers] = useState(null);

    // fetching system health
    const fetchHealth = async () => {
        try {
            const data = await getSystemHealth();

            setHealth(data);

        } catch(error) {

            console.log(error);
        }
    };

    // fetching loadbalancer status
    const fetchLoadBalancer = async () => {
        try {
            const data = await getLoadBalancerStatus();

            setLoadBalancer(data);

        } catch(error) {

            console.log(error);
        }
    };

    // fetching circuit-breakers status
    const fetchCircuitBreakers = async () => {
        try {
            const data = await getCircuitBreakerStatus();

            setCircuitBreakers(data);

        } catch(error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchHealth();
        fetchLoadBalancer();
        fetchCircuitBreakers();

        const interval = setInterval(
            () => {
                fetchHealth();
                fetchLoadBalancer();
                fetchCircuitBreakers();
            },
            5000
        );

        return () => clearInterval(interval);

    }, []);

    return (

        <div>

            <h1 className="text-3xl font-bold text-white mb-6">
                System Overview
            </h1>

            {/* <pre className="text-white">
                {JSON.stringify(health, null, 2)}
            </pre> */}

            {/* <pre className="text-white">
                {JSON.stringify(loadBalancer, null, 2)}
            </pre> */}

            {/* <pre className="text-white">
                {
                JSON.stringify(circuitBreakers, null, 2)
                }
            </pre> */}

            <div className="grid grid-cols-4 gap-4">

                <StatusCard
                    title="Gateway"
                    value={health?.gateway || "DOWN"}
                />

                <StatusCard
                    title="Users"
                    value={
                        health?.overallServices?.userService ||
                        "DOWN"
                    }
                />

                <StatusCard
                    title="Products"
                    value={
                        health?.overallServices?.productService ||
                        "DOWN"
                    }
                />

                <StatusCard
                    title="Orders"
                    value={
                        health?.overallServices?.orderService ||
                        "DOWN"
                    }
                />

            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">

                <MetricPanel title="🛡 Circuit Breakers">

                    <div className="space-y-4">

                        <div className="flex justify-between text-white">

                            <span>User Service</span>

                            <span>

                                {
                                    circuitBreakers?.userService === "OPEN"
                                        ? "🔴 OPEN"
                                    : circuitBreakers?.userService === "HALF_OPEN"
                                        ? "🟡 HALF_OPEN"
                                    : "🟢 CLOSED"
                                }

                            </span>

                        </div>

                        <div className="flex justify-between text-white">

                            <span>Product Service</span>

                            <span>

                                {
                                    circuitBreakers?.productService === "OPEN"
                                        ? "🔴 OPEN"
                                    : circuitBreakers?.productService === "HALF_OPEN"
                                        ? "🟡 HALF_OPEN"
                                    : "🟢 CLOSED"
                                }

                            </span>

                        </div>

                    </div>

                </MetricPanel>

                <MetricPanel title="⚡ Redis Analytics">

                    <div className="space-y-4 text-white">

                        <div className="flex justify-between">
                            <span>Cache Hits</span>
                            <span>0</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Cache Misses</span>
                            <span>0</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Hit Ratio</span>
                            <span>0%</span>
                        </div>

                    </div>

                </MetricPanel>

                <MetricPanel title="⚖️ Load Balancer">

                    <div className="space-y-6 text-white">

                        {/* Users */}
                        <div>

                            <h3 className="font-semibold mb-2">
                                Users
                            </h3>

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.users?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                rounded-lg
                                                p-3
                                                border
                                                text-center
                                                font-semibold
                                                ${
                                                    healthy
                                                    ? "border-green-500 bg-green-500/10"
                                                    : "border-red-500 bg-red-500/10"
                                                }
                                            `}
                                        >
                                            <div>
                                                {url.split(":").pop()}
                                            </div>

                                            <div className="mt-1">
                                                {
                                                    healthy
                                                    ? "🟢 UP"
                                                    : "🔴 DOWN"
                                                }
                                            </div>

                                        </div>
                                    ))
                            }

                            <div className="mt-2 text-cyan-400">

                                🎯 Last Routed:

                                {
                                    loadBalancer?.users?.currentTarget
                                        ? loadBalancer.users.currentTarget.split(":").pop()
                                        : "None"
                                }

                            </div>

                        </div>

                        {/* Products */}
                        <div>

                            <h3 className="font-semibold mb-2">
                                Products
                            </h3>

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.products?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                rounded-lg
                                                p-3
                                                border
                                                text-center
                                                font-semibold
                                                ${
                                                    healthy
                                                    ? "border-green-500 bg-green-500/10"
                                                    : "border-red-500 bg-red-500/10"
                                                }
                                            `}
                                        >
                                            <div>
                                                {url.split(":").pop()}
                                            </div>

                                            <div className="mt-1">
                                                {
                                                    healthy
                                                    ? "🟢 UP"
                                                    : "🔴 DOWN"
                                                }
                                            </div>

                                        </div>
                                    ))
                            }

                            <div className="mt-2 text-cyan-400">

                                🎯 Last Routed:

                                {
                                    loadBalancer?.products?.currentTarget
                                        ? loadBalancer.products.currentTarget.split(":").pop()
                                        : "None"
                                }

                            </div>

                        </div>
                        
                        {/* Orders */}
                        <div>

                            <h3 className="font-semibold mb-2">
                                Orders
                            </h3>

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.orders?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                rounded-lg
                                                p-3
                                                border
                                                text-center
                                                font-semibold
                                                ${
                                                    healthy
                                                    ? "border-green-500 bg-green-500/10"
                                                    : "border-red-500 bg-red-500/10"
                                                }
                                            `}
                                        >
                                            <div>
                                                {url.split(":").pop()}
                                            </div>

                                            <div className="mt-1">
                                                {
                                                    healthy
                                                    ? "🟢 UP"
                                                    : "🔴 DOWN"
                                                }
                                            </div>

                                        </div>
                                    ))
                            }

                            <div className="mt-2 text-cyan-400">

                                🎯 Last Routed:

                                {
                                    loadBalancer?.orders?.currentTarget
                                        ? loadBalancer.orders.currentTarget.split(":").pop()
                                        : "None"
                                }

                            </div>

                        </div>
                
                    </div>

                </MetricPanel>

                <MetricPanel title="🏗 Infrastructure Topology">

                    <div className="flex flex-col items-center gap-6 text-white">

                        <div className="bg-cyan-500 px-4 py-2 rounded-lg">
                            Client
                        </div>

                        <div>↓</div>

                        <div className="bg-green-600 px-6 py-2 rounded-lg">
                            API Gateway
                        </div>

                        <div className="flex gap-8">

                            <div className="bg-blue-600 px-4 py-2 rounded-lg">
                                Users
                            </div>

                            <div className="bg-blue-600 px-4 py-2 rounded-lg">
                                Products
                            </div>

                            <div className="bg-blue-600 px-4 py-2 rounded-lg">
                                Orders
                            </div>

                        </div>

                        <div className="flex gap-8">

                            <div className="bg-orange-600 px-4 py-2 rounded-lg">
                                Redis
                            </div>

                            <div className="bg-purple-600 px-4 py-2 rounded-lg">
                                MongoDB
                            </div>

                        </div>

                    </div>

                </MetricPanel>

            </div>

        </div>
    );
}

export default Dashboard;