import { Request, Response } from 'express';
import { PrismaClient, Role, Rank } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        username: true,
        email: true, 
        name: true, 
        role: true, 
        rank: true, 
        image: true,
        createdAt: true, 
        updatedAt: true 
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ 
      select: { 
        id: true, 
        username: true,
        email: true, 
        name: true, 
        role: true, 
        rank: true, 
        createdAt: true, 
        updatedAt: true 
      } 
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.nativeEnum(Role).optional(),
  rank: z.nativeEnum(Rank).optional()
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, role, rank } = createUserSchema.parse(req.body);
    
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return res.status(409).json({ error: 'Username bereits vergeben' });
    
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return res.status(409).json({ error: 'E-Mail bereits registriert' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { username, email, password: hash, name, role, rank } 
    });
    res.status(201).json({ 
      id: user.id, 
      username: user.username,
      email: user.email, 
      name: user.name, 
      role: user.role, 
      rank: user.rank 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role).optional(),
  rank: z.nativeEnum(Rank).optional()
});

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = updateUserSchema.parse(req.body);
    
    // Check for conflicts if username or email is being updated
    if (data.username) {
      const existingUsername = await prisma.user.findFirst({ 
        where: { username: data.username, NOT: { id } } 
      });
      if (existingUsername) return res.status(409).json({ error: 'Username bereits vergeben' });
    }
    
    if (data.email) {
      const existingEmail = await prisma.user.findFirst({ 
        where: { email: data.email, NOT: { id } } 
      });
      if (existingEmail) return res.status(409).json({ error: 'E-Mail bereits vergeben' });
    }
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = await prisma.user.update({ where: { id }, data });
    res.json({ 
      id: user.id, 
      username: user.username,
      email: user.email, 
      name: user.name, 
      role: user.role, 
      rank: user.rank 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
}; 