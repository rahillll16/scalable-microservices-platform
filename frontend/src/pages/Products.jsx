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
        <div>

            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Products
                </h1>

                { 
                    isAdmin && (   
                        <form
                            onSubmit={handleSubmit}
                            className="bg-slate-900 p-6 rounded-xl space-y-4 mb-8"
                        >

                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-800 text-white"
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-800 text-white"
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-800 text-white"
                            />

                            <div className="flex gap-2">

                            <button
                                type="submit"
                                className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded text-white"
                            >
                                {
                                    editingId
                                        ? "Update Product"
                                        : "Add Product"
                                }
                            </button>

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
                                        className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white"
                                    >
                                        Cancel
                                    </button>
                                )
                            }

                            </div>

                        </form>
                    )
                }

            </div>


            <div className="max-w-3xl mx-auto">
                <input
                    type="text"
                    placeholder="🔍 Search Products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                        w-full
                        p-3
                        mb-6
                        rounded
                        bg-slate-800
                        text-white
                    "
                />
            </div>

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-4
            ">

                {
                    filteredProducts.map((product) => (

                        <div
                            key={product._id}
                            className="bg-slate-900 p-4 rounded-lg border border-slate-700"
                        >

                            <h2 className="text-xl font-bold text-white">
                                {product.name}
                            </h2>

                            <p className="text-gray-400 mt-2">
                                {product.description}
                            </p>

                            <p className="text-cyan-400 mt-2">
                                ₹ {product.price}
                            </p>
                            {
                                !isAdmin && (
                                    <button
                                    onClick={() => handleOrderNow(product)}
                                    className="
                                        w-full
                                        mt-4
                                        bg-cyan-600
                                        hover:bg-cyan-700
                                        px-3
                                        py-2
                                        rounded
                                        text-white
                                    "
                                >
                                    Order Now
                                </button>
                                )
                            }

                            { 
                                isAdmin && (
                                    <div className="flex gap-2 mt-4">

                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded text-white"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                )
                            }

                        </div>
                    ))
                }

                {
                    filteredProducts.length === 0 && (
                        <div className="text-center text-gray-400 mt-6">
                            No products found
                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default Products;