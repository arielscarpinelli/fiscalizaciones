function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not found`);
  next(error);
}

module.exports = notFound;
