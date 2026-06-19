import api from "../api/api";

export const getLoadBalancerStatus = async () => {
    const response = await api.get("/load-balancer-status");
    return response.data;
};