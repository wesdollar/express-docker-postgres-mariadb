import { Router } from "express";
import { ProductRoute } from "./product.route";

jest.mock("express", () => ({
  Router: jest.fn(() => ({ get: jest.fn(), post: jest.fn() })),
}));

jest.mock("../controllers/get-products-by-search-form", () => ({
  getProductsBySearchForm: jest.fn(),
}));

it("should initialize router", () => {
  new ProductRoute();

  expect(Router).toBeCalled();
});

it("should initialize routes", () => {
  const routes = new ProductRoute();

  expect(routes.router.get).toBeCalled();
  expect(routes.router.post).toBeCalled();
});
