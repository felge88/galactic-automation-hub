import { Request, Response } from 'express';
import * as instagramService from '../services/instagramService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addAccount = async (req: AuthRequest, res: Response) => {
  try {
    const result = await instagramService.addAccount(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const result = await instagramService.getStats(req.user!.userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const result = await instagramService.getPosts(req.user!.userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
};

export const generateContent = async (req: AuthRequest, res: Response) => {
  try {
    const result = await instagramService.generateContent(req.user!.userId, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
};

export const updateProxy = async (req: AuthRequest, res: Response) => {
  try {
    const result = await instagramService.updateProxy(req.user!.userId, req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
}; 