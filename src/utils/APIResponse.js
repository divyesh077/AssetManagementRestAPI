import httpStatus from "http-status";

export class APIResponse {
  constructor(data, message = "", statusCode = httpStatus.OK, status = true) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.status = status;
  }
}
