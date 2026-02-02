// src/controllers/authController.js
import bcrypt from 'bcrypt';
import { openDB } from '#config/db.js';

// 1. REGISTER Logic
export const register = async (req, res) => {
    const { username, email, password }=req.body; // Request Body

    // Checking whether all fields are present
    if(!username || !email || !password) {
        return res.status(400).json({error: "All fields are required"});
    }

    let db;
    try {
        // OPen the database
        db=await openDB();

        // Check whether there is a same name or same email already registered
        const existingUser=await db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if(existingUser) {
            return res.status(400).json({ error: "User already exists"});
        }
        
        // Hash the password
        const hashedPassword=await bcrypt.hash(password, 10);

        // Insert the new registration in 
        await db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );

        res.json({ message: "Registration successful! Please login."});
    } catch (error) {
        console.error(" Register Error: ", error);
        res.status(500).json({ error: "Server error during registration"});
    } finally {
        if(db) await db.close();
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Check whether email and password fields are present
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    let db;

    try {
        // Open the database
        db=await openDB();

        const user=await db.get(`SELECT * FROM users WHERE email=?`, [email]);

        if(!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        const isMatch=await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ error: "Invalid email or password"});
        }


        req.session.userId = user.id;
        req.session.username=user.username;

        res.json({ message: 'Login Successful', username: user.username});
    } catch (error) {
        console.log("Login error: ", error);
        res.status(500).json({ error: "Server error during login"});
    } finally {
        if(db) await db.close();
    }
};

// LOGOUT
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.clearCookie('connect.sid'); // explicitly clear cookie
        res.json({ message: "Logged out successfully" });
    });
};