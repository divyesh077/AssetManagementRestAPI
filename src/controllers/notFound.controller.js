import httpStatus from "http-status";
import { createApiError } from "../utils/createApiError.js";

const notFound = (req, res, next) => {
  const error = createApiError(
    httpStatus.NOT_FOUND,
    "No Routes found for given URL!!!"
  );
  return next(error);
};

export { notFound };
