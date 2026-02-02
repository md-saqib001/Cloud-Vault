import express from 'express';
import { register, login, logout } from '#controller/authController.js';

const router = express.Router();

// Define the actual URLs
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;