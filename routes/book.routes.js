import express from "express";
import {BookController} from "../controllers/book.controller.js";
import jwtMdlwr from "../middlewares/jwt.mdlwr.js";

const initBookRoutes = (app) => {
    const router = express.Router()
    router.post("/create", jwtMdlwr, BookController.createBook)
    router.get("/read", BookController.readBooks)
    router.get("/readone/:id_books", BookController.readOneBook)
    router.put("/update/:id_books", jwtMdlwr, BookController.updateBook)
    router.delete("/delete/:id_books", jwtMdlwr, BookController.deleteBook)

app.use("/books",router)
}

export default initBookRoutes;