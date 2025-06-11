import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    getFavorites,
    saveFavorite,
    deleteFavorite,
} from '../controller/userController';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(authenticateToken);

router.get('/favorites', getFavorites);
router.post('/favorites', saveFavorite);
router.delete('/favorites/:id', deleteFavorite);

export default router;
