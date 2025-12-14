import React, { useMemo, useState, useEffect } from "react";

const MAX_MODULES_PER_DAY = 5;
const CELL_SIZE = 28;
const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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

const getDateDisplay = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getIntensityColor = (count) => {
  const v = Math.min(count, MAX_MODULES_PER_DAY);
  if (v === 0) return "bg-primary-100 border-primary-300 text-primary-500";
  if (v <= 1) return "bg-red-200 border-red-300 text-primary-700";
  if (v <= 3) return "bg-red-400 border-red-500 text-white";
  return "bg-red-600 border-red-700 text-white";
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const ConsistencyTrendChart = ({ data = [] }) => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const date = new Date(d.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [data, month, year]);

  useEffect(() => {
    if (selectedDay && !filteredData.some((d) => d.date === selectedDay.date)) {
      setSelectedDay(null);
    }
  }, [filteredData, selectedDay]);

  const daysInMonth = getDaysInMonth(year, month);
  const startDayIndex = new Date(year, month, 1).getDay();
  const totalCells = Math.ceil((startDayIndex + daysInMonth) / 7) * 7;

  const calendarCells = Array(totalCells).fill(null);

  filteredData.forEach((day) => {
    const date = new Date(day.date);
    const index = startDayIndex + date.getDate() - 1;
    calendarCells[index] = day;
  });

  const totalModules = filteredData.reduce(
    (sum, d) => sum + d.modules_completed,
    0
  );

  const activeDays = filteredData.filter((d) => d.active).length;

  return (
    <section className="space-y-2" aria-labelledby="consistency-title">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="month-select">
          Pilih bulan
        </label>
        <select
          id="month-select"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="grainy-border px-2 py-1 text-xs md:text-sm"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="year-select">
          Pilih tahun
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="grainy-border px-2 py-1 text-xs md:text-sm"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = today.getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {!filteredData.length && (
        <div className="h-40 flex items-center justify-center rounded-lg border border-dashed text-sm text-primary-500">
          Tidak ada data untuk bulan ini.
        </div>
      )}

      {!!filteredData.length && (
        <div className="flex gap-3">
          <div className="flex flex-col text-xs text-primary-500">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                style={{ height: CELL_SIZE }}
                className="flex items-center"
              >
                {d}
              </div>
            ))}
          </div>

          <div
            role="grid"
            aria-label={`Kalender aktivitas bulan ${MONTHS[month]} ${year}`}
            className="w-full grid gap-1 bg-primary-100 p-2 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${totalCells / 7}, 1fr)`,
              gridTemplateRows: `repeat(7, 1fr)`,
            }}
          >
            {calendarCells.map((day, idx) =>
              day ? (
                <button
                  key={day.date}
                  role="gridcell"
                  aria-label={`${getDateDisplay(day.date)}, ${
                    day.modules_completed
                  } modul`}
                  onClick={() =>
                    setSelectedDay(selectedDay?.date === day.date ? null : day)
                  }
                  className={`
                    rounded-md border-2 text-[11px] font-semibold
                    flex items-center justify-center
                    focus:outline-none focus:ring-2 focus:ring-red-500
                    ${getIntensityColor(day.modules_completed)}
                  `}
                >
                  {new Date(day.date).getDate()}
                </button>
              ) : (
                <div
                  key={`empty-${idx}`}
                  aria-hidden="true"
                  className="rounded-md bg-primary-100 border border-dashed"
                />
              )
            )}
          </div>
        </div>
      )}

      <div className="min-h-16 border-t pt-3 text-sm" aria-live="polite">
        {selectedDay ? (
          <div className="flex items-center gap-2">
            <strong>{getDateDisplay(selectedDay.date)}</strong>
            <span className="text-primary-600">
              {selectedDay.modules_completed} modul selesai
            </span>
            <span
              className={`px-2 py-0.5 text-xs rounded ${
                selectedDay.active
                  ? "bg-red-100 text-red-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {selectedDay.active ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
        ) : (
          <p className="text-primary-500 italic">
            Pilih tanggal untuk melihat detail aktivitas.
          </p>
        )}
      </div>

      {!!filteredData.length && (
        <div className="flex justify-between items-center text-xs text-primary-600 bg-primary-100 px-4 py-2 rounded-lg">
          <div>
            <p className="font-semibold text-primary-800">
              {totalModules} Modul
            </p>
            <p>{filteredData.length} hari tercatat</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-red-700">
              {activeDays} Hari Aktif
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConsistencyTrendChart;
