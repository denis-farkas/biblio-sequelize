import { commentDB } from "../database/db.provider.js";

const createComment = async (req, res) => {
  try {
    const { content, created_at, verified, id_books, id_user } = req.body;
    const response = await commentDB.createComment(
      content,
      created_at,
      verified,
      id_books,
      id_user,
    );
    if (response.error) {
      return res.status(500).json({ message: response.error });
    }
    return res.status(201).json({
      message: "Le commentaire a été ajouté avec succès",
      id_comment: response.result.insertId,
    });
  } catch (error) {
    console.error("Controller error", error);
    return res.status(500).json({ message: error.message });
  }
};

const readComment = async (req, res) => {
  try {
    const commentResponse = await commentDB.readComment();
    if (commentResponse.error) {
      return res.status(500).json({ message: commentResponse.error });
    }
    const comment = commentResponse.result;
    return res.status(200).json({ message: "OK", comment });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

const readCommentByBook = async (req, res) => {
  try {
    const id_books = req.params.id_books;
    if (!id_books) {
      return res.status(400).json({ message: "id books requise" });
    }
    const commentResponse = await commentDB.readCommentByBook(id_books);
    if (commentResponse.error) {
      return res.status(500).json({ message: commentResponse.error });
    }
    const comments = commentResponse.result || [];
    return res.status(200).json({ message: "OK", comments });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

const readCommentByUser = async (req, res) => {
  try {
    const id_user = req.params.id_user;
    if (!id_user) {
      return res.status(400).json({ message: "id user requis" });
    }
    const commentResponse = await commentDB.readCommentByUser(id_user);
    if (commentResponse.error) {
      return res.status(500).json({ message: commentResponse.error });
    }
    const comments = commentResponse.result || [];
    return res.status(200).json({ message: "OK", comments });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const id_comment = req.params.id_comment;
    const userCommentResponse = await commentDB.getUserComment(id_comment);
    if (userCommentResponse.error) {
      return res.status(500).json({ message: userCommentResponse.error });
    }

    const idUser = userCommentResponse.idUser;
    const { content, created_at, verified, id_user } = req.body;
    if (String(idUser) !== String(id_user)) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    }
    const response = await commentDB.updateComment(
      content,
      created_at,
      verified,
      id_comment,
    );
    if (response.error) {
      return res.status(500).json({ message: response.error });
    }
    return res
      .status(201)
      .json({ message: `Le commentaire a été modifié avec succès` });
  } catch (error) {
    console.error("Controller error", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id_comment = req.params.id_comment;
    const response = await commentDB.deleteOneComment(id_comment);
    if (response.error) {
      return res.status(500).json({ message: response.error });
    }
    if (!response.result || response.result.affectedRows === 0) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    return res.status(200).json({
      message: "Commentaire supprimé avec succès",
      id_comment: Number(id_comment),
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const CommentController = {
  readComment,
  readCommentByBook,
  readCommentByUser,
  createComment,
  updateComment,
  deleteComment,
};
