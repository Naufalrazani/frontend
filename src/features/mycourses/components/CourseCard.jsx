import React from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

const CourseCard = ({ course }) => {
  const {
    title = "Judul Kursus Tidak Ditemukan",
    status,
    progress: progressText = "0%",
    last_opened: lastOpenedText = "Belum pernah dibuka",
    completed_at: completedAt = null,
    modules: modulesText = "0/0 modul",
  } = course || {};

  const progressValue = parseFloat(progressText.replace("%", "")) || 0;
  const isCompleted = progressValue === 100 || status === "completed";

  const buttonLabel = isCompleted ? "Lihat Sertifikat" : "Lanjutkan Belajar";

  return (
    <article
      className="
        bg-white border border-primary-200 rounded-xl shadow-md
        p-4 sm:p-6
        flex flex-col lg:flex-row
        justify-between
        gap-4
        transition
        hover:shadow-lg hover:border-red-300
      "
    >
      <div className="flex-1 min-w-0">
        <header className="mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-primary-800 truncate">
            {title}
          </h3>

          {isCompleted && (
            <div className="mt-1 flex items-center text-xs font-semibold text-green-600">
              <FiCheckCircle className="w-4 h-4 mr-1" />
              SELESAI
            </div>
          )}
        </header>

        <section className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-primary-500 mb-4">
          <div className="flex items-center">
            <FiBookOpen className="w-4 h-4 mr-1.5" />
            {modulesText}
          </div>

          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1.5" />
            Terakhir dibuka: {lastOpenedText}
          </div>

          {completedAt && (
            <div className="flex items-center">
              <FiCalendar className="w-4 h-4 mr-1.5" />
              Selesai: {completedAt}
            </div>
          )}
        </section>

        <div className="w-full">
          <p className="text-sm font-semibold text-primary-600 mb-1">
            Progres:{" "}
            <span className="font-extrabold text-red-600">{progressText}</span>
          </p>

          <div
            className="w-full bg-primary-200 rounded-full h-2.5"
            role="progressbar"
            aria-valuenow={progressValue}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="h-2.5 rounded-full bg-red-600 transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto flex items-center">
        <button
          className="
            w-full lg:w-auto
            flex items-center justify-center gap-2
            px-4 py-2
            rounded-lg
            text-sm font-semibold text-white
            bg-red-600 hover:bg-red-700
            transition shadow-md cursor-pointer
          "
        >
          {isCompleted ? (
            <FiCheckCircle className="w-5 h-5" />
          ) : (
            <FiBookOpen className="w-5 h-5" />
          )}
          <span>{buttonLabel}</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

export default CourseCard;
