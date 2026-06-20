import { NavLink } from "react-router-dom";


function Sidebar() {
    return (
        <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 text-white">

            <div className="p-6">

                <h1 className="text-xl font-bold text-cyan-400">
                    Microservices
                </h1>

            </div>

            <nav className="px-4">

                <ul className="space-y-3">

                    <li>
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `block p-3 rounded-lg ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            📊 Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/register"
                            className={({isActive}) =>
                                `block p-3 rounded-lg ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            👤 Register
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/login"
                            className={({isActive}) =>
                                `block p-3 rounded-lg ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            🔐 Login
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/products"
                            className={({isActive}) =>
                                `block p-3 rounded-lg ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            📦 Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/orders"
                            className={({isActive}) =>
                                `block p-3 rounded-lg ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            🛒 Orders
                        </NavLink>
                    </li>

                </ul>

            </nav>

        </div>
    );
}

export default Sidebar;