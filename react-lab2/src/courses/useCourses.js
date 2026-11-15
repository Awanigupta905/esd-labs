import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

// Lab day (AI required). This file ends up as the hook described in CONTRACT.md §4.
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    apiFetch("/api/courses")
      .then((loadedCourses) => {
        if (ignore) return;
        setCourses(loadedCourses);
        setStatus("ready");
      })
      .catch((caughtError) => {
        if (ignore) return;
        setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const createdCourse = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });

    setCourses((currentCourses) =>
      [...currentCourses, createdCourse].sort((a, b) => a.code.localeCompare(b.code))
    );
    return createdCourse;
  }

  return { courses, status, error, addCourse };
}
