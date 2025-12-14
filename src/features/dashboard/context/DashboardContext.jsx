import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@features/auth/hooks/useAuth";
import DashboardService from "../services/dashboardService";

const DashboardContext = createContext(undefined);

const initialDashboardState = {
  learner_profile: {
    detected_style: "Memuat...",
    description: "Memuat deskripsi gaya belajar...",
    confidence: 0,
    summary_text: "Memuat ringkasan personal...",
    learner_types: [],
  },
  statistics: {
    total_study_time: { value: "0 h", comparison: "0h vs prev period" },
    completed_modules: { value: "0", comparison: "All-time Completed" },
    average_quiz_score: { value: "0", trend: "0 pts" },
    consistency_of_access: { value: "0%", days_active: "0 days" },
  },
  weekly_trend: [],
  recommendations: [],
  badges: [],
  todays_recommendation: {
    title: "Memuat rekomendasi harian...",
    estimated_time: "0 min",
  },
};

const getConfidenceAsNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleanedValue = value.replace("%", "");
    const num = parseFloat(cleanedValue);
    return isNaN(num) ? 0 : Math.min(100, num);
  }
  return 0;
};

const mapDetectedStyleToLearnerType = (styleString) => {
  if (!styleString) return [];
  const lowerCaseStyle = styleString.toLowerCase();

  if (lowerCaseStyle.includes("consistent")) return ["consistent"];
  if (lowerCaseStyle.includes("fast")) return ["fast"];
  if (lowerCaseStyle.includes("reflective")) return ["reflective"];

  return [];
};

const mapApiToState = (apiData) => {
  if (!apiData || Object.keys(apiData).length === 0) {
    return initialDashboardState;
  }

  const {
    learning_style_detection: lsd = {},
    metrics_cards: mc = {},
    learning_trend_chart: ltc = [],
    todays_recommendation: tr = {},
    personal_insight_summary: pis,
    module_recommendations: mr = [],
  } = apiData;

  const apiConfidence = getConfidenceAsNumber(lsd.model_confidence);

  const learnerTypes = mapDetectedStyleToLearnerType(lsd.detected_style);

  return {
    learner_profile: {
      detected_style:
        lsd.detected_style ||
        initialDashboardState.learner_profile.detected_style,
      confidence: apiConfidence,
      description:
        lsd.description || initialDashboardState.learner_profile.description,
      summary_text: pis || initialDashboardState.learner_profile.summary_text,
      learner_types: learnerTypes,
    },
    statistics: {
      total_study_time:
        mc.total_study_time ||
        initialDashboardState.statistics.total_study_time,
      completed_modules:
        mc.completed_modules ||
        initialDashboardState.statistics.completed_modules,
      average_quiz_score:
        mc.average_quiz_score ||
        initialDashboardState.statistics.average_quiz_score,
      consistency_of_access:
        mc.consistency_of_access ||
        initialDashboardState.statistics.consistency_of_access,
    },
    weekly_trend: ltc.map((item) => ({
      date: item.date,
      active_hour: item.active_hour || 0,
      active: item.active || false,
    })),

    recommendations: mr,
    badges: initialDashboardState.badges,

    todays_recommendation: {
      title: tr.title || initialDashboardState.todays_recommendation.title,
      estimated_time:
        tr.estimated_time ||
        initialDashboardState.todays_recommendation.estimated_time,
    },
  };
};

export const DashboardProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  const [data, setData] = useState(initialDashboardState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiResponse = await DashboardService.getDashboardData();
      const mappedData = mapApiToState(apiResponse);
      setData(mappedData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal memuat data Dashboard. Silakan muat ulang."
      );

      setData(initialDashboardState);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id]);

  const refreshAIAnalysis = useCallback(async () => {
    setIsRefreshingAI(true);
    setError(null);
    try {
      await DashboardService.triggerAIAnalysis();
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal memicu analisis AI."
      );
    } finally {
      setIsRefreshingAI(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchData();
    } else if (!isLoggedIn) {
      setData(initialDashboardState);
      setLoading(false);
    }
  }, [isLoggedIn, user?.id, fetchData]);

  const value = {
    data,
    loading,
    error,
    refetch: fetchData,
    refreshAIAnalysis,
    isRefreshingAI,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
