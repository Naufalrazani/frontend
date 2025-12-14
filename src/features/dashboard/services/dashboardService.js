import { apiClient } from "@shared/services/apiClient";

const DASHBOARD_ENDPOINT = "/dashboard";

const DashboardService = {
  getDashboardData: async () => {
    const response = await apiClient.get(DASHBOARD_ENDPOINT);
    return response.data.data;
  },
};

export default DashboardService;
