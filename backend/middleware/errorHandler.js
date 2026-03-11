export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  } else {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal Server Error" });
  }
}
