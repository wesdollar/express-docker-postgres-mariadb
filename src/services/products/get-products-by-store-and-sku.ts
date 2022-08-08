import * as models from "../../models/index";

export const getProductsByStoreAndSku = async (
  storeId: string,
  sku: string
) => {
  try {
    // @ts-ignore TODO: typing
    const products = await models.Product.findAll({
      where: { StoreId: storeId, sku },
    });

    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};
