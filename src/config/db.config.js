import mongoose from "mongoose";

import envVars from "./envVars.config.js";
import logger from "../utils/logger.js";

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(
      envVars.mongodb.uri,
      envVars.mongodb.options
    );
    logger.info(`Database connected successfully!!!`);
    return db;
  } catch (error) {
    logger.error("Error occured while connecting the database !!!");
    process.exit(1);
  }
};

const dbDisconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    logger.error(
      "Error occured while disconnecting the database : error : ",
      error
    );
    process.exit(1);
  }
};

export { dbConnect, dbDisconnect };
