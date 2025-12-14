import { apiClient } from "@shared/services/apiClient";

const INSIGHTS_ENDPOINT = "/insights";

const getLearningInsights = async () => {
  try {
    const response = await apiClient.get(INSIGHTS_ENDPOINT);

    const insights = response.data?.data || {};

    return insights;
  } catch (error) {
    console.error("Error fetching Learning Insights:", error);
    throw error;
  }
};

const InsightService = {
  getLearningInsights,
};

export default InsightService;
