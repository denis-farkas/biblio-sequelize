import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
// Options pour la création du token JWT (expiration après 8 heures)
const jwtOptions = { expiresIn: "8h" }; // 8h
// Clé secrète pour la signature du token, avec une valeur par défaut si non définie dans les variables d'environnement
const secret = process.env.JWT_SECRET;
// Middleware pour la vérification du token JWT dans les requêtes (version améliorée)
const jwtMdlwr = (req, res, next) => {
  try {
    // Vérification de la présence de l'en-tête Authorization
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Token d'authentification requis",
      });
    }
    // Vérification du format du token (Bearer token)
    if (!req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Format de token invalide. Utilisez 'Bearer '",
      });
    }

// Récupération du token depuis l'en-tête Authorization de la requête
    const token = req.headers.authorization.split(" ")[1];
    // Vérification et décryptage du token
    const userId = jwtVerify(token);
    // Si le token est invalide, renvoie d'une réponse avec un statut 401 (Non autorisé)
    if (!userId) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    
// Ajout de l'identifiant de l'utilisateur dans le corps de la requête
    req.body.userId = userId;
    // Poursuite de l'exécution de la requête suivante (middleware suivant)
    next();
  } catch (error) {
    console.error("Erreur dans le middleware JWT:", error);
    return res.status(500).json({
      message: "Erreur interne du serveur lors de la vérification du token",
    });
  }
};

// Fonction pour vérifier et décrypter un token JWT
const jwtVerify = (token) => {
  try {
    // Décryptage du token avec la clé secrète
    const decoded = jwt.verify(token, secret);
    // Récupération de l'identifiant de l'utilisateur depuis le token décrypté
    const userId = decoded.data;
    return userId;
  } catch (err) {
    // En cas d'erreur, affichage dans la console et retour de la valeur null
    console.error("jwt.mdlwr.js - jwtVerify - erreur =>" , err.message);
    return null;
  }
};

// Fonction pour créer un nouveau token JWT
export const jwtSign = (data) => jwt.sign({ data }, secret, jwtOptions);
// Exportation du middleware et de la fonction de création de token
export default jwtMdlwr;
// Export alternatif pour l'authentification
export { jwtMdlwr as authMiddleware };