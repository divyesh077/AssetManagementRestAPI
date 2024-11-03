import asyncHandler from "express-async-handler";
import httpStatus from "http-status";

import assetService from "../services/asset.service.js";
import { Asset } from "../models/Asset.js";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";

/** ASSET CATEGORY SECTION START */

const getAllAssetCategory = asyncHandler(async (req, res, next) => {
  const assetCategory = await assetService.getAllAssetCategory();

  const data = {
    count: assetCategory.length || 0,
    assetCategory,
  };
  const response = createApiResponse(
    data,
    `Fetched all assetCategory successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetCategoryById = asyncHandler(async (req, res, next) => {
  const { assetCategoryId } = req.params;
  const assetCategory = await assetService.getAssetCategoryById(
    assetCategoryId
  );
  if (!assetCategory) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      `AssetCategory not found for assetCategoryId : ${assetCategoryId}`
    );
    return next(apiError);
  }
  const data = { assetCategory };
  const response = createApiResponse(
    data,
    `Fetched assetCategory for assetCategoryId ${assetCategoryId}successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const addNewAssetCategory = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { body: assetCategoryData } = req;

  const createdAssetCategory = await assetService.addNewAssetCategory(
    assetCategoryData,
    userId
  );

  const data = { createdAssetCategory };
  const response = createApiResponse(
    data,
    `createda new AssetCategory successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const updateAssetCategoryById = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { assetCategoryId } = req.params;
  const { body: assetCategoryData } = req;

  const updatedAssetCategory = await assetService.updateAssetCategoryById(
    assetCategoryId,
    assetCategoryData,
    userId
  );
  const data = { updatedAssetCategory };
  const response = createApiResponse(
    data,
    `updated AssetCategory successfully with  assetCategoryId: ${assetCategoryId} !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAssetCategoryById = asyncHandler(async (req, res, next) => {
  const { assetCategoryId } = req.params;
  const deletedAssetCategory = await assetService.deleteAssetCategoryById(
    assetCategoryId
  );
  const data = { deletedAssetCategory };
  const response = createApiResponse(
    data,
    `deleted  AssetCategory successfully  with assetCategoryId : ${assetCategoryId}!!!`
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAllAssetCategory = asyncHandler(async (req, res, next) => {
  await assetService.deleteAllAssetCategory();
  const data = {};
  const response = createApiResponse(
    data,
    `deleted All AssetCategory successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

/** ASSET CATEGORY SECTION END */

export {
  getAllAssetCategory,
  getAssetCategoryById,
  addNewAssetCategory,
  updateAssetCategoryById,
  deleteAssetCategoryById,
  deleteAllAssetCategory,
};
