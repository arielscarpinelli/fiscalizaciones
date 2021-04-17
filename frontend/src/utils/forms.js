export const handleServersideValidationErrors = (errors, setError) => {
  if (!errors || Object.keys(errors).length === 0) {
    return false;
  }

  Object.entries(errors).forEach(([field, message]) => {
    setError(field, {
      type: "manual",
      message,
    });
  });
};
