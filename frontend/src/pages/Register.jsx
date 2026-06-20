import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";


function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);


    // for Filling Data
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // for Submitting
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = await registerUser(formData);

            console.log(data);

            alert("User Registered Succesfully");

            navigate("/login");

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch(error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (
        
        <div className="max-w-lg mx-auto">

            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Register User
            </h1>

            <form 
                onSubmit={handleSubmit}
                className="bg-slate-900 p-6 rounded-xl space-y-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>

                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded text-white font-semibold"
                >
                    Register
                </button>

                <div className="text-center text-gray-400">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-cyan-400 ml-2 hover:underline"
                    >
                        Login
                    </Link>

                </div>

            </form>

        </div>
    );
}

export default Register;