import * as models from "../../models/index";

export const getProductsByCategoryId = async (categoryId: string) => {
  try {
    // @ts-ignore TODO: typing
    const products = await models.Product.findAll({
      where: { CategoryId: categoryId },
    });

    return Promise.resolve(products);
  } catch (error) {
    return Promise.reject(error);
  }
};
