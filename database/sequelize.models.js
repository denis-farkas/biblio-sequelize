import { DataTypes } from "sequelize";
import sequelize from "./db.provider.js";

const Book = sequelize.define(
  "Book",
  {
    id_books: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  },
);

const Genre = sequelize.define(
  "Genre",
  {
    id_genre: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    genre_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "genre",
    timestamps: false,
  },
);

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "user",
    timestamps: false,
  },
);

const Comment = sequelize.define(
  "Comment",
  {
    id_comment: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    id_books: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "comment",
    timestamps: false,
  },
);

const Transit = sequelize.define(
  "Transit",
  {
    id_comment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "transit",
    timestamps: false,
  },
);

Book.belongsTo(Genre, { foreignKey: "genre", targetKey: "id_genre" });
Genre.hasMany(Book, { foreignKey: "genre", sourceKey: "id_genre" });

Comment.belongsTo(Book, { foreignKey: "id_books", targetKey: "id_books" });
Book.hasMany(Comment, { foreignKey: "id_books", sourceKey: "id_books" });

Comment.belongsToMany(User, {
  through: Transit,
  foreignKey: "id_comment",
  otherKey: "id_user",
});
User.belongsToMany(Comment, {
  through: Transit,
  foreignKey: "id_user",
  otherKey: "id_comment",
});

export { sequelize, Book, Genre, User, Comment, Transit };
