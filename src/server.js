import http from "http";
import app from "./app.js";

import envVars from "./config/envVars.config.js";
import { dbConnect, dbDisconnect } from "./config/db.config.js";

import logger from "./utils/logger.js";

const port = envVars.port || 8080;

const createServer = (app, port) => {
  try {
    const server = http.createServer(app);
    server.listen(port, () =>
      logger.info(`Server is listening on http://localhost:${port}`)
    );
    return server;
  } catch (error) {
    throw error;
  }
};

const bootstrapServer = async () => {
  try {
    await dbConnect();
    createServer(app, port);
  } catch (error) {
    logger.error(`Error occured while bootstrap the server : error : `, error);
    await dbDisconnect();
    process.exit(1);
  }
};

bootstrapServer();
