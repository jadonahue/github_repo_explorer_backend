import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import pool from '../config/db';

// Get all favorite repos for the logged-in user
export const getFavorites = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        // Get user ID from the decoded token (added in middleware)
        const userId = req.user?.id;

        // Query DB for favorites that belong to this user
        const result = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1',
            [userId]
        );

        // Return favorite repos
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error fetching favorites' });
    }
};

// Save a new favorite repo to the database
export const saveFavorite = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;

    // Destructure repo data from the request body
    const { repo_id, repo_name, description, stars, language, html_url } =
        req.body;

    // Validate required fields
    if (!repo_id || !repo_name || !html_url) {
        res.status(400).json({
            message: 'repo_id, repo_name, and html_url are required',
        });

        return;
    }

    try {
        // Check if the repo is already favorited by this user
        const check = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND repo_id = $2',
            [userId, repo_id]
        );

        if (check.rows.length > 0) {
            res.status(409).json({ message: 'Repo already in favorites' });

            return;
        }

        // Insert new favorite into the database
        const result = await pool.query(
            `INSERT INTO favorites 
            (user_id, repo_id, repo_name, description, stars, language, html_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [userId, repo_id, repo_name, description, stars, language, html_url]
        );

        // Return the saved repo
        res.status(201).json({
            message: 'Favorite saved',
            favorite: result.rows[0],
        });
    } catch (error) {
        console.error('Error saving favorite:', error);
        res.status(500).json({ message: 'Server error saving favorite' });
    }
};

// Delete a favorite repo (placeholder for now)
export const deleteFavorite = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;
    const favoriteId = req.params.id;

    try {
        // Check if the favorite exists and belongs to this user
        const check = await pool.query(
            'SELECT * FROM favorites WHERE id = $1 AND user_id = $2',
            [favoriteId, userId]
        );

        if (check.rows.length === 0) {
            res.status(404).json({
                message: 'Favorite not found or unauthorized',
            });

            return;
        }

        // Delete the favorite
        await pool.query('DELETE FROM favorites WHERE id = $1', [favoriteId]);

        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ message: 'Server error deleting favorite' });
    }
};
