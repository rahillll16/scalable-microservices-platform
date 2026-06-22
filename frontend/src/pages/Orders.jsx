import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
    createOrder,
    getOrdersByUserId,
    deleteOrder
} from "../services/orderService";

import { getProductById } from "../services/productService";

function Orders() {

    const location = useLocation();

    const selectedProduct = location.state || null;

    const [quantity, setQuantity] = useState(1);

    const [orders, setOrders] = useState([]);

    const handleCreateOrder = async () => {

        try {
    
            const token =
                localStorage.getItem("token");
    
            const decoded =
                jwtDecode(token);
    
            await createOrder({
                userId: decoded.userId,
                productId: selectedProduct.productId,
                quantity
            });
    
            alert("Order Created Successfully");

            fetchOrders();
    
        } catch(error) {
    
            alert(
                error.response?.data?.message ||
                "Failed To Create Order"
            );
        }
    };

    const fetchOrders = async () => {

        try {
    
            const token =
                localStorage.getItem("token");
    
            const decoded =
                jwtDecode(token);
    
            const data =
                await getOrdersByUserId(
                    decoded.userId
                );

            const enrichedOrders = await Promise.all(

                data.orders.map(async (order) => {
                
                    try {
                
                        const productData =
                            await getProductById(
                                order.productId
                            );
                
                        return {
                            ...order,
                            product: productData.product
                        };
                
                    } catch {
                
                        return {
                            ...order,
                            product: null
                        };
                    }
                })
            );
    
            setOrders(enrichedOrders);
    
        } catch(error) {
    
            console.log(error);
        }
    };

    const handleDeleteOrder = async (id) => {

        try {
    
            await deleteOrder(id);
    
            alert("Order Deleted");
    
            fetchOrders();
    
        } catch(error){
    
            alert(
                error.response?.data?.message ||
                "Delete Failed"
            );
        }
    };

    const grandTotal = orders.reduce(
        (sum, order) =>
            sum +
            ((order.product?.price || 0) * order.quantity),
        0
    );

    useEffect(() => {

        fetchOrders();
    
    }, []);

    return (
        <div >
    
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Orders
            </h1>
    
            <div className="max-w-2xl mx-auto">
    
                <div className="bg-slate-900 p-6 rounded-xl">
    
                    <h2 className="text-xl text-white font-bold mb-4">
                        Create Order
                    </h2>
    
                    <p className="text-gray-300 mb-4">
                        Product:
                        <span className="text-cyan-400 ml-2">
                            {
                                selectedProduct?.productName ||
                                "No Product Selected"
                            }
                        </span>
                    </p>
    
                    <label className="block text-gray-300 mb-2">
                        Quantity
                    </label>
    
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Number(e.target.value))
                        }
                        className="
                            w-full
                            p-3
                            rounded
                            bg-slate-800
                            text-white
                        "
                    />
    
                    <button
                        onClick={handleCreateOrder}
                        className="
                            w-full
                            mt-4
                            bg-cyan-600
                            hover:bg-cyan-700
                            px-4
                            py-3
                            rounded
                            text-white
                        "
                    >
                        Create Order
                    </button>
    
                </div>

                <div className="max-w-2xl mx-auto mt-8">

                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        My Orders
                    </h2>

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-3
                            gap-4
                        "
                    >

                        {
                            orders.map((order) => (

                                <div
                                    key={order._id}
                                    className="
                                        bg-slate-900
                                        p-4
                                        rounded-lg
                                        border
                                        border-slate-700
                                    "
                                >

                                    <h3 className="text-xl font-bold text-white">
                                        {
                                            order.product?.name ||
                                            "Product Not Found"
                                        }
                                    </h3>

                                    <p className="text-gray-400 mt-2">
                                        {
                                            order.product?.description
                                        }
                                    </p>

                                    <p className="text-cyan-400 mt-2">
                                        ₹ {order.product?.price}
                                    </p>

                                    <p className="text-gray-300 mt-2">
                                        Quantity: {order.quantity}
                                    </p>

                                    <p className="text-green-400 font-semibold mt-2">
                                        Total: ₹ {
                                            (order.product?.price || 0) *
                                            order.quantity
                                        }
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleDeleteOrder(order._id)
                                        }
                                        className="
                                            w-full
                                            mt-4
                                            bg-red-600
                                            hover:bg-red-700
                                            py-2
                                            rounded
                                            text-white
                                        "
                                    >
                                        Delete Order
                                    </button>

                                </div>

                            ))
                        }

                    </div>

                    <div className="
                        bg-slate-900
                        p-4
                        rounded-lg
                        mb-6
                        text-center
                    ">
                        <h3 className="text-white text-xl font-bold">
                            Total Order Value
                        </h3>

                        <p className="text-green-400 text-2xl font-bold mt-2">
                            ₹ {grandTotal}
                        </p>
                    </div>

                    <button
                        disabled={orders.length === 0}
                        className={`
                            mt-4
                            px-6
                            py-3
                            rounded
                            text-white
                            font-semibold
                            ${
                                orders.length === 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }
                        `}
                        onClick={() =>
                            alert("Checkout Coming Soon 🚀")
                        }
                    >
                        Checkout
                    </button>

                </div>
    
            </div>
    
        </div>
    );
}

export default Orders;