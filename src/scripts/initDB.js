import { openDB } from '#config/db.js';


async function initDB() {
    let db;

    try {
        db = await openDB();

        console.log("Connected to CloudVault DB.");

        // 1. Create Users Table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        // 2. Create Folders Table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS folders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                parent_id INTEGER, -- Can be NULL (Home) or another Folder ID
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
            );
        `);

        // 3. Create Files Table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid_name TEXT NOT NULL,      -- The random name on disk (91da...)
                original_name TEXT NOT NULL,  -- The human name (resume.pdf)
                size INTEGER NOT NULL,        -- Size in bytes
                mimetype TEXT,                -- Type (image/jpeg, application/pdf)
                user_id INTEGER NOT NULL,     -- Who owns it?
                folder_id INTEGER,            -- Which folder is it in? (NULL = Home)
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
            );
        `);

        console.log("✅ Tables Created: Users, Folders, Files.");
    } catch (err) {
        console.error("❌ Database Error:", err);
    } finally {
        if (db) {
            await db.close();
            console.log("Database connection closed.");
        }
    }
}

initDB();
