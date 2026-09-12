const Database = require("better-sqlite3");
const db = new Database("pumzikatz.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        price_per_night INTEGER NOT NULL,
        description TEXT,
        image_url TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER NOT NULL,
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        check_in TEXT NOT NULL,
        check_out TEXT NOT NULL,
        total_price INTEGER NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        FOREIGN KEY (listing_id) REFERENCES listings(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    )
`);

module.exports = db;