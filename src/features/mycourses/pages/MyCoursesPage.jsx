import React, { useCallback, useMemo } from "react";
import { FiChevronDown, FiLoader } from "react-icons/fi";
import { CiCircleAlert } from "react-icons/ci";
import CourseCard from "../components/CourseCard";
import { useCourses } from "../hooks/useCourses";
import { CourseProvider } from "../context/CourseContext";

const parseDate = (dateString) => {
  if (!dateString || dateString === "-") {
    return new Date(0);
  }
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const MyCoursesContent = () => {
  const {
    courses = [],
    pagination = { page: 1, total_pages: 1, total: 0, limit: 6 },
    loading,
    error,
    params = {},
    setPage,
    setFilter,
    refetch,
  } = useCourses();

  const uniqueCourses = useMemo(() => {
    const courseMap = new Map();

    courses.forEach((course) => {
      if (!courseMap.has(course.id)) {
        courseMap.set(course.id, course);
      } else {
        const existingCourse = courseMap.get(course.id);

        const existingDate = parseDate(existingCourse.completed_at);
        const newDate = parseDate(course.completed_at);

        if (newDate.getTime() > existingDate.getTime()) {
          courseMap.set(course.id, course);
        }
      }
    });

    return Array.from(courseMap.values()).sort((a, b) => {
      const dateA = parseDate(a.completed_at);
      const dateB = parseDate(b.completed_at);
      return dateB.getTime() - dateA.getTime();
    });
  }, [courses]);

  const startIndex =
    pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endIndex = Math.min(
    startIndex + uniqueCourses.length - 1,
    startIndex + pagination.limit - 1,
    pagination.total
  );

  const finalEndIndex = uniqueCourses.length > 0 ? endIndex : 0;

  const handleNext = useCallback(
    () => setPage(pagination.page + 1),
    [pagination.page, setPage]
  );
  const handlePrev = useCallback(
    () => setPage(pagination.page - 1),
    [pagination.page, setPage]
  );

  const filterOptions = [
    { label: "Semua Kursus", value: "" },
    { label: "Selesai", value: "completed" },
    { label: "Belum Selesai", value: "in_progress" },
  ];

  const isCourseCompleted = (course) => {
    if (course.progress !== "100%") return false;

    if (course.modules) {
      const [done, total] = course.modules.split("/");
      if (done && total) {
        return done.trim() === total.split(" ")[0].trim();
      }
    }

    return true;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader
          className="animate-spin text-red-500 text-5xl"
          aria-label="Memuat"
        />
        <p className="ml-4 text-primary-600">Memuat daftar kursus...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-700 bg-red-100 rounded-xl shadow-md border-l-4 border-red-500 min-h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <CiCircleAlert className="mr-3 text-2xl" /> Gagal Memuat Kursus
        </h2>
        <p className="mt-2 text-center text-sm">{error}</p>
        <button
          onClick={refetch}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center transition duration-150"
          aria-label="Coba muat ulang kursus"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex justify-between mb-6 items-center">
        <div>
          <h2
            id="course-list-title"
            className="text-xl md:text-3xl font-bold text-primary-900"
          >
            My Courses
          </h2>
          <p
            id="course-count"
            className="text-sm text-primary-500 mt-1"
            role="status"
          >
            Ditemukan {pagination.total} kursus. Klik tombol Lanjutkan untuk
            membuka materi.
          </p>
        </div>

        <div className="relative">
          <label htmlFor="course-filter" className="sr-only">
            Filter Kursus berdasarkan Status
          </label>
          <select
            id="course-filter"
            value={params.status || ""}
            onChange={(e) => {
              setFilter("status", e.target.value);
            }}
            className="text-xs md:text-sm w-full appearance-none bg-white border border-primary-300 px-3 py-2 pr-8 rounded-lg font-medium text-primary-700 hover:bg-primary-100 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
            aria-describedby="course-count"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="w-4 h-4 ml-1 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary-500" />
        </div>
      </header>

      <main
        className="space-y-6"
        role="region"
        aria-labelledby="course-list-title"
      >
        {uniqueCourses.map((course) => {
          const completed = isCourseCompleted(course);

          return (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                completed_at: completed ? course.completed_at : "-",
              }}
            />
          );
        })}
      </main>

      {pagination.total > 0 && pagination.total_pages > 1 && (
        <div
          className="mt-8 flex justify-between items-center flex-wrap space-y-4 sm:space-y-0 gap-6"
          role="navigation"
          aria-label="Course Pagination"
        >
          <p className="text-sm text-primary-600 order-2 sm:order-1 w-full sm:w-auto text-center sm:text-left">
            Menampilkan {startIndex}-{finalEndIndex} dari {pagination.total}{" "}
            kursus. Halaman {pagination.page} dari {pagination.total_pages}.
          </p>
          <div className="flex space-x-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center border border-primary-300 px-4 py-2 rounded-lg text-xs md:text-sm text-primary-700 hover:bg-primary-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={pagination.page <= 1}
              aria-label="Previous Page"
            >
              &lt; Sebelumnya
            </button>

            <button
              onClick={handleNext}
              className="flex items-center justify-center border border-primary-300 bg-white px-4 py-2 rounded-lg text-xs md:text-sm text-primary-700 hover:bg-primary-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={pagination.page >= pagination.total_pages}
              aria-label="Next Page"
            >
              Selanjutnya &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MyCoursesPage = () => (
  <CourseProvider>
    <MyCoursesContent />
  </CourseProvider>
);

export default MyCoursesPage;
