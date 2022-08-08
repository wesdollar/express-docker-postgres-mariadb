import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { HttpStatusCode } from "../constants/HttpStatusCodes";
import { getProductsBySearchForm } from "../controllers/get-products-by-search-form";
import { getVendorsByProductId } from "../controllers/get-vendors-by-product-id";

export class ProductRoute implements Routes {
  public path = "/product";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${process.env.BASEURL}/healthcheck`, (req, res) => {
      res.status(HttpStatusCode.Ok).send("OK");
    });

    const fullPath = `${process.env.BASEURL}${this.path}`;

    this.router.post(`${fullPath}/search`, getProductsBySearchForm);
    this.router.get(
      `${fullPath}/vendors/:productId/:guid`,
      getVendorsByProductId
    );
  }
}
