import { NavLink } from "react-router-dom";


function Sidebar() {

    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = localStorage.getItem("role") === "admin";

    return (
        <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 text-white">

            <div className="p-6">

                <h1 className="text-xl font-bold text-cyan-400">
                    Microservices
                </h1>

            </div>

            <nav className="px-4">

            <ul className="space-y-3">

                {
                    !isLoggedIn && (
                        <>
                            <li>
                                <NavLink to="/register" >
                                    👤 Register
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/login" >
                                    🔐 Login
                                </NavLink>
                            </li>
                        </>
                    )
                }

                {
                    isLoggedIn && (
                        <>
                            <li>
                                <NavLink to="/">
                                    📊 Dashboard
                                </NavLink>
                            </li>

                            { (
                                <li>
                                    <NavLink to="/orders">
                                        🛒 Orders
                                    </NavLink>
                                </li>
                            )}
                        </>
                    )
                }

                {
                    <li>
                        <NavLink to="/products">
                            📦 Products
                        </NavLink>
                    </li>
                }

                </ul>

            </nav>

        </div>
    );
}

export default Sidebar;