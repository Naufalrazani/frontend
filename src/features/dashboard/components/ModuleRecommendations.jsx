import React from "react";
import { FiClock, FiPlayCircle, FiZap } from "react-icons/fi";

const ModuleRecommendations = ({ data = [], learnerType = "Pengguna" }) => {
  if (data.length === 0) {
    return (
      <div
        className="p-4 text-center bg-blue-50 border border-blue-200 rounded-lg text-blue-800"
        role="status"
        aria-live="polite"
      >
        <p className="font-semibold flex items-center justify-center">
          <FiZap className="w-4 h-4 mr-2" aria-hidden="true" /> Tidak ada
          rekomendasi modul saat ini.
        </p>
        <p className="text-sm mt-1">
          Lanjutkan belajar! Analisis AI Anda akan diperbarui segera.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="recommendation-list-title">
      <p className="text-sm text-primary-500 italic mb-4">
        Rekomendasi modul di bawah ini disesuaikan untuk tipe pelajar{" "}
        {learnerType} Anda.
      </p>

      <ul className="space-y-4" role="list">
        {data.map((module, index) => (
          <li key={index} role="listitem">
            <a
              href="#"
              className="flex justify-between items-center p-4 border border-primary-200 rounded-lg bg-white hover:bg-primary-100 transition focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:outline-none"
              aria-label={`Mulai modul ${module.title}. Perkiraan waktu ${module.estimated_time}`}
            >
              <div>
                <p className="font-semibold text-primary-800">{module.title}</p>
                <p className="text-sm text-primary-500 flex items-center mt-1">
                  <FiClock className="w-4 h-4 mr-1" aria-hidden="true" />
                  <span aria-label={`Perkiraan waktu`}>
                    Estimated: {module.estimated_time || "N/A"}
                  </span>
                </p>
              </div>

              <FiPlayCircle
                className="text-red-500 w-6 h-6 ml-4 shrink-0"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ModuleRecommendations;
