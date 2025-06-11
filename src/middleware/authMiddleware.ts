import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request object so we can safely attach a `user` property after verifying the token
export interface AuthenticatedRequest extends Request {
    user?: { id: number; username: string };
}

// Middleware to protect routes by verifying JWT token
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Get the Authorization header (should be in format "Bearer <token>")
    const authHeader = req.headers.authorization;

    // If the header is missing or doesn't start with "Bearer ", reject the request
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid token' });
        return;
    }

    // Extract just the token (remove the "Bearer " part)
    const token = authHeader.split(' ')[1];

    // Get secret key from environment (used to decode the token)
    const jwtSecret = process.env.JWT_SECRET;

    // If secret isn't set in environment variables, return error
    if (!jwtSecret) {
        res.status(500).json({ message: 'JWT secret not set' });
        return;
    }

    try {
        // Verify and decode the token using the secret
        const decoded = jwt.verify(token, jwtSecret) as {
            id: number;
            username: string;
        };

        // Attach the decoded user info to the request (now available in any protected route)
        (req as AuthenticatedRequest).user = decoded;

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // If token is invalid or expired, reject the request
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
