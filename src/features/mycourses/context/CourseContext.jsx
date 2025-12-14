import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import CourseService from "../services/courseService";
import { useAuth } from "@features/auth/hooks/useAuth";

const initialPagination = {
  page: 1,
  limit: 6,
  total_pages: 1,
  total: 0,
};

const initialParams = {
  category: "",
};

const initialCourseState = {
  courses: [],
  pagination: initialPagination,
  params: initialParams,
  loading: true,
  error: null,
};

const CourseContext = createContext(undefined);

const applyFilterAndPagination = (rawCourses, params) => {
  const { page = 1, limit = 6, category, status } = params;
  let filteredCourses = [...rawCourses];

  if (category) {
    filteredCourses = filteredCourses.filter((course) =>
      course.title.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (status === "completed") {
    filteredCourses = filteredCourses.filter((course) =>
      course.progress === "100%" &&
      course.modules?.startsWith("100%") === false &&
      course.modules?.includes("/")
        ? course.modules.split("/")[0] ===
          course.modules.split("/")[1].split(" ")[0]
        : course.progress === "100%"
    );
  }

  if (status === "in_progress") {
    filteredCourses = filteredCourses.filter(
      (course) => course.progress !== "100%"
    );
  }

  const total = filteredCourses.length;
  const total_pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    courses: filteredCourses.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      total_pages,
    },
  };
};

export const CourseProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [state, setState] = useState(initialCourseState);

  const [rawCourses, setRawCourses] = useState([]);

  const fetchRawData = useCallback(async () => {
    if (!isLoggedIn) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const apiResponse = await CourseService.getMyCourses();
      setRawCourses(apiResponse);

      const { courses: initialCourses, pagination: initialPageData } =
        applyFilterAndPagination(apiResponse, {
          ...initialParams,
          ...initialPagination,
        });

      setState((prev) => ({
        ...prev,
        courses: initialCourses,
        pagination: initialPageData,
        params: { ...initialParams, ...initialPagination },
      }));
    } catch (err) {
      console.error("Failed to fetch all courses:", err);
      setState((prev) => ({
        ...prev,
        error: err.message || "Gagal memuat daftar kursus.",
        courses: [],
        pagination: initialPagination,
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (rawCourses.length > 0) {
      const { courses: filteredCourses, pagination: pageData } =
        applyFilterAndPagination(rawCourses, state.params);

      setState((prev) => ({
        ...prev,
        courses: filteredCourses,
        pagination: pageData,
        loading: false,
      }));
    }
  }, [rawCourses, state.params]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRawData();
    } else {
      setState(initialCourseState);
    }
  }, [isLoggedIn, user?.id, fetchRawData]);

  const setPage = useCallback((newPage) => {
    setState((prev) => ({ ...prev, loading: true }));
    setState((prev) => ({
      ...prev,
      params: { ...prev.params, page: newPage },
    }));
  }, []);

  const setFilter = useCallback((key, value) => {
    setState((prev) => ({ ...prev, loading: true }));
    setState((prev) => ({
      ...prev,
      params: { ...prev.params, [key]: value, page: 1 },
    }));
  }, []);

  const value = {
    courses: state.courses,
    pagination: state.pagination,
    loading: state.loading,
    error: state.error,
    params: state.params,
    setPage,
    setFilter,
    refetch: fetchRawData,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
