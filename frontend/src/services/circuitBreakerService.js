import api from "../api/api";

export const getCircuitBreakerStatus = async () => {

    const response = await api.get("/orders/circuit-breakers");

    return response.data;
};