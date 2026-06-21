function Navbar() {

    const name = localStorage.getItem("name");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        window.location.href = "/login";
    };

    return (

        <div className="
            h-16
            bg-slate-900
            border-b
            border-slate-800
            flex
            items-center
            justify-between
            px-6
        ">

            <h2 className="text-white text-xl font-semibold">
                Welcome, {name || "User"}
            </h2>

            <button
                onClick={handleLogout}
                className="
                    bg-red-600
                    hover:bg-red-700
                    px-4
                    py-2
                    rounded
                    text-white
                "
            >
                Logout
            </button>

        </div>

    );
}

export default Navbar;