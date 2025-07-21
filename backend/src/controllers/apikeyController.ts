import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const apiKeySchema = z.object({ key: z.string().min(10), service: z.string().min(2) });

export const createApiKey = async (req: AuthRequest, res: Response) => {
  try {
    const { key, service } = apiKeySchema.parse(req.body);
    const hash = await bcrypt.hash(key, 10);
    const apiKey = await prisma.aPIKey.create({ data: { key: hash, service, userId: req.user!.userId } });
    res.status(201).json({ id: apiKey.id, service: apiKey.service });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
}; 