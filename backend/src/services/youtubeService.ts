import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function downloadVideo(userId: number, data: any) {
  // Beispiel: Video-Download starten, API-Key aus DB holen
  const apiKey = await prisma.aPIKey.findFirst({ where: { userId, service: 'youtube' } });
  // Hier echte Logik einfügen
  return { success: true, info: 'Download gestartet (Logik einfügen)', apiKey: !!apiKey };
}

export async function getHistory(userId: number) {
  const apiKey = await prisma.aPIKey.findFirst({ where: { userId, service: 'youtube' } });
  // Hier echte Logik einfügen
  return { history: [], info: 'History geladen (Logik einfügen)', apiKey: !!apiKey };
} 