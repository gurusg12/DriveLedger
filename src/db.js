import Database from "better-sqlite3";

// Opens existing database or creates a new one
const db = new Database("./database.db");

console.log("✅ Connected to SQLite");


const users = db.prepare("SELECT * FROM users").all();
console.log("✅ Users table is ready");

export default db;