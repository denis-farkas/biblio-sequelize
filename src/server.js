import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initRoutes from "../routes/init.routes.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors({origin:'*'}))
app.use(express.json());
initRoutes(app)

app.listen(PORT,()=>{
    console.log("Le serveur écoute sur le port: ",PORT)
})