import api from "../api/api";

export const createOrder = async (orderData) => {

    const response = await api.post(
        "/orders",
        orderData
    );

    return response.data;
};

export const getOrdersByUserId = async (userId) => {

    const response = await api.get(
        `/orders/user/${userId}`
    );

    return response.data;
};

export const deleteOrder = async (id) => {

    const response = await api.delete(
        `/orders/${id}`
    );

    return response.data;
};