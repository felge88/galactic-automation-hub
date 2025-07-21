import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  language: z.string().optional()
});

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = profileSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user!.userId }, data });
    res.json({ id: user.id, email: user.email, name: user.name, image: user.image, language: user.language });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const passwordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = passwordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Altes Passwort falsch' });
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { password: hash } });
    res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const themeSchema = z.object({ theme: z.string() });

export const updateTheme = async (req: AuthRequest, res: Response) => {
  try {
    const { theme } = themeSchema.parse(req.body);
    // Optional: Theme in User-Tabelle speichern
    const user = await prisma.user.update({ where: { id: req.user!.userId }, data: { } });
    res.json({ success: true, theme });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
}; 