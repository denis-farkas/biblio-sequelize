import sequelize from "./db.provider.js";
import "./sequelize.models.js";

const query = async (sql, values = []) => {
  const [result] = await sequelize.query(sql, { replacements: values });
  return result;
};

export const initDatabase = async () => {
  await sequelize.authenticate();
};

export default query;
