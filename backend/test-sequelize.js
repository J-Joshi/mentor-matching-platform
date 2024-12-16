import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mentormatchingdb", "root", "Jatin@2003", {
  host: "127.0.0.1",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to MySQL successfully!");
  } catch (err) {
    console.error("Sequelize connection failed:", err.message);
  } finally {
    await sequelize.close();
  }
})();
