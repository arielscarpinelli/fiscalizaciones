function validationErrors(err, req, res, next) {
  if (!err.isJoi) {
    return next(err);
  }

  res.status(422);

  const errors = err.details.reduce((errors, error) => {
    const field = error.path.join(".");
    return {
      ...errors,
      [field]: error.message,
    };
  }, {});

  res.json({
    message: "The given data was invalid",
    errors,
  });
}

module.exports = validationErrors;
