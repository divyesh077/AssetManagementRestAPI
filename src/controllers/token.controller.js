import asyncHandler from "express-async-handler";
import httpStatus from "http-status";

import tokenService from "../services/token.service.js";

import { createApiResponse } from "../utils/createApiResponse.js";

const deleteTokensByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  await tokenService.deleteTokensByUser(userId);
  const response = createApiResponse(
    {},
    `All tokens deleted successfully for userId : ${userId} `
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAllTokens = asyncHandler(async (req, res, next) => {
  await tokenService.deleteAllTokens();
  const response = createApiResponse(
    {},
    `All tokens deleted successfully !!!`,
    httpStatus.OK
  );
  res.status(httpStatus.OK).json(response);
});

export { deleteTokensByUser, deleteAllTokens };
