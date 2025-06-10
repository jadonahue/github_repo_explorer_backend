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

// // Auth Routes
// app.post('/auth/register', async (req, res) => {
//     try {
//         console.log('test');
//         res.status(201).json({
//             message: 'User registration successful',
//         });
//     } catch (error) {
//         console.error('DB register connection error:', error);
//         res.status(500).json({
//             message: `DB register connection error: ${error}`,
//         });
//     }
// });

// app.post('/auth/login', async (req, res) => {
//     try {
//         console.log('User login successful');
//         res.status(201).json({
//             message: 'User login successful',
//         });
//     } catch (error) {
//         console.error('DB login connection error:', error);
//         res.status(500).json({
//             message: `DB login conncetion error: ${error}`,
//         });
//     }
// });

// // User Routes
// app.get('/user/favorites', async (req, res) => {
//     console.log('User favorites found');
//     try {
//         res.status(201).json({
//             message: 'DB user favorites found',
//         });
//     } catch (error) {
//         console.error('DB user favorites connection error:', error);
//         res.status(500).json({
//             message: `DB user favorites connection error: ${error}`,
//         });
//     }
// });
