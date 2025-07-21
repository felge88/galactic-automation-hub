import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username,
        email: user.email, 
        name: user.name, 
        role: user.role, 
        rank: user.rank 
      } 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Serverfehler' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name } = registerSchema.parse(req.body);
    
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return res.status(409).json({ error: 'Username bereits vergeben' });
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return res.status(409).json({ error: 'E-Mail bereits registriert' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { username, email, password: hash, name } 
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