import express from 'express';

import {
    getFavorites,
    saveFavorite,
    deleteFavorite,
} from '../controller/userController';

const router = express.Router();

router.get('/favorites', getFavorites);
router.post('/favorites', saveFavorite);
router.delete('/favorites/:id', deleteFavorite);

export default router;
