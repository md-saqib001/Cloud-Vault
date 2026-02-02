// src/scripts/checkDB.js
import { openDB } from '#config/db.js';

async function checkDB() {
    try {
        const db = await openDB();
        console.log("🔍 Scanning Database...\n");

        // 1. Check Users
        const users = await db.all('SELECT * FROM users');
        console.log(`👤 Users Table (${users.length}):`);
        if (users.length > 0) console.table(users);
        else console.log("   (Empty)\n");

        // 2. Check Folders
        const folders = await db.all('SELECT * FROM folders');
        console.log(`\n📂 Folders Table (${folders.length}):`);
        if (folders.length > 0) console.table(folders);
        else console.log("   (Empty)\n");

        // 3. Check Files
        const files = await db.all('SELECT * FROM files');
        console.log(`\n📄 Files Table (${files.length}):`);
        if (files.length > 0) console.table(files);
        else console.log("   (Empty)\n");

        await db.close();

    } catch (err) {
        console.error("❌ Error reading DB:", err);
    }
}

checkDB();