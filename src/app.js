import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/api.router.js";
import { convertError, handleError } from "./middlewares/error.middleware.js";
import { notFound } from "./controllers/notFound.controller.js";

// Create Express application
const app = express();

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to set various HTTP headers for security
app.use(helmet());

// Middleware for HTTP request logging
app.use(morgan("dev")); // Use "dev" for development logging, adjust for production

// Middleware to parse JSON bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Mount API router under '/api' path
app.use("/api/v1", apiRouter);

// Catch-all route handler for routes not found
app.use("**", notFound);

app.use(convertError);
app.use(handleError);

// Export the configured Express application
export default app;
