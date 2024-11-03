export class APIError extends Error {
  /**
   * Constructs an APIError instance.
   * @param {number} statusCode - HTTP status code associated with the error.
   * @param {string} message - Error message.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (default: true).
   * @param {string} [stack=''] - Optional stack trace (default: '').
   */
  constructor(statusCode, message, isOperational = true, stack = "") {
    // Call the Error constructor with the provided message
    super(message);

    // Set the name of the error to the name of the class (APIError)
    this.name = this.constructor.name;

    // Set additional properties specific to APIError
    this.statusCode = statusCode; // HTTP status code associated with the error
    this.isOperational = isOperational; // Indicates if the error is operational
    // (i.e., expected within application logic)

    // Ensure stack trace is captured correctly
    if (stack) {
      this.stack = stack; // Use provided stack trace if available
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture new stack trace
    }
  }
}
