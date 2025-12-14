/* eslint-disable react-hooks/static-components */
import React from "react";
import { CgStyle } from "react-icons/cg";
import { FiTarget, FiActivity, FiBarChart2 } from "react-icons/fi";

const getIcon = (title) => {
  if (title.includes("Gaya Belajar") || title.includes("Style")) return CgStyle;
  if (title.includes("Rekomendasi") || title.includes("Recommendations"))
    return FiTarget;
  if (title.includes("Kepercayaan") || title.includes("Confidence"))
    return FiActivity;
  if (title.includes("Metrik") || title.includes("Metrics")) return FiBarChart2;
  return FiActivity;
};

const InsightCard = ({ title, value, description, color, isList = false }) => {
  const Icon = getIcon(title);

  return (
    <article className="bg-white p-5 grainy-border flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-3">
          <Icon className="w-6 h-6 mr-2 text-primary-500" aria-hidden="true" />
          <h3 className="text-sm font-medium text-primary-500">{title}</h3>
        </div>

        {isList ? (
          <div className="font-medium text-primary-800">{value}</div>
        ) : (
          <h3
            className={`text-xl md:text-2xl font-extrabold ${color}`}
            aria-label={value}
          >
            {value}
          </h3>
        )}
      </div>
      <p
        className="text-[10px] md:text-sm flex text-primary-500 mt-3"
        aria-hidden="true"
      >
        {description}
      </p>
    </article>
  );
};

export default InsightCard;
