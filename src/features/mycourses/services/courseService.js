import { apiClient } from "@shared/services/apiClient";

const COURSE_ENDPOINT = "/my-courses";

const getMyCourses = async () => {
  try {
    const response = await apiClient.get(COURSE_ENDPOINT);
    const courses = response.data?.data?.courses || [];

    return courses;
  } catch (error) {
    console.error("Error fetching My Courses:", error);
    throw error;
  }
};

const CourseService = {
  getMyCourses,
};

export default CourseService;
