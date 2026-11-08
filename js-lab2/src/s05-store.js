// Section 05 — State as a state machine
//
// The whole app's state is ONE object. It only ever changes through
// transition(state, event), which returns a NEW state (or the SAME state
// when the event changes nothing). Never change `state` itself.

export const initialState = Object.freeze({
  status: "idle",       // "idle" | "loading" | "ready" | "error"
  courses: [],          // the courses from the last successful load
  error: null,          // the error message when status is "error"
  departments: [],      // every department name, sorted — filled by the first successful load
  department: "",       // the selected department filter ("" = all)
  query: "",            // the search box text
  planner: [],          // planned courses: { id, code, title, credits }
  grades: {},           // the SGPA calculator form: { [courseId]: "A" | "A-" | … }
});

export function transition(state, event) {
  switch (event.type) {
    case "LOAD_START":
      // status becomes "loading" and error becomes null; everything else stays
      return { ...state, status: "loading", error: null };
    case "LOAD_OK":
      // status "ready", courses from event.courses; on the FIRST success also
      // fill departments (unique, sorted) from those courses
      return {
        ...state,
        status: "ready",
        courses: event.courses,
        departments: state.departments.length
          ? state.departments
          : [...new Set(event.courses.map(({ department }) => department))].sort(),
        error: null,
      };
    case "LOAD_FAIL":
      // status "error", error from event.message (keep the old courses)
      return { ...state, status: "error", error: event.message };
    case "SET_DEPARTMENT":
      // department from event.department — the SAME state if it didn't change
      return state.department === event.department
        ? state
        : { ...state, department: event.department };
    case "SET_QUERY":
      // query from event.query — the SAME state if it didn't change
      return state.query === event.query ? state : { ...state, query: event.query };
    case "ADD":
      // add { id, code, title, credits } of event.course to the planner —
      // the SAME state if it's already there.
      // Stretch: also refuse a full course, or one that would go over 24 credits.
      if (
        state.planner.some(({ id }) => id === event.course.id)
        || event.course.seatsLeft === 0
        || state.planner.reduce((total, course) => total + course.credits, 0) + event.course.credits > 24
      ) {
        return state;
      }
      return {
        ...state,
        planner: [...state.planner, {
          id: event.course.id,
          code: event.course.code,
          title: event.course.title,
          credits: event.course.credits,
        }],
      };
    case "REMOVE":
      // remove the course with id event.id, AND its grade if it has one —
      // the SAME state if it isn't in the planner
      if (!state.planner.some(({ id }) => id === event.id)) return state;
      const grades = { ...state.grades };
      delete grades[event.id];
      return {
        ...state,
        planner: state.planner.filter(({ id }) => id !== event.id),
        grades,
      };
    case "SET_GRADE":
      // grades[event.id] = event.grade (a computed key!); an empty grade ""
      // removes that course's entry — the SAME state if nothing changes
      if ((state.grades[event.id] ?? "") === event.grade) return state;
      const updatedGrades = { ...state.grades };
      if (event.grade === "") delete updatedGrades[event.id];
      else updatedGrades[event.id] = event.grade;
      return { ...state, grades: updatedGrades };
    default:
      return state; // an event we don't know changes nothing
  }
}
