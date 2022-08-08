import { ValidationError } from "joi";

export const errorResponse = (
  message: unknown,
  statusCode: number,
  validationError?: ValidationError
) => ({
  error: {
    message,
    statusCode,
    validationError,
  },
});
