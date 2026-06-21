import { BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {

    return (

        <BrowserRouter>

            <DashboardLayout>

            <Routes>

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                </Routes>

            </DashboardLayout>

        </BrowserRouter>

    );
}

export default App;