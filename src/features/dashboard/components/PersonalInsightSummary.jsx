import React, { useState, useRef } from "react";
import { IoFlashOutline } from "react-icons/io5";
import { FiZap, FiCalendar, FiGlobe } from "react-icons/fi";
import { useDashboard } from "../hooks/useDashboard";

const iconColors = {
  "Fast Learner": "text-yellow-600",
  "Consistent Learner": "text-blue-600",
  "Reflective Learner": "text-green-600",
  default: "text-primary-500",
};

const LEARNER_STYLES = [
  {
    title: "Fast Learner",
    icon: IoFlashOutline,
    description:
      "Cepat menyelesaikan materi dan berpindah modul dengan cepat. Cocok dengan tantangan singkat dan target jelas.",
  },
  {
    title: "Consistent Learner",
    icon: FiCalendar,
    description:
      "Belajar rutin dengan sesi singkat namun konsisten, menjaga kontinuitas dan retensi jangka panjang.",
  },
  {
    title: "Reflective Learner",
    icon: FiGlobe,
    description:
      "Mendalami materi dengan pengulangan dan refleksi untuk pemahaman konseptual yang kuat.",
  },
];

const InsightTooltipWrapper = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 120);
  };

  return (
    <div
      className="relative h-full focus:outline-none"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={show}
      tabIndex={0}
    >
      {children}
      <div
        className={`
          pointer-events-none absolute z-20 w-52
          left-1/2 -translate-x-1/2 bottom-full mb-3
          transition-all duration-300 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        role="tooltip"
      >
        <div className="bg-primary-900 text-white text-xs p-3 rounded-lg shadow-xl">
          {content}
        </div>
      </div>
    </div>
  );
};

const PersonalInsightSummary = ({ profile = {} }) => {
  const { data } = useDashboard();

  const detectedStyle = profile.detected_style ?? "N/A";
  const summaryText =
    profile.summary_text ?? "Tidak ada ringkasan yang tersedia.";
  const confidenceValue = profile.confidence ?? 0;

  const todaysRecommendationTitle =
    data?.todays_recommendation?.title ||
    "Lakukan review materi 15 menit hari ini.";

  const todaysRecommendationTime =
    data?.todays_recommendation?.estimated_time || "15 min";

  if (Object.keys(profile).length === 0) {
    return (
      <aside className="p-6 bg-white rounded-xl shadow-sm text-primary-500">
        <p className="font-semibold">Menunggu Analisis Profil...</p>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col gap-6">
      <section className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <p className="text-xs font-semibold text-orange-600 mb-2 flex items-center">
          <FiZap className="mr-1" /> Rekomendasi Hari Ini
          <span className="ml-2 px-2 py-0.5 bg-orange-100 rounded-full font-bold">
            {todaysRecommendationTime}
          </span>
        </p>

        <h3 className="text-lg lg:text-xl font-extrabold text-primary-800">
          {todaysRecommendationTitle}
        </h3>

        <p className="text-sm text-primary-500 mt-2">
          AI menyarankan fokus ini berdasarkan pola belajar terakhir Anda.
        </p>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg lg:text-xl font-extrabold text-primary-800 mb-4">
          Personal Insight Summary
        </h3>

        <p className="text-sm text-primary-600 font-medium mb-6">
          {summaryText}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEARNER_STYLES.map((card, index) => {
            const Icon = card.icon;
            const isDetected = card.title === detectedStyle;
            const iconColorClass = iconColors[card.title] || iconColors.default;

            return (
              <InsightTooltipWrapper key={index} content={card.description}>
                <article
                  className={`
                     h-full px-3 py-4 rounded-xl border
                    transition-all duration-300 ease-out
                    cursor-pointer select-none flex flex-col items-center
                    ${
                      isDetected
                        ? "border-red-500 bg-red-50 shadow-lg scale-[1.03]"
                        : "border-primary-200 bg-white opacity-70 hover:opacity-100 hover:shadow-md hover:-translate-y-1"
                    }
                  `}
                >
                  <Icon
                    className={`w-8 h-8 mb-2 transition-transform duration-300  ${iconColorClass}`}
                  />

                  <h5 className="text-sm font-extrabold text-primary-800 text-center">
                    {card.title}
                  </h5>

                  <p className="text-xs text-primary-500 mt-2 text-center">
                    {isDetected
                      ? `Confidence ${confidenceValue.toFixed(1)}%`
                      : "Klik untuk detail"}
                  </p>
                </article>
              </InsightTooltipWrapper>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default PersonalInsightSummary;
