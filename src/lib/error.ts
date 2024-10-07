import { StatusCodes, getReasonPhrase } from 'http-status-codes';
type ErrorType = {
  status?: StatusCodes;
  message?: string;
  errors?: Record<string, string>[];
};
export class HttpError extends Error {
  status: StatusCodes;
  errors: Record<string, string>[];

  constructor({
    status = StatusCodes.BAD_REQUEST,
    message = getReasonPhrase(StatusCodes.BAD_REQUEST),
    errors = [],
  }: ErrorType) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = this.constructor.name;
  }
}

export class EntityError extends HttpError {
  constructor({
    status = StatusCodes.UNPROCESSABLE_ENTITY,
    message = getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
    errors = [],
  }: ErrorType) {
    super({ status, message, errors });
    this.name = this.constructor.name;
  }
}
