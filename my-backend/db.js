import { createConnection } from "mysql2";

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

// Create MySQL connection
const db = createConnection({
  host: DB_HOST,
  user: DB_USER, // replace with your MySQL username
  password: DB_PASS, // replace with your MySQL password
  database: DB_NAME, // replace with your database name
});

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

export default db;
