"use strict";

const { faker } = require("@faker-js/faker");
const tableName = "Stores";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      tableName,
      [
        {
          name: "Phish Dry Goods",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Merch Collective",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Synthery's Closet",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
