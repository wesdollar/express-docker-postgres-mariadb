/* eslint-disable require-await */
import express, { Request, Response, Router } from "express";
import { staticFilesDirectory } from "./constants/static-files-directory";
import { getProducts, getProductsBySku } from "./controllers/stores";

const apiVersion = process.env.API_VERSION;

/** route declarations */
export const routes = (): Router => {
  const router = express.Router();

  router.get(`/`, (req: Request, res: Response) => {
    return res.sendFile(`${__dirname}/${staticFilesDirectory}/index.html`);
  });

  router.get(`/${apiVersion}/health-check`, (req: Request, res: Response) => {
    return res.json({ healthy: true });
  });

  router.get(
    `/${apiVersion}/store/:storeId/products`,
    (req: Request, res: Response) => getProducts(req, res)
  );

  router.get(
    `/${apiVersion}/store/:storeId/products/:sku`,
    (req: Request, res: Response) => getProductsBySku(req, res)
  );

  return router;
};
