import httpStatus from "http-status";

import { Token } from "../models/Token.js";

import { APIError } from "../utils/APIError.js";
import { TokenType } from "../enums/token.enums.js";
import envVars from "../config/envVars.config.js";

import userService from "./user.service.js";
import tokenService from "./token.service.js";

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new APIError(
        httpStatus.UNAUTHORIZED,
        "Not Authorized : user not found with email!!!"
      );
    }
    const isPasswordValid = await user.isPasswordMatch(password);
    if (!isPasswordValid) {
      throw new APIError(
        httpStatus.UNAUTHORIZED,
        "Not Authorized : password not matched!!!"
      );
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const logout = async (refreshToken, userId) => {
  try {
    const payload = tokenService.verifyToken(
      refreshToken,
      envVars.jwt.refreshSecret
    );

    if (!payload || payload.sub !== userId.toString()) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Invalid token !!!");
    }

    const deletedToken = await Token.deleteOne({
      token: refreshToken,
      type: TokenType.REFRESH,
      user: userId,
    });
    if (!deletedToken || deletedToken.deletedCount === 0) {
      throw new APIError(httpStatus.BAD_REQUEST, "user already logout!!!");
    }
    return deletedToken;
  } catch (error) {
    throw error;
  }
};

const refreshAuthTokens = async (refreshToken, user) => {
  try {
    const payload = tokenService.verifyToken(
      refreshToken,
      envVars.jwt.refreshSecret
    );
    if (!payload || payload.sub !== user._id.toString()) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Invalid token !!!");
    }
    const token = await Token.findOne({
      token: refreshToken,
      type: TokenType.REFRESH,
      user: user._id,
    });
    console.log(token);
    if (!token) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Not Authorized!!!");
    }
    await Token.findByIdAndDelete(token._id);
    const tokensData = tokenService.generateAuthTokens(user);
    return tokensData;
  } catch (error) {
    throw error;
  }
};
export default {
  loginWithEmailAndPassword,
  logout,
  refreshAuthTokens,
};
