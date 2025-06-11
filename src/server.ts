import './config/loadEnv'; // Loads dotenv correctly so can be used elsewhere without importing
import express from 'express';
import cors from 'cors';
import pool from './config/db';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Routes
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`DB connected ${result.rows[0].now}`);
    } catch (error) {
        console.error('DB connection error:', error);
        res.status(500).send(`DB connection failed: ${error}`);
    }
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Backend Server listening on port ${PORT}`);
});
