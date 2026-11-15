# Prompt log — React Lab 2

Part of what you submit. It shows *how* you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number: Dev Reshamiya — MT2026021.
- AI tool and plan: Codex desktop

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged; applied in this existing chat, not pasted into a new chat.
```

**What came back:** Four files: `useCourses.js`, `CoursesView.jsx`, `AddCourseForm.jsx`, and `CoursesPage.jsx`. The draft used `useState` and `useEffect`, with no Part B hooks or libraries. It used separate loading/error values, omitted effect cleanup, reloaded the list after add, and used array indexes for list keys.

**Did it run?** Yes. The browser showed 20 courses in order; a valid `CS350` add appeared in order and cleared the form; duplicate `CS501` showed the server message and kept the input; invalid `cs350` / 9 credits showed validation errors under both fields. Network counts were not captured directly; the code reloads with one GET after each POST, and StrictMode reruns the initial effect in development. `npm test`: 49 passed / 13 failed. Failing files: `test/courses/CoursesView.test.jsx`, `test/courses/fieldErrors.test.jsx`, and `test/courses/useCourses.test.jsx`.

**What I did with it:** Audited the draft in `AUDIT.md` §§0–4 before making fixes.

---

## Prompt 2 —

**Why I sent it:** Carry out the decisions in `AUDIT.md` §4 and match `CONTRACT.md` §4.

**Sent:**

```text
I audited the first draft. Change it to match CONTRACT.md §4 exactly:
1. Replace the loading and loadError states with one status value (loading, ready, or error) and an error message.
2. Add an ignore-flag cleanup to the initial GET effect.
3. After POST succeeds, insert the returned course into a new array sorted by code; do not reload the list.
4. Use course.id for list keys.
5. Keep form state in AddCourseForm, show server field errors under their inputs, and add aria-invalid, aria-describedby, and role="alert" as the contract specifies.
6. Keep the four files and exports/props/return shapes specified in CONTRACT.md §4. Use only useState, useEffect, and apiFetch; no extra hooks, libraries, TypeScript, or CSS.
Return the changed files in full.
```

**What came back:** The four files now match §4: one status/error shape, cleanup for the initial load, immutable sorted insertion from the POST body, stable course IDs as keys, accessible field errors, and the exact component props/exports.

**What I kept, and what I rejected:** Kept the four-file split and the controlled form. Rejected separate loading/error state, the list reload after add, and index keys. The full test suite passed 62/62; browser checks covered the list, valid add, duplicate code, and validation errors.

---

<!-- Copy the "Prompt 2" block for each further prompt. -->

## Afterwards

- How many prompts did the whole feature take? Two: the unchanged contract prompt and one audit-directed fix prompt.
- Which of your prompts would you write differently now, and how? Prompt 1 was intentionally used unchanged so the first draft could be audited. The fix prompt named the exact §4 gaps from my audit.
- One thing the rules in prompt 1 prevented (or failed to prevent): It prevented the listed extra hooks, libraries, and TypeScript; it did not define the exact return shape and props later given in §4, which the first draft missed.
