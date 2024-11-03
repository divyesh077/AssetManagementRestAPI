import asyncHandler from "express-async-handler";
import httpStatus from "http-status";

import assetService from "../services/asset.service.js";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";

/** ASSET TYPE SECTION START */

const getAllAssetTypes = asyncHandler(async (req, res, next) => {
  const assetTypes = await assetService.getAllAssetTypes();

  const data = {
    count: assetTypes.length || 0,
    assetTypes,
  };
  const response = createApiResponse(
    data,
    `Fetched all assetTypes successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetTypeById = asyncHandler(async (req, res, next) => {
  const { assetTypeId } = req.params;
  const assetType = await assetService.getAssetTypeById(assetTypeId);
  const data = { assetType };
  const response = createApiResponse(
    data,
    `Fetched assetType for assetTypeId ${assetTypeId}successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const addNewAssetType = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { body: assetTypeData } = req;
  const createdAssetType = await assetService.addNewAssetType(
    assetTypeData,
    userId
  );

  const data = { createdAssetType };
  const response = createApiResponse(
    data,
    `createda new AssetType successfully !!!`,
    httpStatus.CREATED
  );
  res.status(httpStatus.OK).json(response);
});

const updateAssetTypeById = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { assetTypeId } = req.params;
  const { body: AssetTypeData } = req;

  const updatedAssetType = await assetService.updateAssetTypeById(
    assetTypeId,
    AssetTypeData,
    userId
  );
  const data = { updatedAssetType };
  const response = createApiError(
    data,
    `updated AssetType successfully with  assetTypeId: ${assetTypeId} !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAssetTypeById = asyncHandler(async (req, res, next) => {
  const { assetTypeId } = req.params;
  const deletedAssetType = await assetService.deleteAssetTypeById(assetTypeId);
  const data = { deletedAssetType };
  const response = createApiResponse(
    data,
    `deleted  AssetType successfully  with Id : ${assetTypeId}!!!`
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAllAssetTypes = asyncHandler(async (req, res, next) => {
  await assetService.deleteAllAssetTypes();

  const data = {};
  const response = createApiResponse(
    data,
    `deleted All AssetTypes successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetTypesByCategoryId = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const assetTypes = await assetService.getAssetTypesByCategoryId(categoryId);
  if (!assetTypes) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      "AssetTypes not found for assetCategoryId!!!"
    );
    return next(apiError);
  }
  const data = { assetTypes };
  const response = createApiResponse(
    data,
    `Fetched All AssetTypes By AssetCategoryId successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetTypesByCategory = asyncHandler(async (req, res, next) => {
  const assetTypesByCategory = await assetService.getAssetTypesByCategory();
  const data = { assetTypesByCategory };
  const response = createApiResponse(
    data,
    `Fetched All AssetTypesByCategory successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

/** ASSET TYPE SECTION END */

export {
  getAllAssetTypes,
  getAssetTypeById,
  addNewAssetType,
  updateAssetTypeById,
  deleteAssetTypeById,
  deleteAllAssetTypes,
  getAssetTypesByCategoryId,
  getAssetTypesByCategory,
};
