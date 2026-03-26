"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("genre", [
      { genre_name: "Roman" },
      { genre_name: "Science-Fiction" },
      { genre_name: "Fantastique" },
      { genre_name: "Policier" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("genre", {
      genre_name: ["Roman", "Science-Fiction", "Fantastique", "Policier"],
    });
  },
};
