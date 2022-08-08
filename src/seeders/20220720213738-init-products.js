"use strict";

const { faker } = require("@faker-js/faker");
const tableName = "Products";

module.exports = {
  async up(queryInterface) {
    const records = [];

    let i = 0;

    while (i <= 90) {
      records.push({
        productName: faker.commerce.product(),
        shortDescription: `${faker.commerce.productAdjective()} ${faker.color.human()} ${faker.commerce.productMaterial()}`,
        longDescription: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        salesPrice: faker.commerce.price(),
        sku: faker.random.alphaNumeric(9),
        imageLink: faker.image.cats(300, 300, true),
        StoreId: faker.datatype.number({ min: 1, max: 3 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      i++;
    }

    await queryInterface.bulkInsert(tableName, records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
