import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { RegisterUserInput, LoginUserInput } from '../types/authTypes';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as RegisterUserInput;

    // Validate required fields
    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required' });

        return;
    }

    try {
        // Check if username or email is already taken
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userCheck.rows.length > 0) {
            res.status(409).json({ message: 'User already exists' });

            return;
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into DB
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Return the newly created user info (excluding password)
        const newUser = result.rows[0];

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error(
                'JWT_SECRET is missing from the environment variables!'
            );
            res.status(500).json({ message: 'JWT_SECRET not configured' });

            return;
        }

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, // payload
            jwtSecret,
            { expiresIn: '60d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user and return JWT
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginUserInput;

    // Validate input
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });

        return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    // Check if secret is available
    if (!jwtSecret) {
        console.error('JWT_SECRET is missing from the environment variables!');
        res.status(500).json({
            message: 'JWT_SECRET is missing from environment.',
        });

        return;
    }

    //Test user
    // const userPlaceholder = { id: 1, username: 'bob' };

    try {
        // Look up user by email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        // If user doesn't exist, return error
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });

            return;
        }

        // Compare submitted password with hashed password in DB
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: 'Invalid email or password' });
        }

        // If passwords match, create a JWT token for authentication
        const token = jwt.sign(
            { id: user.id, email: user.email }, // payload
            jwtSecret, // secret
            { expiresIn: '60d' } // token expiry
        );

        // Return the token
        res.status(200).json({ message: 'User logged in', token: token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
