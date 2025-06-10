import { Request, Response } from 'express';

export const getFavorites = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Get favorites placeholder' });
};

export const saveFavorite = async (req: Request, res: Response) => {
    res.status(201).json({ message: 'Saved favorite placeholder' });
};

export const deleteFavorite = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Deleted favorite placeholder' });
};
