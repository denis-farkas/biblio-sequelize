"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const genres = await queryInterface.sequelize.query(
      'SELECT id_genre, genre_name FROM genre WHERE genre_name IN ("Fantastique", "Science-Fiction", "Roman")',
      { type: Sequelize.QueryTypes.SELECT },
    );

    const genreByName = Object.fromEntries(
      genres.map((genre) => [genre.genre_name, genre.id_genre]),
    );

    await queryInterface.bulkInsert("books", [
      {
        title: "Harry Potter a l'ecole des sorciers",
        autor: "J.K. Rowling",
        resume: "Un jeune sorcier decouvre ses pouvoirs et entre a Poudlard.",
        published_at: new Date("1997-06-26"),
        cover: null,
        genre: genreByName.Fantastique ?? null,
        verified: true,
      },
      {
        title: "Dune",
        autor: "Frank Herbert",
        resume:
          "Sur Arrakis, les rivalites politiques se melent a une prophetie.",
        published_at: new Date("1965-08-01"),
        cover: null,
        genre: genreByName["Science-Fiction"] ?? null,
        verified: true,
      },
      {
        title: "Le Petit Prince",
        autor: "Antoine de Saint-Exupery",
        resume:
          "Une rencontre poetique dans le desert qui parle de l'essentiel.",
        published_at: new Date("1943-04-06"),
        cover: null,
        genre: genreByName.Roman ?? null,
        verified: true,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("books", {
      title: ["Harry Potter a l'ecole des sorciers", "Dune", "Le Petit Prince"],
    });
  },
};
