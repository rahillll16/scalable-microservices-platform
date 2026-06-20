import { BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {

    return (

        <BrowserRouter>

            <DashboardLayout>

                <Routes>

                    <Route
                        path = "/"
                        element = {<Dashboard/>}
                    />

                    <Route
                        path = "/login"
                        element = {<Login/>}
                    />

                    <Route
                        path = "/register"
                        element = {<Register/>}
                    />

                    <Route
                        path = "/products"
                        element = {<Products/>}
                    />

                    <Route
                        path = "/orders"
                        element = {<Orders/>}
                    />

                </Routes>

            </DashboardLayout>

        </BrowserRouter>

    );
}

export default App;