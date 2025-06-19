import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import pool from '../config/db';
import axios from 'axios';

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

// Delete a favorite repo
export const deleteFavorite = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.user?.id;
    const repoId = req.params.id;

    try {
        // Check if the favorite exists with matching user_id and repo_id
        const check = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND repo_id = $2',
            [userId, repoId]
        );

        if (check.rows.length === 0) {
            res.status(404).json({
                message: 'Favorite not found or unauthorized',
            });

            return;
        }

        // Delete the favorite by user_id and repo_id
        await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND repo_id = $2',
            [userId, repoId]
        );

        res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ message: 'Server error deleting favorite' });
    }
};

// Search GitHub repos by username
export const searchRepo = async (req: AuthenticatedRequest, res: Response) => {
    const username = req.query.username as string;

    if (!username) {
        res.status(400).json({ message: 'Username is required' });

        return;
    }

    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}/repos`
        );

        const repos = response.data.map((repo: any) => ({
            repo_id: repo.id,
            repo_name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            html_url: repo.html_url,
        }));

        res.status(200).json(repos);
    } catch (error: any) {
        console.error('GitHub API error:', error.message);
        res.status(500).json({ message: 'Failed to fetch GitHub repos' });
    }
};
