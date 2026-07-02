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

    const [redisMetrics, setRedisMetrics] = useState({
        hits: 0,
        misses: 0,
        ratio: 0
    });

    const [health, setHealth] = useState(null);
    const [loadBalancer, setLoadBalancer] = useState(null);
    const [circuitBreakers, setCircuitBreakers] = useState(null);

    const fetchHealth = async () => {
        try {
            const data = await getSystemHealth();
            setHealth(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchLoadBalancer = async () => {
        try {
            const data = await getLoadBalancerStatus();
            setLoadBalancer(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCircuitBreakers = async () => {
        try {
            const data = await getCircuitBreakerStatus();
            setCircuitBreakers(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRedisMetrics = async () => {
        try {
            const data = await getRedisMetrics();

            setRedisMetrics({
                hits: data.hits,
                misses: data.misses,
                ratio: data.ratio
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchHealth();
        fetchLoadBalancer();
        fetchCircuitBreakers();
        fetchRedisMetrics();

        const interval = setInterval(() => {
            fetchHealth();
            fetchLoadBalancer();
            fetchCircuitBreakers();
            fetchRedisMetrics();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const renderReplicaCards = (serviceName, data) => (
        <>
            <h3 className="text-center text-xl font-bold text-cyan-300 uppercase tracking-widest">
                {serviceName}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(data?.instances || {}).map(
                    ([url, healthy], index) => (
                        <div
                            key={url}
                            className={`
                                rounded-2xl
                                p-5
                                border
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:scale-105
                                cursor-pointer
                                shadow-lg
                                ${
                                    healthy
                                        ? `
                                            border-green-500/40
                                            bg-green-500/10
                                            hover:shadow-green-500/30
                                          `
                                        : `
                                            border-red-500/40
                                            bg-red-500/10
                                            hover:shadow-red-500/30
                                          `
                                }
                            `}
                        >
                            <div className="text-center">
                                <div className="font-semibold text-white">
                                    {serviceName} Replica {index + 1}
                                </div>

                                <div className="mt-3 flex justify-center items-center gap-2">
                                    <span
                                        className={`
                                            h-3
                                            w-3
                                            rounded-full
                                            animate-pulse
                                            ${
                                                healthy
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }
                                        `}
                                    />

                                    <span className="text-white">
                                        {healthy ? "UP" : "DOWN"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div
                className="
                    rounded-xl
                    p-4
                    bg-cyan-500/10
                    border
                    border-cyan-500/20
                    text-cyan-300
                    text-center
                    font-semibold
                "
            >
                🎯 Last Routed :
                {" "}
                {data?.currentTarget
                    ? data.currentTarget.split(":").pop()
                    : "None"}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">

            {/* Header */}
            <div className="mb-10">

                <h1
                    className="
                        text-5xl
                        font-extrabold
                        bg-gradient-to-r
                        from-cyan-400
                        via-blue-400
                        to-purple-500
                        text-transparent
                        bg-clip-text
                    "
                >
                    Microservices Dashboard
                </h1>

                <p className="text-slate-400 mt-3 text-lg">
                    Real-time monitoring & infrastructure analytics
                </p>

            </div>

            {/* Status Cards */}
            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

                <div className="hover:-translate-y-2 transition-all duration-300">
                    <StatusCard
                        title="Gateway"
                        value={health?.gateway || "DOWN"}
                    />
                </div>

                <div className="hover:-translate-y-2 transition-all duration-300">
                    <StatusCard
                        title="Users"
                        value={
                            health?.overallServices?.userService || "DOWN"
                        }
                    />
                </div>

                <div className="hover:-translate-y-2 transition-all duration-300">
                    <StatusCard
                        title="Products"
                        value={
                            health?.overallServices?.productService || "DOWN"
                        }
                    />
                </div>

                <div className="hover:-translate-y-2 transition-all duration-300">
                    <StatusCard
                        title="Orders"
                        value={
                            health?.overallServices?.orderService || "DOWN"
                        }
                    />
                </div>

            </div>

            {/* Panels */}
            <div className="grid xl:grid-cols-2 gap-8 mt-10">

                <MetricPanel title="🛡 Circuit Breakers">

                    <div className="space-y-6">

                        {[
                            {
                                name: "User Service",
                                value: circuitBreakers?.userService
                            },
                            {
                                name: "Product Service",
                                value: circuitBreakers?.productService
                            }
                        ].map((service) => (

                            <div
                                key={service.name}
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    bg-slate-800/50
                                    rounded-xl
                                    p-4
                                    border
                                    border-slate-700
                                "
                            >
                                <span className="text-white">
                                    {service.name}
                                </span>

                                <span className="font-semibold">

                                    {service.value === "OPEN" ? (
                                        <span className="text-red-400">
                                            🔴 OPEN
                                        </span>
                                    ) : service.value === "HALF_OPEN" ? (
                                        <span className="text-yellow-400">
                                            🟡 HALF OPEN
                                        </span>
                                    ) : (
                                        <span className="text-green-400">
                                            🟢 CLOSED
                                        </span>
                                    )}

                                </span>

                            </div>

                        ))}

                    </div>

                </MetricPanel>

                <MetricPanel title="⚡ Redis Analytics">

                    <div className="space-y-5">

                        {[
                            ["Cache Hits", redisMetrics.hits],
                            ["Cache Misses", redisMetrics.misses],
                            ["Hit Ratio", `${redisMetrics.ratio}%`]
                        ].map(([title, value]) => (

                            <div
                                key={title}
                                className="
                                    flex
                                    justify-between
                                    p-4
                                    rounded-xl
                                    bg-slate-800/50
                                    border
                                    border-slate-700
                                    text-white
                                "
                            >
                                <span>{title}</span>
                                <span className="font-bold text-cyan-300">
                                    {value}
                                </span>
                            </div>

                        ))}

                    </div>

                </MetricPanel>

                <MetricPanel title="⚖️ Load Balancer">

                    <div className="space-y-8">

                        {renderReplicaCards(
                            "Users",
                            loadBalancer?.users
                        )}

                        {renderReplicaCards(
                            "Products",
                            loadBalancer?.products
                        )}

                        {renderReplicaCards(
                            "Orders",
                            loadBalancer?.orders
                        )}

                    </div>

                </MetricPanel>

                <MetricPanel title="🏗 Infrastructure Architecture">

                    <div className="relative overflow-hidden rounded-3xl group">

                        <img
                            src={finalArchitecture}
                            alt="Architecture"
                            className="
                                rounded-3xl
                                transition-all
                                duration-700
                                group-hover:scale-105
                                shadow-2xl
                            "
                        />

                        <button
                            onClick={() => setShowArchitecture(true)}
                            className="
                                absolute
                                top-4
                                right-4
                                bg-gradient-to-r
                                from-cyan-600
                                to-blue-600
                                hover:scale-105
                                transition-all
                                duration-300
                                px-5
                                py-3
                                rounded-xl
                                text-white
                                font-semibold
                                shadow-xl
                            "
                        >
                            🔍 Full Screen
                        </button>

                    </div>

                </MetricPanel>

            </div>

            {/* Modal */}
            {showArchitecture && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black/95
                        backdrop-blur-md
                        z-50
                        flex
                        items-center
                        justify-center
                        p-6
                    "
                >

                    <button
                        onClick={() => setShowArchitecture(false)}
                        className="
                            absolute
                            top-6
                            right-6
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            font-semibold
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
                            rounded-3xl
                            shadow-2xl
                        "
                    />

                </div>

            )}

        </div>
    );
}

export default Dashboard;





// import StatusCard from "../components/StatusCard";
// import MetricPanel from "../components/MetricPanel";

// import { useEffect, useState } from "react";
// import { getSystemHealth } from "../services/healthService";
// import { getLoadBalancerStatus } from "../services/loadBalancerService";
// import { getCircuitBreakerStatus } from "../services/circuitBreakerService";
// import { getRedisMetrics } from "../services/productService";

// import finalArchitecture from "../assets/finalArchitecture.png";



// function Dashboard() {

//     const [showArchitecture, setShowArchitecture] = useState(false);

//     const [redisMetrics, setRedisMetrics] =
//     useState({
//         hits: 0,
//         misses: 0,
//         ratio: 0
//     });

//     const [health, setHealth] = useState(null);
//     const [loadBalancer, setLoadBalancer] = useState(null);
//     const [circuitBreakers, setCircuitBreakers] = useState(null);

//     // fetching system health
//     const fetchHealth = async () => {
//         try {
//             const data = await getSystemHealth();

//             setHealth(data);

//         } catch(error) {

//             console.log(error);
//         }
//     };

//     // fetching loadbalancer status
//     const fetchLoadBalancer = async () => {
//         try {
//             const data = await getLoadBalancerStatus();

//             setLoadBalancer(data);

//         } catch(error) {

//             console.log(error);
//         }
//     };

//     // fetching circuit-breakers status
//     const fetchCircuitBreakers = async () => {
//         try {
//             const data = await getCircuitBreakerStatus();

//             setCircuitBreakers(data);

//         } catch(error) {

//             console.log(error);
//         }
//     };

//     // fetching redis metric
//     const fetchRedisMetrics = async () => {

//         try {
    
//             const data = await getRedisMetrics();
    
//             setRedisMetrics({
//                 hits: data.hits,
//                 misses: data.misses,
//                 ratio: data.ratio
//             });
    
//         } catch(error) {
    
//             console.log(error);
//         }
//     };

//     useEffect(() => {

//         fetchHealth();
//         fetchLoadBalancer();
//         fetchCircuitBreakers();

//         const interval = setInterval(
//             () => {
//                 fetchHealth();
//                 fetchLoadBalancer();
//                 fetchCircuitBreakers();
//                 fetchRedisMetrics();
//             },
//             5000
//         );

//         return () => clearInterval(interval);

//     }, []);

//     return (

//         <div>

//             <h1 className="text-3xl font-bold text-white mb-6">
//                 System Overview
//             </h1>

//             {/* <pre className="text-white">
//                 {JSON.stringify(health, null, 2)}
//             </pre> */}

//             {/* <pre className="text-white">
//                 {JSON.stringify(loadBalancer, null, 2)}
//             </pre> */}

//             {/* <pre className="text-white">
//                 {
//                 JSON.stringify(circuitBreakers, null, 2)
//                 }
//             </pre> */}

//             <div className="grid grid-cols-4 gap-4">

//                 <StatusCard
//                     title="Gateway"
//                     value={health?.gateway || "DOWN"}
//                 />

//                 <StatusCard
//                     title="Users"
//                     value={
//                         health?.overallServices?.userService ||
//                         "DOWN"
//                     }
//                 />

//                 <StatusCard
//                     title="Products"
//                     value={
//                         health?.overallServices?.productService ||
//                         "DOWN"
//                     }
//                 />

//                 <StatusCard
//                     title="Orders"
//                     value={
//                         health?.overallServices?.orderService ||
//                         "DOWN"
//                     }
//                 />

//             </div>

//             <div className="grid grid-cols-2 gap-6 mt-8">

//                 <MetricPanel title="🛡 Circuit Breakers">

//                     <div className="space-y-4">

//                         <div className="flex justify-between text-white">

//                             <span>User Service</span>

//                             <span>

//                                 {
//                                     circuitBreakers?.userService === "OPEN"
//                                         ? "🔴 OPEN"
//                                     : circuitBreakers?.userService === "HALF_OPEN"
//                                         ? "🟡 HALF_OPEN"
//                                     : "🟢 CLOSED"
//                                 }

//                             </span>

//                         </div>

//                         <div className="flex justify-between text-white">

//                             <span>Product Service</span>

//                             <span>

//                                 {
//                                     circuitBreakers?.productService === "OPEN"
//                                         ? "🔴 OPEN"
//                                     : circuitBreakers?.productService === "HALF_OPEN"
//                                         ? "🟡 HALF_OPEN"
//                                     : "🟢 CLOSED"
//                                 }

//                             </span>

//                         </div>

//                     </div>

//                 </MetricPanel>

//                 <MetricPanel title="⚡ Redis Analytics">

//                     <div className="space-y-4 text-white">

//                         <div className="flex justify-between">
//                             <span>Cache Hits</span>
//                             <span>{redisMetrics.hits}</span>
//                         </div>

//                         <div className="flex justify-between">
//                             <span>Cache Misses</span>
//                             <span>{redisMetrics.misses}</span>
//                         </div>

//                         <div className="flex justify-between">
//                             <span>Hit Ratio</span>
//                             <span>{redisMetrics.ratio}%</span>
//                         </div>

//                     </div>

//                 </MetricPanel>

//                 <MetricPanel title="⚖️ Load Balancer">

//                     <div className="space-y-6 text-white">

//                         {/* Users */}
//                         <h3 className="font-semibold mb-2 text-center"> 
//                                 Users 
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">

//                             {
//                                 loadBalancer &&
//                                 Object.entries(loadBalancer?.users?.instances || {})
//                                     .map(([url, healthy], index) => (

//                                         <div
//                                             key={url}
//                                             className={`
//                                                 h-20
//                                                 rounded-lg
//                                                 flex
//                                                 flex-col
//                                                 justify-center
//                                                 items-center
//                                                 border
//                                                 ${
//                                                     healthy
//                                                     ? "border-green-500 bg-green-500/10"
//                                                     : "border-red-500 bg-red-500/10"
//                                                 }
//                                             `}
//                                         >
//                                             <div>
//                                                 {`User Replica ${index + 1}`}
//                                             </div>

//                                             <div className="mt-1">
//                                                 {
//                                                     healthy
//                                                     ? "🟢 UP"
//                                                     : "🔴 DOWN"
//                                                 }
//                                             </div>

//                                         </div>
//                                     ))
//                             }

//                         </div>

//                         <div className="mt-3 text-cyan-400">

//                             🎯 Last Routed: {

//                                 loadBalancer?.users?.currentTarget
//                                     ? loadBalancer.users.currentTarget.split(":").pop()
//                                     : "None"

//                             }

//                         </div>

//                         {/* Products */}
//                         <h3 className="font-semibold mb-2 text-center"> 
//                                 Products 
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">

//                             {
//                                 loadBalancer &&
//                                 Object.entries(loadBalancer?.products?.instances || {})
//                                     .map(([url, healthy], index) => (

//                                         <div
//                                             key={url}
//                                             className={`
//                                                 h-20
//                                                 rounded-lg
//                                                 flex
//                                                 flex-col
//                                                 justify-center
//                                                 items-center
//                                                 border
//                                                 ${
//                                                     healthy
//                                                     ? "border-green-500 bg-green-500/10"
//                                                     : "border-red-500 bg-red-500/10"
//                                                 }
//                                             `}
//                                         >
//                                             <div>
//                                                 {`Product Replica ${index + 1}`}
//                                             </div>

//                                             <div className="mt-1">
//                                                 {
//                                                     healthy
//                                                     ? "🟢 UP"
//                                                     : "🔴 DOWN"
//                                                 }
//                                             </div>

//                                         </div>
//                                     ))
//                             }

//                         </div>

//                         <div className="mt-3 text-cyan-400">

//                             🎯 Last Routed: {

//                                 loadBalancer?.products?.currentTarget
//                                     ? loadBalancer.products.currentTarget.split(":").pop()
//                                     : "None"

//                             }

//                         </div>
                        
//                         {/* Orders */}
//                         <h3 className="font-semibold mb-2 text-center"> 
//                                 Orders 
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">

//                             {
//                                 loadBalancer &&
//                                 Object.entries(loadBalancer?.orders?.instances || {})
//                                     .map(([url, healthy], index) => (

//                                         <div
//                                             key={url}
//                                             className={`
//                                                 h-20
//                                                 rounded-lg
//                                                 flex
//                                                 flex-col
//                                                 justify-center
//                                                 items-center
//                                                 border
//                                                 ${
//                                                     healthy
//                                                     ? "border-green-500 bg-green-500/10"
//                                                     : "border-red-500 bg-red-500/10"
//                                                 }
//                                             `}
//                                         >
//                                             <div>
//                                                 {`Order Replica ${index + 1}`}
//                                             </div>

//                                             <div className="mt-1">
//                                                 {
//                                                     healthy
//                                                     ? "🟢 UP"
//                                                     : "🔴 DOWN"
//                                                 }
//                                             </div>

//                                         </div>
//                                     ))
//                             }

//                         </div>

//                         <div className="mt-3 text-cyan-400">

//                             🎯 Last Routed: {

//                                 loadBalancer?.orders?.currentTarget
//                                     ? loadBalancer.orders.currentTarget.split(":").pop()
//                                     : "None"

//                             }

//                         </div>
                
//                     </div>

//                 </MetricPanel>


//                 <MetricPanel title="🏗 Infrastructure Architecture">

//                     <div className="relative w-full">

//                         <img
//                             src={finalArchitecture}
//                             alt="Microservices Architecture"
//                             className="
//                                 w-full
//                                 rounded-xl
//                                 border
//                                 border-slate-700
//                                 shadow-lg
//                             "
//                         />

//                         <button
//                             onClick={() => setShowArchitecture(true)}
//                             className="
//                                 absolute
//                                 top-3
//                                 right-3
//                                 bg-cyan-600
//                                 hover:bg-cyan-700
//                                 text-white
//                                 px-3
//                                 py-2
//                                 rounded-lg
//                                 text-sm
//                                 font-semibold
//                             "
//                         >
//                             🔍 Full Screen
//                         </button>

//                     </div>

//                 </MetricPanel>

//             </div>

//             {
//                 showArchitecture && (

//                     <div
//                         className="
//                             fixed
//                             inset-0
//                             bg-black/90
//                             z-50
//                             flex
//                             items-center
//                             justify-center
//                             p-6
//                         "
//                     >

//                         <button
//                             onClick={() =>
//                                 setShowArchitecture(false)
//                             }
//                             className="
//                                 absolute
//                                 top-5
//                                 right-5
//                                 bg-red-600
//                                 hover:bg-red-700
//                                 text-white
//                                 px-4
//                                 py-2
//                                 rounded-lg
//                             "
//                         >
//                             ✕ Close
//                         </button>

//                         <img
//                             src={finalArchitecture}
//                             alt="Architecture"
//                             className="
//                                 max-w-full
//                                 max-h-full
//                                 rounded-xl
//                                 shadow-2xl
//                             "
//                         />

//                     </div>

//                 )
//             }

//         </div>

        
//     );
// }

// export default Dashboard;