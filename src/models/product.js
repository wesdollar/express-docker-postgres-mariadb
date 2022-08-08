"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // @ts-ignore TODO: typing
    static associate(models) {
      Product.belongsTo(models.Store);
    }
  }

  Product.init(
    {
      productName: DataTypes.STRING,
      shortDescription: DataTypes.TEXT("medium"),
      longDescription: DataTypes.TEXT("long"),
      price: DataTypes.DECIMAL(10, 2),
      salesPrice: DataTypes.DECIMAL(10, 2),
      sku: DataTypes.STRING,
      imageLink: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
