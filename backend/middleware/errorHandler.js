export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err?.code === "LIMIT_FILE_SIZE") {
    err.status = 413;
    err.message = "Image file is too large";
  }

  if (res.headersSent) {
    return next(err);
  } else {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Internal Server Error" });
  }
}
