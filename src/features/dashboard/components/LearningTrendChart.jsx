import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiCalendar } from "react-icons/fi";

const MAX_HOURS = 12;

const DAYS_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const DAY_SHORT = {
  Senin: "Sen",
  Selasa: "Sel",
  Rabu: "Rab",
  Kamis: "Kam",
  Jumat: "Jum",
  Sabtu: "Sab",
  Minggu: "Min",
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const getDayNameID = (date) =>
  new Date(date).toLocaleDateString("id-ID", { weekday: "long" });

const getDefaultWeeklyData = () => DAYS_ORDER.map((day) => ({ day, value: 0 }));

const getWeekOfMonth = (date) => {
  const d = new Date(date);
  return Math.ceil(d.getDate() / 7);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { day, value } = payload[0].payload;

  return (
    <div
      className="bg-primary-900 text-white text-xs px-2 py-1 rounded shadow"
      role="status"
    >
      {day}: {value.toFixed(1)} jam
    </div>
  );
};

const LearningTrendChart = ({ data = [] }) => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [week, setWeek] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = useMemo(() => {
    const filtered = data.filter((item) => {
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return false;

      const sameMonth = d.getMonth() === month && d.getFullYear() === year;
      const sameWeek = week === 0 || getWeekOfMonth(d) === week;

      return sameMonth && sameWeek;
    });

    const grouped = getDefaultWeeklyData();

    filtered.forEach((item) => {
      const dayName = getDayNameID(item.date);
      const target = grouped.find((d) => d.day === dayName);
      if (target) target.value += item.active_hour || 0;
    });

    return DAYS_ORDER.map((day) => {
      const found = grouped.find((d) => d.day === day) || { value: 0 };
      return {
        day,
        label: isMobile ? DAY_SHORT[day] : day,
        value: found.value,
      };
    });
  }, [data, month, year, week, isMobile]);

  const totalHours = chartData.reduce((sum, d) => sum + d.value, 0).toFixed(1);

  return (
    <section className="space-y-4" aria-labelledby="learning-trend-title">
      <div className="flex flex-wrap gap-2">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="grainy-border rounded px-2 py-1 text-xs md:text-sm"
          aria-label="Pilih bulan"
        >
          {MONTHS.map((m, i) => (
            <option className="text-xs md:text-sm" ey={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="grainy-border rounded px-2 py-1 text-xs md:text-sm"
          aria-label="Pilih tahun"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = today.getFullYear() - i;
            return (
              <option className="text-xs md:text-sm" key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="grainy-border rounded px-2 py-1 text-xs md:text-sm"
          aria-label="Pilih minggu"
        >
          <option value={0}>Semua Minggu</option>
          <option value={1}>Minggu ke-1</option>
          <option value={2}>Minggu ke-2</option>
          <option value={3}>Minggu ke-3</option>
          <option value={4}>Minggu ke-4</option>
          <option value={5}>Minggu ke-5</option>
        </select>
      </div>

      <figure
        className="w-full h-[280px]"
        role="img"
        aria-label={`Grafik durasi belajar bulan ${MONTHS[month]} ${year}, total ${totalHours} jam`}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <BarChart
            data={chartData}
            margin={{
              top: 16,
              right: isMobile ? 8 : 16,
              left: isMobile ? -12 : 0,
              bottom: isMobile ? 32 : 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="label"
              interval={0}
              angle={isMobile ? -30 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[0, MAX_HOURS]}
              tickFormatter={(v) => `${v}j`}
              width={isMobile ? 32 : 40}
              tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 18 : 32}
            />
          </BarChart>
        </ResponsiveContainer>

        <figcaption className="sr-only">
          Total durasi belajar adalah {totalHours} jam.
        </figcaption>
      </figure>

      <div
        className="flex items-center gap-2 text-sm text-primary-700"
        role="status"
        aria-live="polite"
      >
        <FiCalendar />
        Total belajar: <strong>{totalHours} jam</strong>
      </div>
    </section>
  );
};

export default LearningTrendChart;
