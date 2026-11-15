# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

**Current status:** Sections 04–09 are complete. The first `CONTRACT.md` prompt's four-file
draft was audited before the fix; the corrected implementation now passes all core tests.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/useCourses.js` | `useCourses`; list-loading and add logic | 4–36 |
| `src/courses/CoursesView.jsx` | `CoursesView`; loading/error/empty/list JSX | 1–25 |
| `src/courses/AddCourseForm.jsx` | `AddCourseForm`; controlled form and submit | 1–85 |
| `src/courses/CoursesPage.jsx` | `CoursesPage`; composes hook, view, and form | 1–15 |

- Does it run? Yes: list showed 20 sorted courses and CS201 was Full; valid CS350 add appeared in order and cleared the form; duplicate CS501 showed its message and kept the typed values; invalid `cs350` / 9 credits showed Validation failed and both field reasons.
- Requests in the Network tab — not directly captured. Source behavior: StrictMode repeats the initial effect in development (two GETs, with no cleanup); each add makes one POST and then one GET reload.
- `npm test` before any fix: 49 passed / 13 failed. Failing files: `test/courses/CoursesView.test.jsx` (1), `test/courses/fieldErrors.test.jsx` (2), `test/courses/useCourses.test.jsx` (10).

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | `CoursesView.jsx:1-25` | Yes; it renders from props only, but its props use `loading` rather than `status` |
| Fetch + logic in a separate hook or module | `useCourses.js:4-36` | Yes; initial fetch and add logic are in the hook |
| `useState` for the course list, at the right level | `useCourses.js:5` | Yes; shared list state belongs in the hook |
| `useState` for the form's inputs, at the right level | `AddCourseForm.jsx:22` | Yes; form values stay with the form |
| `useEffect` — for the initial fetch only (with a cleanup) | `useCourses.js:22-24` | Runs initial load only, but missing cleanup/ignore flag |
| Props down, callbacks up (the form raises "add this course") | `CoursesPage.jsx:11-12` | Yes; passes data down and `addCourse` down as `onAdd` |
| `.map` to render the list, with a stable `key` | `CoursesView.jsx:8-9` | Maps correctly; `key={index}` is unstable, use `course.id` |
| Loading / error / empty states, from one `status` | `useCourses.js:6-7`; `CoursesView.jsx:1-4` | States render, but separate loading/error values replace the required single status |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | Not found | — | Nothing to cut |
| `useCallback` | Not found | — | Nothing to cut |
| `useReducer` | Not found | — | Nothing to cut |
| `useRef` | Not found | — | Nothing to cut |
| Context (`createContext`, `useContext`) | Not found | — | Nothing to cut |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | Not found; uses `apiFetch` in `useCourses.js` | — | Allowed client usage |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | Not found | — | JavaScript only |
| Anything else nobody taught you (name it) | No additional library/hook found | — | — |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| `useCourses` call (`CoursesPage.jsx:6`) | Connects the page to the course list and add action | Keep |
| `useState` courses (`useCourses.js:5`) | Holds shared server data shown and changed by this slice | Keep |
| `useState` loading (`useCourses.js:6`) | Tracks the initial request | Replace with the single `status` state |
| `useState` loadError (`useCourses.js:7`) | Holds the load failure message | Fold into `status` + `error` |
| `useEffect` (`useCourses.js:22`) | Loads the list when the page appears | Keep; add ignore-flag cleanup |
| `useState` form (`AddCourseForm.jsx:22`) | Holds the form's six controlled values | Keep in the form |
| `useState` submitting (`AddCourseForm.jsx:23`) | Disables the submit button while awaiting `onAdd` | Keep in the form |
| `useState` formError (`AddCourseForm.jsx:24`) | Shows the last add error message | Replace with one error object state |
| `useState` fieldErrors (`AddCourseForm.jsx:25`) | Shows server validation reasons | Derive from the error object; add accessible associations |
| `CoursesView` (`CoursesView.jsx:1`) | Renders loading/error/empty/list states from props | Keep; accept `status` and `error` |
| `AddCourseForm` (`AddCourseForm.jsx:21`) | Owns form values, submits via callback, displays errors | Keep; add `aria-invalid`, `aria-describedby`, and alert role |
| `CoursesPage` (`CoursesPage.jsx:5`) | Composes hook, view, and form | Keep; pass `status` and `error` props |

## 4. Decisions — before any fix prompt

- I will **cut**: Separate `loading` / `loadError` states; the second GET after POST; `key={index}`.
- I will **move** (from → to): Nothing; fetch logic, form state, and component roles are already separated.
- I will **add** (missing from the AI's version): One `status` field and `error` message; ignore-flag cleanup; sorted immutable insertion of the returned 201 course without reloading; stable `course.id` keys; accessible field-error attributes and alert role; exact §4 props and return shape.
- Other smells I found (state stored that could be computed, a reload after add, browser
  validation, `key={index}`, swallowed errors…): It reloads the full list after add (`useCourses.js:31`); uses separate loading/error state (`useCourses.js:6-7`); and uses array-index keys (`CoursesView.jsx:9`). It uses `Number(...)`, has no browser-side min/max validation, and displays server messages.

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
| No Part B item was present in the first draft; Prompt 1 explicitly forbids these hooks/libraries/types | Final `npm test`: 62 passed | Final browser checks passed: list, add, duplicate, validation |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components | Four files: one hook, view, form, page | Same four files, now with §4 props and responsibilities |
| `useState` calls (and where) | 7: three in `useCourses`, four in `AddCourseForm` | 6: courses/status/error in `useCourses`; form/submitting/error in `AddCourseForm` |
| `useEffect` calls | 1; initial GET had no cleanup | 1; initial GET returns an ignore-flag cleanup |
| "Not yet" items | None | None |
| Requests: on load / per add | Source behavior: StrictMode repeats initial GET in dev; each POST was followed by another GET | StrictMode repeats initial GET in dev; add now makes only the POST |
| `npm test` | 49 passed / 13 failed | 62 passed / 62 |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: It separated the fetch hook, render-only view, form, and page composition in its first draft.
- One thing you will never accept from an AI without checking again: A list update that refetches after a successful add; check the network behavior and the contract.

---

## Section 09 practice — supplied `ai-sample/CoursesPage.jsx`

This records the supplied practice sample only; it is not the lab-day first draft. The original `src/courses/CoursesPage.jsx` placeholder has been restored.

| Practice step | `npm test -- courses/CoursesPage` | Browser after reload and add |
| --- | --- | --- |
| Copy sample in; before stripping | 4 passed | Loaded 20 seeded courses; added `ZZ901` |
| Remove `useMemo`; use a plain sorted array | 4 passed | Added `ZZ902` |
| Remove `useCallback` from `fetchCourses`; use a plain async function and `[]` effect dependencies | 4 passed | Added `ZZ903` |
| Remove `useCallback` from `handleSubmit`; use a plain async function | 4 passed | Added `ZZ904` |
| Remove `useRef`, `ref`, and focus call | 4 passed | Added `ZZ905` |
| Remove `useMemo`, `useCallback`, and `useRef` from the import; final stripped sample | 4 passed | Added `ZZ906` |
| Run `npm test -- test/courses` with the stripped sample | 1 test file passed / 4 failed; 4 tests passed / 31 failed | Other suites still hit the lab-day placeholder TODOs |

### Additional sample smells outside Part B

- Thirteen `useState` calls are packed into one component.
- Loading and error are separate state values instead of one status.
- `courseCount` is stored even though it can be computed from `courses.length`.
- Adding a course reloads the whole list, causing a needless second GET and loading flash.
- List items use `key={index}` instead of stable course IDs.
- Fetching, list rendering, and form handling all live in `CoursesPage` instead of separate hook, view, and form components.
- `parseInt` silently truncates invalid numeric input instead of sending `Number(...)` for server validation.

The supplied placeholder was restored after the exercise. Temporary practice courses `ZZ901`–`ZZ906` were removed from the local mock catalogue. The broader Courses test failures are expected while the lab-day files remain unfinished.
