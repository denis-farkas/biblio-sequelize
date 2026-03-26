import express from "express";
import { UserController } from "../controllers/user.controller.js";
import jwtMdlwr from "../middlewares/jwt.mdlwr.js";

// Fonction pour initialiser les routes liées aux utilisateurs dans l'application Express
const initUserRoutes = (app) => {
    // Création d'un routeur Express dédié aux routes des utilisateurs
    const router = express.Router();

    // Définition des routes avec les méthodes associées du contrôleur
    router.post("/signUp", UserController.signUp);
    router.post("/signIn", UserController.signIn);
    router.get("/read", UserController.read);
    router.get("/readOneUser/:id_user", jwtMdlwr, UserController.readOneUser);
    router.put("/updateUser", jwtMdlwr, UserController.updateUser);

    // Utilisation du routeur dans l'application avec le préfixe "/users"
    app.use("/users", router);
};

export default initUserRoutes;