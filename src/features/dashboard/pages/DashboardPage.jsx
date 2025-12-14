import React from "react";
import StatsCard from "../components/StatsCard";
import LearningTrendChart from "../components/LearningTrendChart";
import PersonalInsightSummary from "../components/PersonalInsightSummary";
import ModuleRecommendations from "../components/ModuleRecommendations";
import { useDashboard } from "../hooks/useDashboard";
import { CiCircleAlert } from "react-icons/ci";
import { LuLoader } from "react-icons/lu";
import { IoReload } from "react-icons/io5";

const DashboardPage = () => {
  const { data, loading, error, refreshAIAnalysis, isRefreshingAI } =
    useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LuLoader
          className="animate-spin text-red-500 text-5xl"
          aria-label="Memuat data"
        />
        <p className="ml-4 text-primary-600">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-700 bg-red-100 rounded-xl shadow-md border-l-4 border-red-500 min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <CiCircleAlert className="mr-3 text-2xl" /> Gagal Memuat Dashboard
        </h2>
        <p className="mt-2 text-center text-sm">{error}</p>
        <button
          onClick={refreshAIAnalysis}
          disabled={isRefreshingAI}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center disabled:opacity-50 transition duration-150"
          aria-label={isRefreshingAI ? "Mencoba Ulang Data" : "Muat Ulang Data"}
        >
          {isRefreshingAI ? (
            <LuLoader className="animate-spin mr-2" />
          ) : (
            <IoReload className="mr-2" />
          )}
          {isRefreshingAI ? "Mencoba Ulang..." : "Coba Muat Ulang Data"}
        </button>
      </div>
    );
  }

  if (!data) return null;

  const {
    learner_profile = {},
    statistics = {},
    weekly_trend = [],
    recommendations = [],
  } = data;

  const totalStudyTime = statistics.total_study_time || {};
  const completedModules = statistics.completed_modules || {};
  const averageQuizScore = statistics.average_quiz_score || {};
  const consistencyOfAccess = statistics.consistency_of_access || {};

  const totalHoursValue = totalStudyTime.value || "0 h";
  const completedModulesValue = completedModules.value ?? 0;
  const averageQuizScoreValue = averageQuizScore.value || "0";
  const consistencyAccessValue = consistencyOfAccess.value || "0%";
  const learnerType = learner_profile.detected_style ?? "N/A";

  const totalStudyComparison = totalStudyTime.comparison || "N/A";
  const averageQuizTrend = averageQuizScore.trend || "N/A";
  const consistencyDaysActive = consistencyOfAccess.days_active || "N/A";
  const displayStats = [
    {
      title: "Total Jam Belajar",
      value: totalHoursValue,
      comparison: totalStudyComparison,
      comparisonClass: totalStudyComparison.includes("+")
        ? "text-green-500"
        : "text-primary-500",
    },
    {
      title: "Modul Selesai",
      value: `${completedModulesValue}`,
    },
    {
      title: "Rata-rata Nilai Kuis",
      value: `${averageQuizScoreValue}%`,
      comparison: `Tren: ${averageQuizTrend}`,
      comparisonClass: averageQuizTrend.includes("+")
        ? "text-green-500"
        : "text-red-500",
    },
    {
      title: "Akses Konsisten",
      value: consistencyAccessValue,
      comparison: consistencyDaysActive,
      comparisonClass:
        consistencyAccessValue === "100%"
          ? "text-blue-600"
          : "text-primary-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <h2 className="text-xl md:text-3xl font-bold mb-3 lg:mb-5 text-primary-900">
        Dashboard
      </h2>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8">
        {displayStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            comparison={stat.comparison}
            comparisonClass={stat.comparisonClass}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6 mb-2 lg:mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-primary-200">
          <div className="mb-4 lg:mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary-800">
              Tren Pembelajaran
            </h3>
            <p className="text-sm text-primary-500 mb-4">
              Durasi belajar berdasarkan hari dalam periode terpilih
            </p>
            <LearningTrendChart data={weekly_trend} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 lg:mb-4 text-primary-800">
              Rekomendasi Modul (Personalized)
            </h3>
            <ModuleRecommendations
              data={recommendations}
              learnerType={learnerType}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <PersonalInsightSummary profile={learner_profile} />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
