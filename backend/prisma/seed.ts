import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin User erstellen
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admiral Skywalker',
      language: 'de',
      role: 'ADMIN',
      rank: 'ELITE'
    }
  });

  // Test User erstellen
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@example.com',
      password: userPassword,
      name: 'Luke Skywalker',
      language: 'en',
      role: 'USER',
      rank: 'VIP'
    }
  });

  // Commander User erstellen
  const commanderPassword = await bcrypt.hash('commander123', 10);
  const commander = await prisma.user.upsert({
    where: { username: 'commander' },
    update: {},
    create: {
      username: 'commander',
      email: 'commander@example.com',
      password: commanderPassword,
      name: 'Commander Vader',
      language: 'de',
      role: 'ADMIRAL',
      rank: 'ELITE'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin: ${admin.username} (password: admin123) - ${admin.role}`);
  console.log(`👤 User: ${user.username} (password: user123) - ${user.role}`);
  console.log(`👤 Commander: ${commander.username} (password: commander123) - ${commander.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });