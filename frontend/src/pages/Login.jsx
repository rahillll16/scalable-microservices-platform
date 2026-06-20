import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = await loginUser(formData);

            localStorage.setItem(
                "token",
                data.token
            );

            alert("Login Successful");

            navigate("/");

        } catch(error) {

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (

        <div className="max-w-lg mx-auto">

            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Login
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 p-6 rounded-xl space-y-4"
            >

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <div className="relative">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-slate-800 text-white"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {
                            showPassword
                                ? "🙈"
                                : "👁️"
                        }
                    </button>

                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-600 p-3 rounded text-white font-semibold"
                >
                    Login
                </button>

                <div className="text-center text-gray-400">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-cyan-400 ml-2"
                    >
                        Register
                    </Link>

                </div>

            </form>

        </div>
    );
}

export default Login;