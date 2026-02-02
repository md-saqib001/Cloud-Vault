import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import upload from '#config/multerConfig.js';
import authRouter from '#routes/authRoutes.js';

// 1. Setup Path Helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const SQLiteSessionStore = SQLiteStore(session);

// 2. Middleware (The Gatekeepers)
app.use(express.json()); // Allow server to read JSON data
app.use(express.urlencoded({ extended: true })); // Allow server to read form data
app.use(express.static(path.join(__dirname, '../public'))); // Serve HTML files from 'public' folder



app.use(session({
    store: new SQLiteSessionStore({
        db: 'cloudvault.db',
        dir: './database' 
    }),
    secret: process.env.SESSION_SECRET, // 👈 3. Use Secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Secure only in Prod
    }
}));

// 3. Use Auth Routes for any /auth URL
app.use('/api/auth', authRouter);

// 4. Basic Test Route
app.get('/', (req, res) => {
    res.send("<h1>CloudVault Server is Running! 🌩️</h1>");
});

// 5. File Upload Route 📤
// 'upload.single' means "Expect exactly one file named 'testFile'"
app.post('/upload-test', upload.single('testFile'), (req, res) => {
    // If we reach here, Multer has already saved the file!
    
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    res.json({
        message: "File uploaded successfully!",
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        size: req.file.size
    });
});

// 6. Turn the Key 🔑
app.listen(PORT, () => {
    console.log(`✅ CloudVault is live at http://localhost:${PORT}`);
    console.log(`📂 Uploads folder should be at: ${path.join(__dirname, '../uploads')}`);
});