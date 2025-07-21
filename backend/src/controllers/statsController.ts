import { Request, Response } from 'express';
import * as statsService from '../services/statsService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getModuleStats = async (req: AuthRequest, res: Response) => {
  try {
    const { module } = req.params;
    const from = req.query.from as string as string;
    const to = req.query.to as string as string;
    const filter = req.query.filter as string as string;
    const result = await statsService.getModuleStats(req.user!.userId, module, { from, to, filter });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Serverfehler' });
  }
}; 