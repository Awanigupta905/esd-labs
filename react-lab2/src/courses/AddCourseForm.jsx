import { useState } from "react";

// Lab day (AI required). This file ends up as the form described in CONTRACT.md §4.
const EMPTY_FIELDS = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY_FIELDS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await onAdd({
        ...values,
        credits: Number(values.credits),
        capacity: Number(values.capacity),
        description: values.description || null,
      });
      setValues(EMPTY_FIELDS);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : String(caughtError));
      setFieldErrors(caughtError.fieldErrors ?? {});
    } finally {
      setSubmitting(false);
    }
  }

  function fieldAttributes(name) {
    return fieldErrors[name]
      ? {
          "aria-invalid": "true",
          "aria-describedby": `${name}-error`,
        }
      : {};
  }

  return (
    <form className="add-course" onSubmit={handleSubmit} noValidate>
      <h2>Add a course</h2>
      <div className="field">
        <label htmlFor="code">Code</label>
        <input id="code" name="code" value={values.code} onChange={updateField} {...fieldAttributes("code")} />
        {fieldErrors.code && (
          <p id="code-error" className="field-error">
            {fieldErrors.code}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={updateField} {...fieldAttributes("title")} />
        {fieldErrors.title && (
          <p id="title-error" className="field-error">
            {fieldErrors.title}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="department">Department</label>
        <input
          id="department"
          name="department"
          value={values.department}
          onChange={updateField}
          {...fieldAttributes("department")}
        />
        {fieldErrors.department && (
          <p id="department-error" className="field-error">
            {fieldErrors.department}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="credits">Credits</label>
        <input
          id="credits"
          name="credits"
          type="number"
          value={values.credits}
          onChange={updateField}
          {...fieldAttributes("credits")}
        />
        {fieldErrors.credits && (
          <p id="credits-error" className="field-error">
            {fieldErrors.credits}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="capacity">Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          value={values.capacity}
          onChange={updateField}
          {...fieldAttributes("capacity")}
        />
        {fieldErrors.capacity && (
          <p id="capacity-error" className="field-error">
            {fieldErrors.capacity}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={updateField}
          {...fieldAttributes("description")}
        />
        {fieldErrors.description && (
          <p id="description-error" className="field-error">
            {fieldErrors.description}
          </p>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        Add course
      </button>
    </form>
  );
}
