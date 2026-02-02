import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This helper function opens the database and configures it
export const openDB = async () => {
    const db = await open({
        filename: path.join(__dirname, '../../database/cloudvault.db'),
        driver: sqlite3.Database
    });

    // CRITICAL: SQLite turns off foreign keys by default.
    // We must turn them ON so that if we delete a Folder, 
    // all files inside it are deleted automatically (Cascade).
    await db.exec('PRAGMA foreign_keys = ON;');

    return db;
};