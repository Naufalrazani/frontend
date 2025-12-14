import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import InsightService from "../services/insightService";
import { useAuth } from "@features/auth/hooks/useAuth";

const initialInsightsState = {
  learning_style_detection: {},
  weekly_recommendations: [],
  weekly_metrics_summary: {},
  strengths_and_weaknesses: { strengths: [], weaknesses: [] },
  consistency_trend: [],
};

const initialGlobalState = {
  insights: initialInsightsState,
  loading: true,
  error: null,
};

const InsightContext = createContext(undefined);

export const InsightProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [state, setState] = useState(initialGlobalState);

  const fetchInsights = useCallback(async () => {
    if (!isLoggedIn) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const apiResponse = await InsightService.getLearningInsights();

      setState((prev) => ({
        ...prev,
        insights: apiResponse,
      }));
    } catch (err) {
      console.error("Failed to fetch insights:", err);
      setState((prev) => ({
        ...prev,
        error: err.message || "Gagal memuat data insight.",
        insights: initialInsightsState,
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const value = {
    ...state.insights,
    loading: state.loading,
    error: state.error,
    refetch: fetchInsights,
  };

  return (
    <InsightContext.Provider value={value}>{children}</InsightContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInsights = () => {
  const context = useContext(InsightContext);
  if (context === undefined) {
    throw new Error("useInsights must be used within an InsightProvider");
  }
  return context;
};
