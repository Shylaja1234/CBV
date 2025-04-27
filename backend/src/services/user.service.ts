import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) => {
  return prisma.user.create({
    data: {
      ...userData,
      role: userData.role || 'USER',
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
}; 