import express from "express";
import {GenreController} from "../controllers/genre.controller.js";
import checkAdmin from "../middlewares/check-admin.mdlwr.js";
import jwtMdlwr from "../middlewares/jwt.mdlwr.js";

const initGenreRoutes = (app) => {
    const router = express.Router()
    router.post("/create", jwtMdlwr, GenreController.createGenre)
    router.get("/read", GenreController.readGenre)
    router.put("/update/:id_genre", checkAdmin, GenreController.updateGenre)
    router.delete("/delete/:id_genre", checkAdmin, GenreController.deleteGenre)

app.use("/genre", router)
}

export default initGenreRoutes;