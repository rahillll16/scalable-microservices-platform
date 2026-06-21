import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

    const role = localStorage.getItem("role");

    if(role !== "admin"){
        return <Navigate to="/products" />;
    }

    return children;
}

export default AdminRoute;