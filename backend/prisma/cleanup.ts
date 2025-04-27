import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  try {
    // Delete all staff users (preserving admin)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: 'STAFF'
      }
    });

    console.log(`Deleted ${deletedUsers.count} staff users`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 