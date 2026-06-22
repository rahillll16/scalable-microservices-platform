import StatusCard from "../components/StatusCard";
import MetricPanel from "../components/MetricPanel";

import { useEffect, useState } from "react";
import { getSystemHealth } from "../services/healthService";
import { getLoadBalancerStatus } from "../services/loadBalancerService";
import { getCircuitBreakerStatus } from "../services/circuitBreakerService";
import { getRedisMetrics } from "../services/productService";

import finalArchitecture from "../assets/finalArchitecture.png";



function Dashboard() {

    const [showArchitecture, setShowArchitecture] = useState(false);

    const [redisMetrics, setRedisMetrics] =
    useState({
        hits: 0,
        misses: 0,
        ratio: 0
    });

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

    // fetching redis metric
    const fetchRedisMetrics = async () => {

        try {
    
            const data = await getRedisMetrics();
    
            setRedisMetrics({
                hits: data.hits,
                misses: data.misses,
                ratio: data.ratio
            });
    
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
                fetchRedisMetrics();
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
                            <span>{redisMetrics.hits}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Cache Misses</span>
                            <span>{redisMetrics.misses}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Hit Ratio</span>
                            <span>{redisMetrics.ratio}%</span>
                        </div>

                    </div>

                </MetricPanel>

                <MetricPanel title="⚖️ Load Balancer">

                    <div className="space-y-6 text-white">

                        {/* Users */}
                        <h3 className="font-semibold mb-2 text-center"> 
                                Users 
                        </h3>
                        <div className="grid grid-cols-2 gap-3">

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.users?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                h-20
                                                rounded-lg
                                                flex
                                                flex-col
                                                justify-center
                                                items-center
                                                border
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

                        </div>

                        <div className="mt-3 text-cyan-400">

                            🎯 Last Routed: {

                                loadBalancer?.users?.currentTarget
                                    ? loadBalancer.users.currentTarget.split(":").pop()
                                    : "None"

                            }

                        </div>

                        {/* Products */}
                        <h3 className="font-semibold mb-2 text-center"> 
                                Products 
                        </h3>
                        <div className="grid grid-cols-2 gap-3">

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.products?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                h-20
                                                rounded-lg
                                                flex
                                                flex-col
                                                justify-center
                                                items-center
                                                border
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

                        </div>

                        <div className="mt-3 text-cyan-400">

                            🎯 Last Routed: {

                                loadBalancer?.products?.currentTarget
                                    ? loadBalancer.products.currentTarget.split(":").pop()
                                    : "None"

                            }

                        </div>
                        
                        {/* Orders */}
                        <h3 className="font-semibold mb-2 text-center"> 
                                Orders 
                        </h3>
                        <div className="grid grid-cols-2 gap-3">

                            {
                                loadBalancer &&
                                Object.entries(loadBalancer?.orders?.instances || {})
                                    .map(([url, healthy]) => (

                                        <div
                                            key={url}
                                            className={`
                                                h-20
                                                rounded-lg
                                                flex
                                                flex-col
                                                justify-center
                                                items-center
                                                border
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

                        </div>

                        <div className="mt-3 text-cyan-400">

                            🎯 Last Routed: {

                                loadBalancer?.orders?.currentTarget
                                    ? loadBalancer.orders.currentTarget.split(":").pop()
                                    : "None"

                            }

                        </div>
                
                    </div>

                </MetricPanel>


                <MetricPanel title="🏗 Infrastructure Architecture">

                    <div className="relative w-full">

                        <img
                            src={finalArchitecture}
                            alt="Microservices Architecture"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                shadow-lg
                            "
                        />

                        <button
                            onClick={() => setShowArchitecture(true)}
                            className="
                                absolute
                                top-3
                                right-3
                                bg-cyan-600
                                hover:bg-cyan-700
                                text-white
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                            "
                        >
                            🔍 Full Screen
                        </button>

                    </div>

                </MetricPanel>

            </div>

            {
                showArchitecture && (

                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/90
                            z-50
                            flex
                            items-center
                            justify-center
                            p-6
                        "
                    >

                        <button
                            onClick={() =>
                                setShowArchitecture(false)
                            }
                            className="
                                absolute
                                top-5
                                right-5
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "
                        >
                            ✕ Close
                        </button>

                        <img
                            src={finalArchitecture}
                            alt="Architecture"
                            className="
                                max-w-full
                                max-h-full
                                rounded-xl
                                shadow-2xl
                            "
                        />

                    </div>

                )
            }

        </div>

        
    );
}

export default Dashboard;