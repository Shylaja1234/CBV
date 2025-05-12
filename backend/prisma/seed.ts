import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@connectingbee.in'
      }
    });

    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      const admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@connectingbee.in',
          password: hashedPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          isFirstLogin: false,
        },
      });

      console.log('Admin user created:', admin);
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 