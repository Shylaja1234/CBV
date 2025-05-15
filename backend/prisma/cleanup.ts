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
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 