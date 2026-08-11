import { NavLink } from "react-router-dom";

function Sidebar() {

    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = localStorage.getItem("role") === "admin";

    const navClass = ({ isActive }) =>
        `
        flex items-center gap-3
        px-4 py-3
        rounded-xl
        transition-all duration-300
        font-medium
        ${
            isActive
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
        }
    `;

    return (
        <aside className="
            w-64
            min-h-screen
            bg-gradient-to-b
            from-slate-950
            to-slate-900
            border-r
            border-slate-800
            flex
            flex-col
        ">

            {/* Logo */}

            <div className="
                p-6
                border-b
                border-slate-800
            ">

                <h1 className="
                    text-2xl
                    font-bold
                    text-cyan-400
                    tracking-wide
                ">
                    Microservices
                </h1>

                {/* <p className="text-slate-400 text-sm mt-1">
                    Platform Dashboard
                </p> */}

            </div>


            {/* Navigation */}

            <nav className="flex-1 p-4">

                <p className="
                    text-xs
                    uppercase
                    text-slate-500
                    mb-4
                    tracking-widest
                ">
                    Navigation
                </p>

                <ul className="space-y-2">

                    {
                        !isLoggedIn && (
                            <>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className={navClass}
                                    >
                                        <span>👤</span>
                                        Register
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/login"
                                        className={navClass}
                                    >
                                        <span>🔐</span>
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        )
                    }

                    {
                        isLoggedIn && (
                            <>
                                {/* <li>
                                    <NavLink
                                        to="/"
                                        className={navClass}
                                    >
                                        <span>📊</span>
                                        Dashboard
                                    </NavLink>
                                </li> */}

                                <li>
                                    <NavLink
                                        to="/orders"
                                        className={navClass}
                                    >
                                        <span>🛒</span>
                                        Orders
                                    </NavLink>
                                </li>
                            </>
                        )
                    }

                    <li>
                        <NavLink
                            to="/products"
                            className={navClass}
                        >
                            <span>📦</span>
                            Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/"
                            className={navClass}
                        >
                            <span>📊</span>
                                Dashboard
                        </NavLink>
                    </li>

                    {
                        isAdmin && (
                            <li>
                                <div className="
                                    mt-6
                                    mb-2
                                    text-xs
                                    uppercase
                                    text-slate-500
                                    tracking-widest
                                ">
                                    Admin
                                </div>

                                <div className="
                                    bg-slate-800
                                    rounded-xl
                                    p-4
                                    text-sm
                                    text-cyan-400
                                ">
                                    👑 Administrator
                                </div>
                            </li>
                        )
                    }

                </ul>

            </nav>

            {/* Footer */}

            <div className="
                p-4
                border-t
                border-slate-800
                text-center
            ">
                <p className="
                    text-sm
                    text-slate-500
                ">
                    © 2026 R Rahil
                </p>
            </div>

        </aside>
    );
}

export default Sidebar;