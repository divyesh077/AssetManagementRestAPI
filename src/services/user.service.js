import httpStatus from "http-status";

import { User } from "../models/User.js";
import { APIError } from "../utils/APIError.js";
import logger from "../utils/logger.js";
import assetService from "./asset.service.js";
import mongoose, { Schema, Types, Mongoose } from "mongoose";
import { Asset } from "../models/Asset.js";

import { createApiError } from "../utils/createApiError.js";

const getUsers = async () => {
  try {
    const users = await User.find().select({ username: 1, email: 1, role: 1 });
    return users;
  } catch (error) {
    logger.error(`user.service : getUser : error : ${error.message}`);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select({
      username: 1,
      usernumber: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      role: 1,
      usernumber: 1,
    });
    return user;
  } catch (error) {
    logger.error(`user.service : getUserById : error : ${error.message}`);
    throw error;
  }
};

const getUserByUserNumber = async (usernumber) => {
  try {
    if (!usernumber) {
      throw new APIError(
        httpStatus.UNAUTHORIZED,
        "usernumber is not provided!!!"
      );
    }
    const user = await User.findOne({ usernumber: usernumber }).select({
      username: 1,
      email: 1,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    logger.error(`user.service : getUserByEmail : error : ${error.message}`);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username: username });
    return user;
  } catch (error) {
    logger.error(`user.service : getUserByUsername : error : ${error.message}`);
    throw error;
  }
};

const isUserAlreadyExist = async (username, email) => {
  try {
    const user =
      (await getUserByUsername(username)) || (await getUserByEmail(email));
    return user;
  } catch (error) {
    logger.error(
      `user.service : isUserAlreadyExist : error : ${error.message}`
    );
    throw error;
  }
};

const createNewUser = async (userData) => {
  try {
    const { username, usernumber, email, password, role } = userData;
    const isUserExist = await isUserAlreadyExist(username, email);
    if (isUserExist) {
      throw new APIError(
        httpStatus.ALREADY_REPORTED,
        "user already exist with given username or email"
      );
    }

    const newUser = new User({
      username,
      usernumber,
      email,
      password,
      role,
    });
    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    logger.error(`user.service : createNewUser : error : ${error.message}`);
    throw error;
  }
};

const updateUserById = async (userId, userData = {}) => {
  try {
    const { username, email } = userData;

    const user = await getUserById(userId);
    if (!user) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user not exist with given userId : ${userId}`
      );
    }

    const isUsernameExist =
      username && (await User.isUsernameTaken(username, userId));
    const isEmailExist = email && (await User.isEmailTaken(email, userId));

    if (isUsernameExist || isEmailExist) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user already exist with given username or email!!!`
      );
    }
    Object.assign(user, userData);
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    logger.error(`user.service : updateUserById : error : ${error.message}`);
    throw error;
  }
};

const updateUserPassword = async (userId, newPassword) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user not found with userId : ${userId}`
      );
    }
    Object.assign(user, { password: newPassword });
    console.log("user.service : updateUserPassword : ", user);
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    logger.error(
      `user.service : updateUserPassword : error : ${error.message}`
    );
    throw error;
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user not found with userId : ${userId}`
      );
    }
    Object.assign(user, { role: newRole });
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    logger.error(`user.service : updateUserAvtar : error : ${error.message}`);
    throw error;
  }
};

const updateUserAvtar = async (userId, newAvtar) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user not found with userId : ${userId}`
      );
    }
    Object.assign(user, { avtar: newAvtar });
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    logger.error(`user.service : updateUserAvtar : error : ${error.message}`);
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `user not found with userId ${userId}`
      );
    }
    return deletedUser;
  } catch (error) {
    logger.error(`user.service : deleteUserById : error : ${error.message}`);
    throw error;
  }
};

const deletAllUsers = async () => {
  try {
    await User.deleteMany();
  } catch (error) {
    logger.error(`user.service : deletAllUsers : error : ${error.message}`);
    throw error;
  }
};

/** Fetch Assets for Employee Id*/
const getAssetByUserId = async (userId, query) => {
  try {
    const userAssets = await Asset.find({
      assignedTo: userId,
    });
    return userAssets;
  } catch (error) {
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  getUserByUserNumber,
  getUserByUsername,
  getUserByEmail,
  getAssetByUserId,
  createNewUser,
  updateUserById,
  updateUserPassword,
  updateUserRole,
  updateUserAvtar,
  deleteUserById,
  deletAllUsers,
};
