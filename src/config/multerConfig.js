// src/config/multerConfig.js
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import the ID generator
import { fileURLToPath } from 'url';

// 1. Setup Path Helpers (Again, for safety)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Configure Storage (Where & How to save)
const storage = multer.diskStorage({
    // A. Destination: Where does the file go?
    destination: (req, file, cb) => {
        // We point to the 'uploads' folder we created earlier
        // null means "no error"
        cb(null, path.join(__dirname, '../../uploads'));
    },

    // B. Filename: What do we call it?
    filename: (req, file, cb) => {
        // Problem: If two users upload "me.jpg", one gets deleted.
        // Solution: Generate a random ID (e.g., "a1b2-c3d4")
        
        const uniqueName = uuidv4(); 
        const extension = path.extname(file.originalname); // Extract ".jpg" or ".pdf"
        
        // Final name: "a1b2-c3d4.jpg"
        cb(null, uniqueName + extension); 
    }
});

// 3. Create the Middleware
const upload = multer({ storage: storage });

export default upload;