import mysql from "mysql2/promise";

const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "Jatin@2003",
      database: "mentormatchingdb",
    });
    console.log("Connected to MySQL successfully!");
    await connection.end();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
};

testConnection();
