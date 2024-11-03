import httpStatus from "http-status";
import asyncHandler from "express-async-handler";

import envVars from "../config/envVars.config.js";

import authService from "../services/auth.service.js";
import tokenService from "../services/token.service.js";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";
import userService from "../services/user.service.js";

const register = asyncHandler(async (req, res, next) => {
  const { body: userdata } = req;
  console.log("user :", userdata);
  const createdUser = await userService.createNewUser(userdata);
  const tokensData = await tokenService.generateAuthTokens(createdUser);

  const data = {
    createdUser,
    tokensData: tokensData,
  };
  const response = createApiResponse(
    data,
    "user created successfully!!!",
    httpStatus.CREATED
  );
  res.status(httpStatus.CREATED).json(response);
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokensData = await tokenService.generateAuthTokens(user);

  const data = {
    user: user,
    tokensData: tokensData,
  };
  const response = createApiResponse(data, "user login successfully!!!");
  res
    .status(httpStatus.OK)
    .cookie("accessToken", tokensData.accessToken, envVars.cookie.options)
    .cookie("refreshToken", tokensData.refreshToken, envVars.cookie.options)
    .json(response);
});

const logout = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

  if (!refreshToken) {
    const apiError = createApiError(
      httpStatus.BAD_REQUEST,
      "refresh token not found!!!"
    );
    return next(apiError);
  }

  await authService.logout(refreshToken, userId);

  const data = {};
  const response = createApiResponse(data, "user logout successfully!!!");
  res
    .status(httpStatus.OK)
    .clearCookie("accessToken", envVars.cookie.options)
    .clearCookie("refreshToken", envVars.cookie.options)
    .json(response);
});

const refreshAuthTokens = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!refreshToken) {
    const apiError = createApiError(
      httpStatus.BAD_REQUEST,
      "refresh token not found!!!"
    );
    return next(apiError);
  }
  const tokensData = await authService.refreshAuthTokens(refreshToken, user);
  const data = {
    tokensData: tokensData,
  };
  const response = createApiResponse(
    data,
    "refresh the auth tokens successfully!!!"
  );
  res
    .status(httpStatus.OK)
    .cookie("accessToken", tokensData.accessToken, envVars.cookie.options)
    .cookie("refreshToken", tokensData.refreshToken, envVars.cookie.options)
    .json(response);
});
export { register, login, logout, refreshAuthTokens };
