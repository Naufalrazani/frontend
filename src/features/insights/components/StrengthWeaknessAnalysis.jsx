import React from "react";

const AnalysisSection = ({ title, items, isStrength }) => {
  return (
    <div className="mb-6">
      <h3
        className={`text-sm font-semibold flex items-center mb-3 ${
          isStrength ? "text-green-600" : "text-red-600"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-3" role="list">
        {Array.isArray(items) &&
          items.map((item, index) => (
            <li
              key={index}
              className="bg-primary-100 p-4 rounded-lg border border-primary-200"
              role="listitem"
            >
              <p
                className={`font-semibold text-primary-700"
                }`}
              >
                {item.title}
              </p>
              <p className="text-sm text-primary-600 mt-1">
                {item.explanation}
              </p>
            </li>
          ))}
      </ul>
      {(!items || items.length === 0) && (
        <p className="text-sm text-primary-500 italic p-4 bg-primary-50 rounded-lg">
          Tidak ada poin {isStrength ? "kekuatan" : "kelemahan"} yang terdeteksi
          minggu ini.
        </p>
      )}
    </div>
  );
};

const StrengthWeaknessAnalysis = ({ analysis }) => {
  const { strengths = [], weaknesses = [] } = analysis || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
      <AnalysisSection
        title="Kekuatan (Strengths)"
        items={strengths}
        isStrength={true}
      />
      <AnalysisSection
        title="Kelemahan (Weaknesses)"
        items={weaknesses}
        isStrength={false}
      />
    </div>
  );
};

export default StrengthWeaknessAnalysis;
