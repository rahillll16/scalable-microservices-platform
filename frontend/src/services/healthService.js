import api from "../api/api";

export const getSystemHealth = async() => {
    const response = await api.get("/system-health");
    return response.data;
};
