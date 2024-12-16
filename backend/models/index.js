import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../config/config.json"))
)[env];

const db = {};

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Authenticate Database Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to the database:", err));

// Dynamically Load Models
const loadModels = async () => {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  });

  for (const file of files) {
    try {
      const filePath = pathToFileURL(path.join(__dirname, file)).href;

      const { default: model } = await import(filePath);

      if (typeof model !== "function") {
        throw new Error(`${file} does not export a default function`);
      }

      const initializedModel = model(sequelize, Sequelize.DataTypes);
      db[initializedModel.name] = initializedModel;

      console.log(`Initialized model: ${initializedModel.name}`);
    } catch (err) {
      console.error(`Error loading model from ${file}:`, err.message);
      throw err;
    }
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
      console.log(`Associated model: ${modelName}`);
    }
  });
};

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
