import express from "express";
import {CommentController} from "../controllers/comment.controller.js";
import jwtMdlwr from "../middlewares/jwt.mdlwr.js";

const initCommentRoutes = (app) => {
    const router = express.Router()
    router.post("/create", CommentController.createComment)
    router.get("/read", CommentController.readComment)
    router.put("/update/:id_comment", jwtMdlwr, CommentController.updateComment)
    router.delete("/delete/:id_comment", CommentController.deleteComment)

app.use("/comment", router)
}

export default initCommentRoutes;