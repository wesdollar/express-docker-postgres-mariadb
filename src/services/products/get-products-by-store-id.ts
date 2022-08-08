import * as models from "../../models/index";

export const getProductsByStoreId = async (storeId: string) => {
  try {
    // @ts-ignore TODO: typing
    const products = await models.Product.findAll({
      where: { StoreId: storeId },
    });

    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};
