import React, { useMemo } from "react";
import { FiTrendingUp, FiTrendingDown, FiTarget } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MAX_SCORE = 100;

const SIZE = 240;
const OUTER_RADIUS = 120;
const INNER_RADIUS = 95;
const CX = SIZE / 2;
const CY = OUTER_RADIUS;

const START_ANGLE = 180;
const END_ANGLE = 0;

const Needle = ({ value, color, dashed = false }) => {
  const RADIAN = Math.PI / 180;
  const angle = START_ANGLE - (value / MAX_SCORE) * 180;
  const length = OUTER_RADIUS * 0.85;

  const x = CX + length * Math.cos(angle * RADIAN);
  const y = CY - length * Math.sin(angle * RADIAN);

  return (
    <g aria-hidden="true">
      <line
        x1={CX}
        y1={CY}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={dashed ? 2 : 3}
        strokeDasharray={dashed ? "4 4" : "0"}
      />
      <circle cx={x} cy={y} r={dashed ? 5 : 7} fill={color} />
    </g>
  );
};

const QuizPerformanceComparison = ({ data }) => {
  const userScore = useMemo(() => {
    if (!data) return 0;
    const match = String(data).match(/\d+/);
    return match ? Number(match[0]) : 0;
  }, [data]);

  const averageScore = 80;

  const isBetter = userScore >= averageScore;
  const difference = Math.abs(userScore - averageScore);

  const theme = useMemo(
    () =>
      isBetter
        ? {
            primary: "#16a34a",
            text: "text-green-600",
          }
        : {
            primary: "#dc2626",
            text: "text-red-600",
          },
    [isBetter]
  );

  const pieData = useMemo(
    () => [
      { name: "Skor Anda", value: userScore, color: theme.primary },
      {
        name: "Sisa Skor",
        value: Math.max(0, MAX_SCORE - userScore),
        color: "#e5e7eb",
      },
    ],
    [userScore, theme]
  );

  return (
    <section aria-labelledby="quiz-performance-title">
      <figure
        className="mx-auto mt-3"
        style={{ width: SIZE, height: OUTER_RADIUS + 40 }}
        role="img"
        aria-label={`Grafik skor kuis. Skor Anda ${userScore}, rata-rata ${averageScore}`}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              startAngle={START_ANGLE}
              endAngle={END_ANGLE}
              cx={CX}
              cy={CY}
              innerRadius={INNER_RADIUS}
              outerRadius={OUTER_RADIUS}
              stroke="none"
            >
              {pieData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>

            <Needle value={averageScore} color="#6b7280" dashed />

            <Needle value={userScore} color={theme.primary} />

            <circle cx={CX} cy={CY} r={10} fill={theme.primary} />
          </PieChart>
        </ResponsiveContainer>
      </figure>

      <div className="text-center mt-2">
        <p className={`text-5xl font-extrabold ${theme.text}`}>{userScore}</p>
        <p className="text-primary-600 flex items-center justify-center gap-1">
          <FiTarget />
          Skor Anda
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 p-3 text-sm font-medium">
        {isBetter ? (
          <>
            <FiTrendingUp className="text-green-600" />
            <span className="text-green-700">
              {difference} poin di atas rata-rata
            </span>
          </>
        ) : (
          <>
            <FiTrendingDown className="text-red-600" />
            <span className="text-red-700">
              {difference} poin di bawah rata-rata
            </span>
          </>
        )}
      </div>
    </section>
  );
};

export default QuizPerformanceComparison;
