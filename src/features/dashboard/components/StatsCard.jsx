import React from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiCalendar,
  FiBook,
} from "react-icons/fi";

const getComparisonIcon = (className, title) => {
  if (title.includes("Akses Konsisten")) {
    return <FiCalendar className="w-4 h-4 mr-1" aria-hidden="true" />;
  }
  if (title.includes("Modul Selesai")) {
    return (
      <FiBook className="w-4 h-4 mr-1 text-yellow-500" aria-hidden="true" />
    );
  }
  if (className?.includes("text-green")) {
    return (
      <FiTrendingUp
        className="w-3 h-3 lg:w-4 lg:h-4 mr-1 block"
        aria-hidden="true"
      />
    );
  }
  if (className?.includes("text-red")) {
    return <FiTrendingDown className="w-4 h-4 mr-1 block" aria-hidden="true" />;
  }
  return <FiAlertCircle className="w-4 h-4 mr-1 block" aria-hidden="true" />;
};

const StatsCard = ({ title, value, comparison, comparisonClass }) => {
  return (
    <article
      className="bg-white p-5 grainy-border flex flex-col justify-between h-full"
      aria-label={`Statistik ${title}: Nilai saat ini ${value}. Perbandingan ${comparison}.`}
    >
      <div>
        <h3
          className="text-sm font-medium text-primary-500"
          id={`stat-title-${title.replace(/\s/g, "-")}`}
        >
          {title}
        </h3>
        <p
          className="text-xl md:text-3xl font-bold text-primary-900 mt-1"
          role="status"
          aria-live="polite"
          aria-labelledby={`stat-title-${title.replace(/\s/g, "-")}`}
        >
          {value}
        </p>
      </div>
      <div className="mt-2 lg:mt-3 text-[10px] md:text-sm flex items-center">
        <span
          className={`font-semibold flex items-center ${
            comparisonClass || "text-primary-500"
          }`}
        >
          {getComparisonIcon(comparisonClass, title)}

          <span aria-hidden="true">{comparison}</span>
        </span>
      </div>
    </article>
  );
};

export default StatsCard;
