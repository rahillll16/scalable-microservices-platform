import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {

    return (

        <div className="flex bg-slate-950">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;