import { Book } from "./sequelize.models.js";

const readBooks = async () => {
  let error = null;
  let result = null;

  try {
    const rows = await Book.findAll({
      order: [["title", "ASC"]],
      raw: true,
    });
    result = rows;
  } catch (e) {
    error = e.message;
    console.error("Error reading books:", e);
  } finally {
    return { error, result };
  }
};

const readOneBook = async (id_books) => {
  let error = null;
  let result = null;

  try {
    const row = await Book.findByPk(id_books, { raw: true });
    result = row ? [row] : [];
  } catch (e) {
    error = e.message;
    console.error("Error reading single book:", e);
  } finally {
    return { error, result };
  }
};

const createBook = async (
  title,
  autor,
  resume,
  published_at,
  cover,
  genre,
  verified,
) => {
  let error = null;
  let result = null;

  try {
    const created = await Book.create({
      title,
      autor,
      resume,
      published_at,
      cover,
      genre,
      verified,
    });

    result = {
      insertId: created.id_books,
      affectedRows: 1,
    };
  } catch (e) {
    error = e.message;
    console.error("Error insert single book:", e);
  } finally {
    return { error, result };
  }
};

const updateBook = async (
  title,
  autor,
  resume,
  published_at,
  cover,
  genre,
  verified,
  id_books,
) => {
  let error = null;
  let result = null;

  try {
    const [affectedRows] = await Book.update(
      { title, autor, resume, published_at, cover, genre, verified },
      { where: { id_books } },
    );

    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error update single book:", e);
  } finally {
    return { error, result };
  }
};

const deleteOneBook = async (id_books) => {
  let error = null;
  let result = null;

  try {
    const affectedRows = await Book.destroy({ where: { id_books } });
    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error deleting single book:", e);
  } finally {
    return { error, result };
  }
};

export const bookDB = {
  readBooks,
  readOneBook,
  createBook,
  updateBook,
  deleteOneBook,
};
