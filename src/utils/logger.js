import winston, { transports } from "winston";

// Options for console transport (can be extended if needed)
const consoleTransportOptions = {};

// Options for error log file transport
const fileTransportOptions = {
  level: "error", // Log only 'error' level messages
  filename: "error.log", // File to store error logs
};

// Options for combined log file transport
const fileTransportOptionsForCombined = {
  filename: "combined.log", // File to store combined logs (all levels)
};

// Function to create a console transport instance
const createConsoleTransportInstance = (options = {}) => {
  return new transports.Console(options);
};

// Function to create a file transport instance
const createFileTransportInstance = (options = {}) => {
  return new transports.File(options);
};

// Create Winston logger instance with specified transports
const logger = winston.createLogger({
  level: "info", // Minimum logging level (log 'info' and higher)
  transports: [
    createConsoleTransportInstance(consoleTransportOptions), // Console transport
    createFileTransportInstance(fileTransportOptions), // Error log file transport
    createFileTransportInstance(fileTransportOptionsForCombined), // Combined log file transport
  ],
});

export default logger;
