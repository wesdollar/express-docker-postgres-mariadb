import Joi, { ValidationError } from "joi";
import { validateData } from "./validate-data";

it("should return validate data if all data passed", () => {
  const schema = { phish: Joi.string().required() };
  const body = { phish: "the band" };

  const validatedData = validateData(schema, body);

  expect(validatedData).toEqual({ value: body });
});

it("should return error when data is not valid", () => {
  const schema = { phish: Joi.string().required() };
  const body = { phish: null };

  const validatedData = validateData(schema, body);
  const expectedResult = {
    error: new ValidationError(`"phish" must be a string`, null, null),
    value: body,
  };

  expect(validatedData).toEqual(expectedResult);
});
