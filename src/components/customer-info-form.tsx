"use client";
import { ChangeEvent, FormEvent, FocusEvent, useState } from "react";

interface IErrorData {
  [key: string]: string | boolean;
}

export default function CustomerInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    isOkToDoSomething: true,
  });
  const [errorData, setErrorData] = useState<IErrorData>({});
  const requiredFields = ["firstName", "emailAddress"];
  const [isDirty, setIsDirty] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Submit", event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (!isDirty) setIsDirty(!isDirty);
    validateField(event.target);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let value: (typeof formData)[keyof typeof formData] = event.target.value;
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }
    setFormData({ ...formData, [event.target.name]: value });
    validateField(event.target);
  }

  function validateField(target: HTMLInputElement) {
    // NOTE: you could make this async and to validate a zipcode, you could await the result of that network call
    const isRequired = requiredFields.some((x) => x === target.name);
    let error = "";

    if (isRequired && !target.value.trim()) {
      error = "Required field is empty.";
    } else if (target.name === "emailAddress") {
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      const isValid = pattern.test(target.value.trim());
      error = isValid ? "" : "Email address does not match regex.";
    }

    if (error) {
      setErrorData({
        ...errorData,
        [target.name]: error,
      });
    } else {
      const errorDataWithoutTargetName = { ...errorData };
      delete errorDataWithoutTargetName[target.name];
      setErrorData(errorDataWithoutTargetName);
    }
  }

  function validateForm() {
    return isDirty && Object.keys(errorData).length === 0;
  }

  const isOk = validateForm();

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">
          first name*
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </label>
        <span>{errorData?.firstName}</span>

        <label htmlFor="lastName">
          last name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="emailAddress">
          email address*
          <input
            type="text"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </label>
        <span>{errorData?.emailAddress}</span>

        <label htmlFor="isOkToDoSomething">
          is ok to to something?
          <input
            type="checkbox"
            name="isOkToDoSomething"
            checked={formData.isOkToDoSomething}
            onChange={handleChange}
          />
        </label>
      </form>
      <button type="submit" disabled={!isOk}>
        submit
      </button>
    </section>
  );
}
