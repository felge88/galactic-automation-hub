import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getModules = async (req: AuthRequest, res: Response) => {
  try {
    const modules = await prisma.module.findMany({ where: { userId: req.user!.userId } });
    res.json(modules);
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const startStopSchema = z.object({ enabled: z.boolean() });

export const startStopModule = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { enabled } = startStopSchema.parse(req.body);
    const module = await prisma.module.update({ where: { id, userId: req.user!.userId }, data: { enabled } });
    res.json(module);
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const settingsSchema = z.object({ settings: z.record(z.any()) });

export const updateModuleSettings = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { settings } = settingsSchema.parse(req.body);
    const module = await prisma.module.update({ where: { id, userId: req.user!.userId }, data: { settings } });
    res.json(module);
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
}; 