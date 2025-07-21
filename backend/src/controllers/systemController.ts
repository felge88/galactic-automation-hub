import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let maintenanceMode = false; // Optional: In DB speichern

export const getStatus = async (_req: Request, res: Response) => {
  try {
    // Beispiel: Systemstatus, Wartungsmodus, User-/Module-Statistiken
    res.json({ status: 'ok', maintenance: maintenanceMode });
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
};

export const setMaintenance = async (req: Request, res: Response) => {
  try {
    maintenanceMode = !!req.body.maintenance;
    res.json({ maintenance: maintenanceMode });
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
};

export const getLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.log.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    res.json(logs);
  } catch {
    res.status(500).json({ error: 'Serverfehler' });
  }
}; 