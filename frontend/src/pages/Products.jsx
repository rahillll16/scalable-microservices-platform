import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createProduct,
    getAllProducts,
    deleteProduct,
    updateProduct
} from "../services/productService";

function Products() {

    const navigate = useNavigate();

    const isAdmin = localStorage.getItem("role") === "admin";

    const [products, setProducts] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: ""
    });

    const fetchProducts = async () => {

        try {
    
            const data = await getAllProducts();
    
            setProducts(data.products);
    
        } catch(error) {
    
            console.log(error);
        }
    };
    
    useEffect(() => {
    
        fetchProducts();
    
    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("Editing ID:", editingId);
    
        try {
    
            if(editingId){

                await updateProduct(
                    editingId,
                    {
                        ...formData,
                        price: Number(formData.price)
                    }
                );
            
                alert("Product Updated");
            
                setEditingId(null);
            
            }else{
            
                await createProduct(
                    {
                        ...formData,
                        price: Number(formData.price)
                    }
                );
            
                alert("Product Created");
            }
    
            fetchProducts();

            setFormData({
                name: "",
                description: "",
                price: ""
            });
    
        } catch(error) {
    
            alert(
                error.response?.data?.message ||
                editingId
                    ? "Failed To Update Product"
                    : "Failed To Create Product"
            );
        }
    };

    const handleDelete = async (id) => {

        try {
    
            await deleteProduct(id);
    
            alert("Product Deleted");
    
            fetchProducts();
    
        } catch(error) {
    
            console.log(error);
    
            alert("Delete Failed");
        }
    };

    const handleEdit = (product) => {

        setEditingId(product._id);
    
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price
        });
    };

    const handleOrderNow = (product) => {

        navigate("/orders", {
            state: {
                productId: product._id,
                productName: product.name
            }
        });
    };

    const filteredProducts = products.filter((product) =>
        product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
    
            <div className="mb-6">
    
                <h1 className="text-3xl font-bold text-white">
                    Products
                </h1>
    
                <p className="text-gray-400 mt-1">
                    Add and manage your products
                </p>
    
            </div>
    
            {
                isAdmin && (
                    <form
                        onSubmit={handleSubmit}
                        className="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-xl
                            p-5
                            mb-6
                        "
                    >
    
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. iPhone 16"
                                value={formData.name}
                                onChange={handleChange}
                                className="
                                    p-3
                                    rounded-lg
                                    bg-slate-800
                                    text-white
                                    border
                                    border-slate-700
                                "
                            />
    
                            <textarea
                                name="description"
                                placeholder="e.g. Latest smartphone from Apple"
                                value={formData.description}
                                onChange={handleChange}
                                rows="1"
                                className="
                                    p-3
                                    rounded-lg
                                    bg-slate-800
                                    text-white
                                    border
                                    border-slate-700
                                "
                            />
    
                            <input
                                type="number"
                                name="price"
                                placeholder="e.g. 84999"
                                value={formData.price}
                                onChange={handleChange}
                                className="
                                    p-3
                                    rounded-lg
                                    bg-slate-800
                                    text-white
                                    border
                                    border-slate-700
                                "
                            />
    
                            <button
                                type="submit"
                                className="
                                    bg-cyan-600
                                    hover:bg-cyan-700
                                    rounded-lg
                                    text-white
                                    font-semibold
                                "
                            >
                                {
                                    editingId
                                        ? "Update Product"
                                        : "Add Product"
                                }
                            </button>
    
                        </div>
    
                        {
                            editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
    
                                        setFormData({
                                            name: "",
                                            description: "",
                                            price: ""
                                        });
                                    }}
                                    className="
                                        mt-4
                                        bg-gray-600
                                        hover:bg-gray-700
                                        px-4
                                        py-2
                                        rounded-lg
                                        text-white
                                    "
                                >
                                    Cancel Edit
                                </button>
                            )
                        }
    
                    </form>
                )
            }
    
            <div className="mb-6">
    
                <input
                    type="text"
                    placeholder="🔍 Search Products..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="
                        w-full
                        p-3
                        rounded-lg
                        bg-slate-800
                        text-white
                        border
                        border-slate-700
                    "
                />
    
            </div>
    
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-4
                "
            >
    
                {
                    filteredProducts.map((product) => (
    
                        <div
                            key={product._id}
                            className="
                                bg-gradient-to-br
                                from-slate-900
                                to-slate-950
                                border
                                border-slate-800
                                rounded-xl
                                p-4
                                min-h-[220px]
                                flex
                                flex-col
                                justify-between
                                hover:border-cyan-700
                                transition-all
                            "
                        >
    
                            <div>
    
                                <h2 className="text-xl font-bold text-white">
                                    {product.name}
                                </h2>
    
                                <p className="text-gray-400 mt-2 text-sm">
                                    {product.description}
                                </p>
    
                                <p className="text-cyan-400 mt-4 font-semibold">
                                    ₹ {product.price}
                                </p>
    
                            </div>
    
                            {
                                isAdmin ? (
    
                                    <div className="flex justify-end mt-6">
    
                                        <button
                                            onClick={() =>
                                                handleDelete(product._id)
                                            }
                                            className="
                                                bg-red-600
                                                hover:bg-red-700
                                                px-3
                                                py-1
                                                rounded
                                                text-white
                                                text-sm
                                            "
                                        >
                                            Delete
                                        </button>
    
                                    </div>
    
                                ) : (
    
                                    <button
                                        onClick={() =>
                                            handleOrderNow(product)
                                        }
                                        className="
                                            w-full
                                            mt-6
                                            bg-cyan-600
                                            hover:bg-cyan-700
                                            py-2
                                            rounded-lg
                                            text-white
                                        "
                                    >
                                        Order Now
                                    </button>
    
                                )
                            }
    
                        </div>
    
                    ))
                }
    
            </div>
    
            {
                filteredProducts.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        No products found
                    </div>
                )
            }
    
        </div>
    );
}

export default Products;