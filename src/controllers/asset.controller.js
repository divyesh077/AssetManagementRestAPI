import asyncHandler from "express-async-handler";
import httpStatus from "http-status";

import assetService from "../services/asset.service.js";
import { Asset } from "../models/Asset.js";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";

const addAssets = asyncHandler(async (req, res, next) => {
  const result = await Asset.insertMany(req.body);
  const data = result;
  const response = createApiResponse(
    data,
    `Inserted all assets successfully !!!`,
    httpStatus.CREATED
  );
  res.status(httpStatus.CREATED).json(response);
});

/** ASSET SECTION START */
const getAllAssets = asyncHandler(async (req, res, next) => {
  const { query } = req;
  const result = await assetService.getAllAssets(query);
  const data = result;
  const response = createApiResponse(
    data,
    `Fetched all assets successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetById = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;
  const asset = await assetService.getAssetById(assetId);
  if (!asset) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      `asset not dound with assetId : ${assetId}`
    );
    return next(apiError);
  }
  const data = { asset };
  const response = createApiResponse(
    data,
    `Fetched assets successfully for assetId ${assetId} !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const getAssetByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const assets = await assetService.getAssetByUser(userId);
  if (!assets || assets.length <= 0) {
    const apiError = createApiError(
      httpStatus.NOT_FOUND,
      `asset not dound with userId : ${userId}`
    );
    return next(apiError);
  }
  const data = { assets };
  const response = createApiResponse(
    data,
    `Fetched assets successfully for user :  ${userId} !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const assignAssetToUser = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { assetId } = req.params;
  const { assignedTo } = req.body;
  const updatedAsset = await assetService.assignAssetToUser(
    assetId,
    assignedTo,
    userId
  );
  const data = { updatedAsset };
  const response = createApiResponse(
    data,
    `asset is assigned successfully for user :  ${assignedTo} !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const addNewAsset = asyncHandler(async (req, res, next) => {
  const { body: assetData } = req;
  const { _id: userId } = req.user;
  const createdAsset = await assetService.addNewAsset(assetData, userId);
  const data = { createdAsset };
  const response = createApiResponse(
    data,
    `created a new assets successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const updateAssetById = asyncHandler(async (req, res, next) => {
  const { body: assetData } = req;
  const { _id: userId } = req.user;
  const updatedAsset = await assetService.updateAssetById(assetData, userId);
  const data = { updatedAsset };
  const response = createApiResponse(
    data,
    `updated a new assets successfully !!!`,
    httpStatus.CREATED
  );
  res.status(httpStatus.OK).json(response);
});

const updateWarrantyInfo = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;
  const { _id: userId } = req.user;
  const { body: warrantyInfo } = req;

  const updatedAsset = await assetService.updateWarrantyInfo(
    assetId,
    warrantyInfo,
    userId
  );
  const data = { updatedAsset };
  const response = createApiResponse(
    data,
    `updated a new assets successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const addNewMaintenanceLogs = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;
  const { _id: userId } = req.user;
  const { body: newMaintenanceData } = req;

  const updatedAsset = await assetService.addNewMaintenanceLogs(
    assetId,
    newMaintenanceData,
    userId
  );
  const data = { updatedAsset };
  const response = createApiResponse(
    data,
    `updated a new assets successfully !!!`,
    httpStatus.CREATED
  );
  res.status(httpStatus.OK).json(response);
});

const updateMaintenanceLogs = asyncHandler(async (req, res, next) => {
  const { assetId, maintenanceLogId } = req.params;
  const { _id: userId } = req.user;
  const { body: newMaintenanceData } = req;

  const updatedAsset = await assetService.updateMaintenanceLogs(
    assetId,
    maintenanceLogId,
    newMaintenanceData,
    userId
  );
  const data = { updatedAsset };
  const response = createApiResponse(
    data,
    `updated a new assets successfully !!!`
  );
  res.status(httpStatus.OK).json(response);
});

const deleteAssetById = asyncHandler(async (req, res, next) => {});

const deleteAllAssets = asyncHandler(async (req, res, next) => {});

/** ASSET SECTIONS END */
export {
  getAllAssets,
  getAssetById,
  getAssetByUser,
  assignAssetToUser,
  addNewAsset,
  addNewMaintenanceLogs,
  updateAssetById,
  updateWarrantyInfo,
  updateMaintenanceLogs,
  deleteAssetById,
  deleteAllAssets,
  addAssets,
};
