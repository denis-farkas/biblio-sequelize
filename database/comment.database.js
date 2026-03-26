import { Op } from "sequelize";
import { Book, Comment, Transit, User } from "./sequelize.models.js";

const readComment = async () => {
  let error = null;
  let result = null;

  try {
    result = await Comment.findAll({
      order: [["content", "ASC"]],
      raw: true,
    });
  } catch (e) {
    error = e.message;
    console.error("Error reading comment:", e);
  } finally {
    return { error, result };
  }
};

const getUserComment = async (id_comment) => {
  let error = null;
  let idUser = null;

  try {
    const transit = await Transit.findOne({
      where: { id_comment },
      raw: true,
    });

    idUser = transit?.id_user ?? null;
  } catch (e) {
    error = e.message;
    console.error("Error reading single comment:", e);
  } finally {
    return { error, idUser };
  }
};

const readCommentByBook = async (id_books) => {
  let error = null;
  let result = null;

  try {
    const comments = await Comment.findAll({
      where: { id_books },
      order: [["content", "ASC"]],
      raw: true,
    });

    if (comments.length === 0) {
      return { error, result: [] };
    }

    const commentIds = comments.map((c) => c.id_comment);
    const transitRows = await Transit.findAll({
      where: { id_comment: { [Op.in]: commentIds } },
      raw: true,
    });

    const userIds = [...new Set(transitRows.map((t) => t.id_user))];
    const users =
      userIds.length > 0
        ? await User.findAll({
            where: { id_user: { [Op.in]: userIds } },
            attributes: ["id_user", "surname"],
            raw: true,
          })
        : [];

    const userById = new Map(users.map((u) => [u.id_user, u]));
    const transitByComment = new Map(transitRows.map((t) => [t.id_comment, t]));

    result = comments.map((c) => {
      const tr = transitByComment.get(c.id_comment);
      const user = tr ? userById.get(tr.id_user) : null;
      return {
        ...c,
        id_user: tr?.id_user ?? null,
        surname: user?.surname ?? null,
      };
    });
  } catch (e) {
    error = e.message;
    console.error("Error reading comments:", e);
  } finally {
    return { error, result };
  }
};

const readCommentByUser = async (id_user) => {
  let error = null;
  let result = null;

  try {
    const transits = await Transit.findAll({ where: { id_user }, raw: true });

    if (transits.length === 0) {
      return { error, result: [] };
    }

    const commentIds = transits.map((t) => t.id_comment);
    const comments = await Comment.findAll({
      where: { id_comment: { [Op.in]: commentIds } },
      raw: true,
    });

    const bookIds = [...new Set(comments.map((c) => c.id_books))];
    const books =
      bookIds.length > 0
        ? await Book.findAll({
            where: { id_books: { [Op.in]: bookIds } },
            attributes: ["id_books", "title", "autor"],
            raw: true,
          })
        : [];

    const bookById = new Map(books.map((b) => [b.id_books, b]));

    result = comments
      .sort((a, b) => a.content.localeCompare(b.content))
      .map((c) => {
        const b = bookById.get(c.id_books);
        return {
          id_comment: c.id_comment,
          content: c.content,
          created_at: c.created_at,
          verified: c.verified,
          title: b?.title ?? null,
          autor: b?.autor ?? null,
        };
      });
  } catch (e) {
    error = e.message;
    console.error("Error reading comments:", e);
  } finally {
    return { error, result };
  }
};

const createComment = async (
  content,
  created_at,
  verified,
  id_books,
  id_user,
) => {
  let error = null;
  let result = null;

  try {
    if (id_books === undefined || id_books === null) {
      throw new Error("id_books est requis pour créer un commentaire");
    }

    if (id_user === undefined || id_user === null) {
      throw new Error("id_user est requis pour créer un commentaire");
    }

    const created = await Comment.create({
      content,
      created_at,
      verified,
      id_books,
    });
    await Transit.create({ id_comment: created.id_comment, id_user });

    result = {
      insertId: created.id_comment,
      affectedRows: 1,
    };
  } catch (e) {
    error = e.message;
    console.error("Error insert single comment:", e);
  } finally {
    return { error, result };
  }
};

const updateComment = async (content, created_at, verified, id_comment) => {
  let error = null;
  let result = null;

  try {
    const [affectedRows] = await Comment.update(
      { content, created_at, verified },
      { where: { id_comment } },
    );

    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error update single comment:", e);
  } finally {
    return { error, result };
  }
};

const deleteOneComment = async (id_comment) => {
  let error = null;
  let result = null;

  try {
    await Transit.destroy({ where: { id_comment } });
    const affectedRows = await Comment.destroy({ where: { id_comment } });
    result = { affectedRows };
  } catch (e) {
    error = e.message;
    console.error("Error deleting single comment:", e);
  } finally {
    return { error, result };
  }
};

export const commentDB = {
  readComment,
  getUserComment,
  readCommentByBook,
  readCommentByUser,
  createComment,
  updateComment,
  deleteOneComment,
};
