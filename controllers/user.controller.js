import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";
import { UserDB } from "../database/db.provider.js";
import { jwtSign } from "../middlewares/jwt.mdlwr.js";

// Fonction pour lire les informations de tous les utilisateurs
const read = async (req, res) => {
  const response = await UserDB.read();
  const result = response.result;

  return res.status(200).json({ message: "Request OK", users: result });
};

// Fonction pour afficher les informations personnelles d'un utilisateur
const readOneUser = async (req, res) => {
  const id_user = req.params.id_user;
  const response = await UserDB.readOneUser(id_user);
  console.log(response);
  const result = response.result;

  if (!result || result.length === 0) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  const user = {
    surname: result[0].surname,
    email: result[0].email,
    role: result[0].role,
  };

  return res.status(200).json({ message: "Requête OK", user });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Validation de l'email
  if (!email || !isEmail(email)) {
    return res.status(403).json({ message: `Email invalide` });
  }

  // Récupération des informations de l'utilisateur depuis la base de données
  const response = await UserDB.signIn(email);
  const responseErr = response.error;
  if (responseErr) {
    return res.status(500).json({ message: responseErr });
  }

  const result = response.result;
  const user = result[0];

  // Vérification de l'existence de l'utilisateur
  if (!user) {
    return res.status(401).json({ message: `Échec de l'authentification` });
  }

  const userId = user.id_user;
  const role = user.role;
  const dbPassword = user.password;
  const surname = user.surname;

  // Comparaison des mots de passe hachés
  const passAreSame = await bcrypt.compare(password, dbPassword);
  if (!passAreSame) {
    return res.status(401).json({ message: `Échec de l'authentification` });
  }

  // Génération du jeton JWT
  const token = jwtSign(userId);
  return res.status(200).json({
    message: `Connexion réussie`,
    user: { userId, surname, email, token, role },
  });
};

// Fonction pour créer un utilisateur
const signUp = async (req, res) => {
  // Extraction des données de la requête
  const { surname, email, password, role } = req.body;

  // Vérification de l'existence de l'email dans la base de données
  const result = await UserDB.emailExist(email);

  if (!surname || typeof surname !== "string" || surname.trim().length < 2) {
    return res
      .status(403)
      .json({ message: "Le surname doit contenir au moins 2 caractères" });
  }

  // Validation de l'email
  if (!email || !isEmail(email)) {
    return res.status(403).json({ message: `Email invalide !` });
  }

  //Exemple regex: const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/;

  // Validation du mot de passe
  if (!password || password.length <= 4) {
    return res
      .status(403)
      .json({ message: `Le mot de passe doit contenir au moins 5 caractères` });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role || "user";
  // Vérification de l'existence de l'email dans la base de données
  if (result.result >= 1) {
    return res.status(403).json({
      message: `Email déjà existant`,
    });
  } else {
    // Création de l'utilisateur dans la base de données
    const response = await UserDB.signUp(
      surname.trim(),
      email,
      hashedPassword,
      userRole,
    );
    const responseError = response.error;
    console.log(response);
    if (responseError) {
      return res.status(500).json({ message: responseError });
    }

    const userId = response.result.insertId;
    return res.status(200).json({ message: "Utilisateur créé", user: userId });
  }
};

const updateUser = async (req, res) => {
  // Extraction des données de la requête
  const { user } = req.body;

  const payload = user || req.body;
  const surname = payload.surname;
  const email = payload.email;
  const password = payload.password;
  const role = payload.role || "user";
  const userId = req.body.userId || payload.userId;

  if (!surname || typeof surname !== "string" || surname.trim().length < 2) {
    return res
      .status(403)
      .json({ message: "Le surname doit contenir au moins 2 caractères" });
  }

  // Validation de l'email
  if (!email || !isEmail(email)) {
    return res.status(403).json({ message: `Email invalide !` });
  }

  // Validation du mot de passe
  if (!password || password.length <= 4) {
    return res
      .status(403)
      .json({ message: `Le mot de passe doit contenir au moins 5 caractères` });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création de l'utilisateur dans la base de données
  const response = await UserDB.updateUser(
    surname.trim(),
    email,
    hashedPassword,
    role,
    userId,
  );
  const responseError = response.error;
  console.log(response);
  if (responseError) {
    return res.status(500).json({ message: responseError });
  }

  return res.status(200).json({ message: "Utilisateur modifié" });
};

// Exportation de l'objet contenant toutes les fonctions du contrôleur des utilisateurs
export const UserController = {
  signUp,
  read,
  readOneUser,
  signIn,
  updateUser,
};