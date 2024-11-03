import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import envVars from "../config/envVars.config.js";

import { Token } from "../models/Token.js";
import { TokenType } from "../enums/token.enums.js";
import { APIError } from "../utils/APIError.js";

const verifyToken = (token, secret, options = {}) => {
  try {
    const payload = jwt.verify(token, secret, options);
    return payload;
  } catch (error) {
    throw error;
  }
};

const generateAccessToken = (user) => {
  try {
    const unit = "m";
    const secret = envVars.jwt.accessSecret;
    const expiresIn = `${envVars.jwt.accessExpiresMinutes}${unit}`;

    const payload = {
      sub: user._id,
      tokenType: TokenType.ACCESS,
      role: user.role,
    };

    const options = { expiresIn: expiresIn };

    const accessToken = jwt.sign(payload, secret, options);
    return accessToken;
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = (user) => {
  try {
    const unit = "d";
    const secret = envVars.jwt.refreshSecret;
    const expiresIn = `${envVars.jwt.refreshExpiredDays}${unit}`;

    const payload = {
      sub: user._id,
      tokenType: TokenType.REFRESH,
      role: user.role,
    };

    const options = { expiresIn: expiresIn };

    const refreshToken = jwt.sign(payload, secret, options);
    return refreshToken;
  } catch (error) {
    throw error;
  }
};

const generateAuthTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenData = {
      token: refreshToken,
      type: TokenType.REFRESH,
      userId: user._id,
    };
    const createdToken = await saveToken(tokenData);
    const tokensData = {
      accessToken,
      refreshToken,
    };
    return tokensData;
  } catch (error) {
    throw error;
  }
};

const saveToken = async (tokenData) => {
  try {
    const { token, type, userId } = tokenData;
    const newToken = new Token({
      token,
      type,
      user: userId,
    });
    const createdToken = await newToken.save();
    return createdToken;
  } catch (error) {
    throw error;
  }
};

const deleteTokensByUser = async (userId) => {
  try {
    await Token.deleteMany({ user: userId });
  } catch (error) {
    throw error;
  }
};

const deleteAllTokens = async () => {
  try {
    await Token.deleteMany();
  } catch (error) {
    throw error;
  }
};

export default {
  generateAuthTokens,
  verifyToken,
  deleteTokensByUser,
  deleteAllTokens,
};
