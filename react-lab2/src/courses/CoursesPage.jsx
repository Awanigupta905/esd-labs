import { AddCourseForm } from "./AddCourseForm.jsx";
import { CoursesView } from "./CoursesView.jsx";
import { useCourses } from "./useCourses.js";

// Lab day (AI required): the Courses page — list + add. src/App.jsx renders it.
// You generate it with AI from CONTRACT.md, then audit and fix it (doc sections 10–14).
export function CoursesPage() {
  const { courses, status, error, addCourse } = useCourses();

  return (
    <section className="courses-page">
      <h1>Courses</h1>
      <CoursesView courses={courses} status={status} error={error} />
      <AddCourseForm onAdd={addCourse} />
    </section>
  );
}
