import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });

        return;
    }

    try {
        // Check if user exists
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userCheck.rows.length > 0) {
            res.status(409).json({ message: 'User already exists' });

            return;
        }

        // Has the password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into DB
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, 3$) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        // Return success
        const newUser = result.rows[0];
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }

    // res.status(201).json({ message: 'User registered' });
};

export const loginUser = async (req: Request, res: Response) => {
    // check user, compare password, return JWT

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error('JWT_SECRET is missing from the environment variables!');
        res.status(500).json({
            message: 'JWT_SECRET is missing from environment.',
        });

        return;
    }

    //Test user
    const userPlaceholder = { id: 1, username: 'bob' };

    const token = jwt.sign(userPlaceholder, jwtSecret, {
        expiresIn: '60d',
    });
    res.status(200).json({ message: 'User logged in', token: token });
};
