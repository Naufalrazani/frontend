import React from "react";
import { FiLoader, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import InsightCard from "../components/InsightCard";
import StrengthWeaknessAnalysis from "../components/StrengthWeaknessAnalysis";
import QuizPerformanceComparison from "../components/QuizPerformanceComparison";
import ConsistencyTrendChart from "../components/ConsistencyTrendChart";
import { InsightProvider } from "../context/InsightContext";
import { useInsights } from "../hooks/useInsights";

const InsightsPageContent = () => {
  const {
    loading,
    error,
    refetch,
    learning_style_detection,
    weekly_recommendations,
    weekly_metrics_summary,
    strengths_and_weaknesses,
    consistency_trend,
  } = useInsights();

  const {
    detected_style: style = "N/A",
    model_confidence: confidence = "0%",
    description: styleDescription = "Pola belajar belum terdeteksi.",
  } = learning_style_detection || {};

  const learningStyleColorMap = {
    "Consistent Learner": "text-blue-600",
    "Fast Learner": "text-yellow-600",
    "Reflective Learner": "text-green-600",
  };

  const learningStyleColor = learningStyleColorMap[style] || "text-gray-500";

  const {
    average_study_time: studyTime = "0 jam/hari",
    modules_completed: modulesCompleted = "0 modul",
    average_quiz_score: quizScore = "0 pts",
    active_days: activeDays = "0 hari",
  } = weekly_metrics_summary || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <FiLoader
          className="animate-spin text-red-500 text-5xl"
          aria-label="Memuat"
        />
        <p className="ml-4 text-primary-600">
          Menganalisis data pembelajaran...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] p-8">
        <div className="text-red-700 bg-red-100 p-6 rounded-xl shadow-md border-l-4 border-red-500 flex flex-col items-center">
          <FiAlertTriangle className="text-3xl mb-3" />
          <h2 className="text-xl font-semibold">Gagal Memuat Insight</h2>
          <p className="mt-2 text-center text-sm">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm flex items-center transition"
          >
            <FiRefreshCw className="mr-2 w-4 h-4" /> Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h2 className="text-xl md:text-3xl font-bold text-primary-900">
        Learning Insights
      </h2>
      <p className="text-sm text-primary-500 mt-1 mb-3 lg:mb-5">
        Analisis mendalam mengenai gaya belajar, kekuatan, dan rekomendasi
        mingguan.
      </p>

      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8"
        aria-label="Key Performance Indicators"
      >
        <InsightCard
          title="Gaya Belajar Terdeteksi"
          value={style}
          description={styleDescription}
          color={learningStyleColor}
        />
        <InsightCard
          title="Rekomendasi Mingguan"
          value={
            <ul className="list-disc ml-4 mt-2 space-y-1 text-xs md:text-base text-primary-700">
              {weekly_recommendations && weekly_recommendations.length > 0 ? (
                weekly_recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))
              ) : (
                <li>Tidak ada rekomendasi khusus minggu ini.</li>
              )}
            </ul>
          }
          description="Saran peningkatan berdasarkan performa minggu ini."
          color="text-blue-600"
          isList={true}
        />
        <InsightCard
          title="Kepercayaan Model"
          value={confidence}
          description={`Tingkat keyakinan model AI dalam mendeteksi pola '${style}'.`}
          color="text-green-600"
        />
        <InsightCard
          title="Ringkasan Metrik Mingguan"
          value={
            <ul className="list-disc ml-4 mt-2 space-y-1 text-xs md:text-base text-primary-700">
              <li>Waktu Belajar Rata-rata: {studyTime}</li>
              <li>Modul Selesai: {modulesCompleted}</li>
              <li>Skor Kuis Rata-rata: {quizScore}</li>
              <li>Hari Aktif: {activeDays}</li>
            </ul>
          }
          description="Data kinerja utama sepanjang minggu ini."
          color="text-primary-800"
          isList={true}
        />
      </section>

      <section className="mb-8" aria-label="Core Performance Breakdown">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-200">
          <h3 className="text-lg font-semibold mb-2 lg:mb-4 text-primary-800">
            Analisis Kelebihan dan Kelemahan
          </h3>
          <StrengthWeaknessAnalysis analysis={strengths_and_weaknesses} />
        </div>
      </section>

      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        aria-label="Supporting Data Charts"
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-200">
          <h3
            id="quiz-performance-title"
            className="text-lg font-semibold mb-2 lg:mb-4 text-primary-800"
          >
            Kinerja Kuis
          </h3>
          <p className="text-sm text-primary-500">
            Perbandingan skor Anda dengan rata-rata peserta
          </p>
          <QuizPerformanceComparison data={quizScore} />
          <p className="text-sm text-primary-500 mt-4">
            Bandingkan skor kuis Anda dengan rata-rata pengguna lain.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-200">
          <h3 className="text-lg font-semibold mb-2 lg:mb-4 text-primary-800">
            Tren Konsistensi Belajar
          </h3>
          <ConsistencyTrendChart data={consistency_trend} />
          <p className="text-sm text-primary-500 mt-4">
            Visualisasi seberapa konsisten Anda mengakses dan menyelesaikan
            modul sepanjang waktu.
          </p>
        </div>
      </section>
    </div>
  );
};

const InsightsPage = () => (
  <InsightProvider>
    <InsightsPageContent />
  </InsightProvider>
);

export default InsightsPage;
