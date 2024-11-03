import { Asset } from "../models/Asset.js";
import { AssetType } from "../models/AssetType.js";

import userService from "../services/user.service.js";
import { APIError } from "../utils/APIError.js";
import httpStatus from "http-status";
import { AssetCategory } from "../models/AssetCategory.js";
import logger from "../utils/logger.js";

const ASSET_FILTER_OPTIONS = {
  assetTag: { operators: [], provide: true },
  category: { operators: ["in"], provide: true },
  assetType: { operators: ["in"], provide: true },
  location: { operators: ["in"], provide: true },
  status: { operators: ["in"], provide: true },
  serialNumber: { operators: [], provide: true },
  model: { operators: ["in"], provide: true },
  manufacturer: { operators: ["in"], provide: true },
  assignedTo: { operators: ["in"], provide: true },
};

const EXCLUDE_QUERY_PARAMAS = ["page", "limit", "sort"];
const getOperater = (values = "") => {
  let result = {};
  try {
    if (values.includes("|")) {
      result = { $in: values.split("|") };
    } else if (values.includes(",")) {
      result = { $and: values.split(",") };
    } else {
      result = values;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const buildFilter = (query = {}) => {
  let filter = {};
  Object.keys(query).forEach((key) => {
    if (!EXCLUDE_QUERY_PARAMAS.includes(key)) {
      const isFilterOption =
        ASSET_FILTER_OPTIONS[key] && ASSET_FILTER_OPTIONS[key].provide === true;
      if (isFilterOption) {
        filter[key] = getOperater(query[key]);
      }
    }
  });
  return filter;
};

const getAllAssets = async (query) => {
  let { page, limit } = query;
  try {
    const sort = {};

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = buildFilter(query);
    console.log(filter);
    const pipelines = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "assetcategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true, // Keep assets even if no matching category
        },
      },
      {
        $lookup: {
          from: "assettypes",
          localField: "assetType",
          foreignField: "_id",
          as: "assetType",
        },
      },
      {
        $unwind: {
          path: "$assetType",
          preserveNullAndEmptyArrays: true, // Keep assets even if no matching asset type
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },
      {
        $unwind: {
          path: "$assignedTo",
          preserveNullAndEmptyArrays: true, // Keep assets even if no assigned user
        },
      },
      {
        $facet: {
          metadata: [
            {
              $count: "totalCount",
            },
          ],
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ];

    const assets = await Asset.aggregate(pipelines);
    const totalCount =
      assets[0].metadata.length !== 0 ? assets[0].metadata[0].totalCount : 0;
    const totalPage = Math.ceil(totalCount / limit);

    return {
      metadata: {
        totalCount: totalCount,
        page: page,
        prePage: page === 1 ? null : page - 1,
        nextPage: totalPage === 0 || page === totalPage ? null : page + 1,
        totalPage: totalPage,
      },
      assets: assets[0].data,
    };

    // const totalRecord = await Asset.countDocuments(filter);

    // const totalPages = Math.ceil(totalRecord / limit);
    // const assets = await Asset.find(filter).sort(sort).skip(skip).limit(limit);

    // const pagination = {
    //   page: page,
    //   prePage: page === 1 ? null : page - 1,
    //   nextPage: page === totalPages ? null : page + 1,
    //   totalPages,
    //   total: totalRecord,
    // };
    // return { totalRecord, assets, pagination };
  } catch (error) {
    logger.error(`AssetService : getAllAssets : error : ${error.message}`);
    throw error;
  }
};

const getAssetById = async (assetId) => {
  try {
    const asset = await Asset.findById(assetId);
    return asset;
  } catch (error) {
    logger.error(`AssetService : getAssetById : error : ${error.message}`);
    throw error;
  }
};

const addNewAsset = async (assetData, userId) => {
  try {
    const { assignedTo, assetType: assetTypeId } = assetData;

    if (assignedTo) {
      const user = await userService.getUserById(assignedTo);
      if (!user) {
        throw new APIError(
          httpStatus.NOT_FOUND,
          `user not found with userId : ${assignedTo}`
        );
      }
    }

    if (assetTypeId) {
      const isAssetTypeValid = !!(await AssetType.findById(assetTypeId));
      if (!isAssetTypeValid) {
        throw new APIError(httpStatus.NOT_FOUND, `Invalid assetTypeId !!!`);
      }
    }

    // Create a new asset document
    const newAsset = new Asset({
      assetTag: assetData.assetTag,
      category: assetData.category,
      assetType: assetData.assetType,
      description: assetData.description,
      location: assetData.location,
      status: assetData.status,
      acquisitionDate: new Date(assetData.acquisitionDate),
      purchaseCost: assetData.purchaseCost,
      currentValue: assetData.currentValue,
      depreciationRate: assetData.depreciationRate,
      serialNumber: assetData.serialNumber,
      model: assetData.model,
      manufacturer: assetData.manufacturer,
      assignedTo: assetData.assignedTo,
      assignedDate: new Date(assetData.assignedDate),
      warrantyInfo: {
        provider: assetData.warrantyInfo.provider,
        start: new Date(assetData.warrantyInfo.start),
        end: new Date(assetData.warrantyInfo.end),
      },
      purchaseOrderNumber: assetData.purchaseOrderNumber,
      serviceTag: assetData.serviceTag,
      notes: assetData.notes,
      createdBy: userId,
      updatedBy: userId,
      maintenanceLogs: assetData.maintenanceLogs,
    });

    const createdAsset = await newAsset.save();
    return createdAsset;
  } catch (error) {
    logger.error(`AssetService : addNewAsset : error : ${error.message}`);
    throw error;
  }
};

const addNewMaintenanceLogs = async (assetId, newMaintenanceData, userId) => {
  try {
    const assetToUpdate = await Asset.findById(assetId);
    if (!assetToUpdate) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `asset not found with assetId : ${assetId}`
      );
    }
    assetToUpdate.maintenanceLogs.push(newMaintenanceData);
    assetToUpdate.updatedBy = userId;
    const updatedAsset = await assetToUpdate.save();
    return updatedAsset;
  } catch (error) {
    logger.error(
      `AssetService : addNewMaintenanceLogs : error : ${error.message}`
    );
    throw error;
  }
};

const updateAssetById = async (assetId, newAssetData, userId) => {
  try {
  } catch (error) {
    logger.error(`AssetService : updateAssetById : error : ${error.message}`);
    throw error;
  }
};

const updateWarrantyInfo = async (assetId, newWarrantyInfo, userId) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      newWarrantyInfo,
      {
        new: true,
        upsert: true,
      }
    );
    return updatedAsset;
  } catch (error) {
    logger.error(
      `AssetService : updateWarrantyInfo : error : ${error.message}`
    );
    throw error;
  }
};

const updateMaintenanceLogs = async (
  assetId,
  maintenanceLogId,
  newMaintenanceData,
  userId
) => {
  try {
    // const maintenanceLog = await Asset.findByOne({
    //    _id: assetId,
    //    maintenanceLogs._id : maintenanceLogId
    //  });
    //return updatedAsset;
  } catch (error) {
    logger.error(
      `AssetService : updateMaintenanceLogs : error : ${error.message}`
    );
    throw error;
  }
};

const deleteAssetById = async (assetId) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(assetId);
    return deletedAsset;
  } catch (error) {
    logger.error(`AssetService : deleteAssetById : error : ${error.message}`);
    throw error;
  }
};

const deleteAllAsset = async () => {
  try {
    await Asset.deleteMany();
  } catch (error) {
    logger.error(`AssetService : deleteAllAsset : error : ${error.message}`);
    throw error;
  }
};

// --------Asset with User section start----------
const getAssetByUser = async (userId) => {
  try {
    const userAssets = await Asset.find({
      assignedTo: userId,
    });
    return userAssets;
  } catch (error) {
    throw error;
  }
};

const assignAssetToUser = async (assetId, assignedTo, userId) => {
  try {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      throw new APIError(
        httpStatus.NOT_FOUND,
        `Asset not found with assetId : ${assetId}`
      );
    }
    asset.assignedTo = assignedTo;
    asset.assignedDate = new Date();
    asset.updatedBy = userId;

    const updatedAsset = await asset.save();
    return updatedAsset;
  } catch (error) {
    throw error;
  }
};

// --------Asset with User section END----------------

// --------AssetType section start -----------

const getAllAssetTypes = async () => {
  try {
    const assetTypes = await AssetType.find()
      .populate("categoryId", { category: 1 })
      .select({
        name: 1,
      });
    return assetTypes;
  } catch (error) {
    throw error;
  }
};

const getAssetTypeById = async (assetTypeId) => {
  try {
    const assetType = await AssetType.findById(assetTypeId);
    return assetType;
  } catch (error) {
    throw error;
  }
};

const addNewAssetType = async (assetTypeData, userId) => {
  try {
    const newAssetType = new AssetType({
      name: assetTypeData.name,
      categoryId: assetTypeData.categoryId,
      createdBy: userId,
      updatedBy: userId,
    });
    const createdAssetType = await newAssetType.save();
    return createdAssetType;
  } catch (error) {
    throw error;
  }
};

const updateAssetTypeById = async (assetTypeId, assetTypeData, userId) => {
  try {
    const newAssetTypeData = { ...assetTypeData, updatedBy: userId };

    const updatedAssetType = await AssetType.findByIdAndUpdate(
      assetTypeId,
      newAssetTypeData,
      {
        new: true,
      }
    );
    return updatedAssetType;
  } catch (error) {
    throw error;
  }
};

const deleteAssetTypeById = async (assetTypeId) => {
  try {
    const deletedAssetType = await AssetType.findByIdAndDelete(assetTypeId);
    return deletedAssetType;
  } catch (error) {
    throw error;
  }
};

const deleteAllAssetTypes = async () => {
  try {
    await AssetType.deleteMany();
  } catch (error) {
    throw error;
  }
};

// --------Asset AssetType section end---------

// --------AssetCategory section start -----------

const getAllAssetCategory = async () => {
  try {
    const assetTypes = await AssetCategory.find().select({ category: 1 });
    return assetTypes;
  } catch (error) {
    throw error;
  }
};

const getAssetCategoryById = async (assetCategoryId) => {
  try {
    const assetCategory = await AssetCategory.findById(assetCategoryId).select({
      category: 1,
    });
    return assetCategory;
  } catch (error) {
    throw error;
  }
};

const addNewAssetCategory = async (categoryData, userId) => {
  try {
    const newAssetCategory = new AssetCategory({
      category: categoryData.category,
      createdBy: userId,
      updatedBy: userId,
    });
    const createdAssetCategory = await newAssetCategory.save();
    return createdAssetCategory;
  } catch (error) {
    throw error;
  }
};

const updateAssetCategoryById = async (categoryId, categoryData, userId) => {
  try {
    const newCategoryData = { ...categoryData, updatedBy: userId };
    const updatedAssetCategory = await AssetCategory.findByIdAndUpdate(
      categoryId,
      newCategoryData,
      {
        new: true,
      }
    );
    return updatedAssetCategory;
  } catch (error) {
    throw error;
  }
};

const deleteAssetCategoryById = async (categoryId) => {
  try {
    const deletedAssetCategory = await AssetCategory.findByIdAndDelete(
      categoryId
    );
    return deletedAssetCategory;
  } catch (error) {
    throw error;
  }
};

const deleteAllAssetCategory = async () => {
  try {
    const deletedAssetCategoryDetails = await AssetCategory.deleteMany();
    return deletedAssetCategoryDetails;
  } catch (error) {
    throw error;
  }
};

// --------Asset AssetType section end---------

const getAssetTypesByCategoryId = async (assetCategoryId) => {
  try {
    const assetTypes = await AssetType.find({
      categoryId: assetCategoryId,
    }).select({ name: 1 });
    return assetTypes;
  } catch (error) {
    throw error;
  }
};
const getAssetTypesByCategory = async () => {
  try {
    const assetTypesByCategory = await AssetType.aggregate([
      {
        $lookup: {
          from: "assetcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$category._id",
          categoryName: {
            $first: "$category.category",
          },
          assetTypes: {
            $push: {
              _id: "$_id",
              assetType: "$name",
            },
          },
        },
      },
    ]);
    return assetTypesByCategory;
  } catch (error) {
    throw error;
  }
};

export default {
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
  deleteAllAsset,
  getAllAssetTypes,
  getAssetTypeById,
  addNewAssetType,
  updateAssetTypeById,
  deleteAssetTypeById,
  deleteAllAssetTypes,
  getAllAssetCategory,
  getAssetCategoryById,
  addNewAssetCategory,
  updateAssetCategoryById,
  deleteAssetCategoryById,
  deleteAllAssetCategory,
  getAssetTypesByCategoryId,
  getAssetTypesByCategory,
};
