import { Request, Response } from "express";
import Joi from "joi";
import { validateData } from "../helpers/validate-data";
import { httpStatusCodes } from "@dollarcode/dollar-modules/declarations/http-status-codes";
import { getProductsByStoreId } from "../services/products/get-products-by-store-id";
import { getProductsByStoreAndSku } from "../services/products/get-products-by-store-and-sku";
import { errorResponse } from "../helpers/error-response";

export const getProducts = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const validationSchema = {
    storeId: Joi.string().required(),
  };

  const validatedData = validateData(validationSchema, { storeId });

  if (validatedData.error) {
    return res
      .status(httpStatusCodes.badRequest)
      .json(
        errorResponse(
          `request data is invalid`,
          httpStatusCodes.badRequest,
          validatedData.error
        )
      );
  }

  try {
    const products = await getProductsByStoreId(storeId);

    return res.json(products);
  } catch (error) {
    return res
      .status(httpStatusCodes.serverError)
      .json(errorResponse(error, httpStatusCodes.serverError));
  }
};

export const getProductsBySku = async (req: Request, res: Response) => {
  const { storeId, sku } = req.params;

  const validationSchema = {
    storeId: Joi.string().required(),
    sku: Joi.string().required(),
  };

  const validatedData = validateData(validationSchema, { storeId, sku });

  if (validatedData.error) {
    return res
      .status(httpStatusCodes.badRequest)
      .json(
        errorResponse(
          `request data is invalid`,
          httpStatusCodes.badRequest,
          validatedData.error
        )
      );
  }

  try {
    const products = await getProductsByStoreAndSku(storeId, sku);

    return res.json(products);
  } catch (error) {
    return res
      .status(httpStatusCodes.serverError)
      .json(errorResponse(error, httpStatusCodes.serverError));
  }
};
