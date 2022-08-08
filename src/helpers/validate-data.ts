import Joi, { PartialSchemaMap } from "joi";

/**
 * Validate data using Joi. Returns all fields that have errors.
 * Otherwise returns the safe-to-use, validated data.
 *
 * @param validationSchema object of Joi validation schema
 * @param body data to be validated
 * @returns Joi validation result
 */
export const validateData = (
  validationSchema: PartialSchemaMap,
  body: Record<string, unknown>
): Joi.ValidationResult => {
  return Joi.object(validationSchema)
    .options({ abortEarly: false })
    .validate(body);
};
