
function Sidebar() {
    return (
        <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 text-white">

            <div className="p-6">

                <h1 className="text-xl font-bold">
                    Command Center
                </h1>

            </div>

            <nav className="px-4">

                <ul className="space-y-3">

                    <li>🏠 Dashboard</li>

                    <li>📊 System Health</li>

                    <li>⚖️ Load Balancer</li>

                    <li>🛡️ Circuit Breakers</li>

                    <li>⚡ Redis Analytics</li>

                    <li>🏗️ Infrastructure</li>

                    <li>📜 Activity Feed</li>

                </ul>

            </nav>

        </div>
    );
}

export default Sidebar;