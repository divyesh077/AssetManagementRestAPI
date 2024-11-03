import httpStatus from "http-status";
import asyncHandler from "express-async-handler";

import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import userService from "../services/user.service.js";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userService.getUsers();
  const data = { count: users.length || 0, users };
  const response = createApiResponse(data, "Fetched the All users!!!");
  res.status(httpStatus.OK).json(response);
});

const getUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  if (!user) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      `User not found with userId ${userId}`
    );
    return next(apiError);
  }
  const data = { user };
  const response = createApiResponse(
    data,
    `Fetch user details for user with id : ${userId}`
  );
  res.status(httpStatus.OK).json(response);
});

const getUserByUserNumber = asyncHandler(async (req, res, next) => {
  const { usernumber } = req.body;
  const user = await userService.getUserByUserNumber(usernumber);
  if (!user) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      `user not found with usernumber : ${usernumber}`
    );
    return next(apiError);
  }
  const data = { user };
  const response = new APIResponse(
    true,
    `userdata fetch successfully for userNumber : ${userNumber}`,
    httpStatus.OK,
    data
  );
  res.status(httpStatus.OK).json(response);
});

const updateUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { body: userData } = req;

  const updatedUser = await userService.updateUserById(userId, userData);

  const data = { updatedUser };
  const response = createApiResponse(data, "user updated successfully!!!");
  res.status(httpStatus.OK).json(response);
});

const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  const updatedUser = await userService.updateUserPassword(userId, newPassword);

  const data = { updatedUser };
  const response = createApiResponse(data, "user updated successfully!!!");
  res.status(httpStatus.OK).json(response);
});

const updateUserRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role: newRole } = req.body;

  const updatedUser = await userService.updateUserRole(userId, newRole);

  const data = { updatedUser };
  const response = createApiResponse(data, "user updated successfully!!!");
  res.status(httpStatus.OK).json(response);
});

const updateUserAvtar = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { avtar: newAvtar } = req.body;

  const updatedUser = await userService.updateUserAvtar(userId, newAvtar);

  const data = { updatedUser };
  const response = createApiResponse(data, "user updated successfully!!!");
  res.status(httpStatus.OK).json(response);
});

const deleteUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await userService.deleteUserById(userId);
  const data = { deletedUser };
  const response = createApiResponse(
    data,
    `user deleted successfully with userId : ${userId} `
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAllUser = asyncHandler(async (req, res, next) => {
  await userService.deletAllUsers();
  const data = {};
  const response = createApiResponse(data, "All users deleted successfully!!!");
  res.status(httpStatus.OK).json(response);
});

/** Fetch Assets By User Id */
const getAssetsByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { query } = req;
  const assets = await userService.getAssetByUserId(userId, query);
  const data = { assets };
  const response = createApiResponse(
    data,
    "Fetch Assets for user successfully!!!,"
  );
  res.status(httpStatus.OK).json(response);
});
export {
  getUsers,
  getUserById,
  getUserByUserNumber,
  getAssetsByUserId,
  updateUserById,
  updateUserPassword,
  updateUserRole,
  updateUserAvtar,
  deleteUserById,
  deleteAllUser,
};
