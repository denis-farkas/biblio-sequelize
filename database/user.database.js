import { User } from "./sequelize.models.js";

const emailExist = async (email) => {
  const count = await User.count({ where: { email } });
  return { result: count };
};

const signUp = async (surname, email, hashedPassword, role) => {
  let error = null;
  let result = null;

  try {
    const created = await User.create({
      surname,
      email,
      password: hashedPassword,
      role,
    });

    result = {
      insertId: created.id_user,
      affectedRows: 1,
    };
  } catch (e) {
    error = e.message;
  } finally {
    return { error, result };
  }
};

const read = async () => {
  let error = null;
  let result = null;

  try {
    result = await User.findAll({
      attributes: ["id_user", "surname", "email", "role"],
      order: [["surname", "DESC"]],
      raw: true,
    });
  } catch (e) {
    error = e.message;
  } finally {
    return { error, result };
  }
};

const readOneUser = async (id) => {
  let error = null;
  let result = null;

  try {
    const row = await User.findByPk(id, {
      attributes: ["surname", "email", "role"],
      raw: true,
    });
    result = row ? [row] : [];
  } catch (e) {
    error = e.message;
  } finally {
    return { error, result };
  }
};

const signIn = async (email) => {
  let error = null;
  let result = null;

  try {
    const row = await User.findOne({
      where: { email },
      attributes: ["id_user", "email", "password", "surname", "role"],
      raw: true,
    });
    result = row ? [row] : [];
  } catch (e) {
    error = e.message;
  } finally {
    return { error, result };
  }
};

const updateUser = async (surname, email, hashedPassword, role, userId) => {
  let error = null;
  let result = null;

  try {
    const [affectedRows] = await User.update(
      {
        surname,
        email,
        password: hashedPassword,
        role,
      },
      {
        where: { id_user: userId },
      },
    );

    result = { affectedRows };
  } catch (e) {
    error = e.message;
  } finally {
    return { error, result };
  }
};

export const UserDB = {
  emailExist,
  signUp,
  read,
  readOneUser,
  signIn,
  updateUser,
};
