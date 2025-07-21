import { Request, Response } from 'express';
import * as youtubeService from '../services/youtubeService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const downloadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const result = await youtubeService.downloadVideo(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const result = await youtubeService.getHistory(req.user!.userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
}; 