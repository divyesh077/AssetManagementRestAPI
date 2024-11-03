import httpStatus from "http-status";
import { APIResponse } from "./APIResponse.js";

const createApiResponse = (
  data,
  message = "",
  statusCode = httpStatus.OK,
  status = true
) => {
  const apiResponse = new APIResponse(data, message, statusCode, status);
  return apiResponse;
};

export { createApiResponse };
