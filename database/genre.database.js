import { Genre } from "./sequelize.models.js";

const createGenre = async (genre_name) => {
  let error = null;
  let result = null;

  try {
    const created = await Genre.create({ genre_name });
    result = {
      insertId: created.id_genre,
      affectedRows: 1,
    };
  } catch (e) {
    error = e.message;
    console.error("Error insert genre:", e);
  } finally {
    return { error, result };
  }
};

const readGenre = async () => {
  let error = null;
  let result = null;

  try {
    result = await Genre.findAll({
      order: [["genre_name", "ASC"]],
      raw: true,
    });
  } catch (e) {
    error = e.message;
    console.error("Error reading genre:", e);
  } finally {
    return { error, result };
  }
};

const readOneGenre = async (id_genre) => {
  let error = null;
  let result = null;

  try {
    const row = await Genre.findByPk(id_genre, { raw: true });
    result = row ? [row] : [];
  } catch (e) {
    error = e.message;
    console.error("Error reading single genre:", e);
  } finally {
    return { error, result };
  }
};

const updateGenre = async (genre_name, id_genre) => {
  let error = null;
  let result = null;

  try {
    const [affectedRows] = await Genre.update(
      { genre_name },
      { where: { id_genre } },
    );
    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error update single genre:", e);
  } finally {
    return { error, result };
  }
};

const deleteGenre = async (id_genre) => {
  let error = null;
  let result = null;

  try {
    const affectedRows = await Genre.destroy({ where: { id_genre } });
    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error deleting genre:", e);
  } finally {
    return { error, result };
  }
};

export const genreDB = {
  readGenre,
  readOneGenre,
  createGenre,
  updateGenre,
  deleteGenre,
};
