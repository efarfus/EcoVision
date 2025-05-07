import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export class UserRepository {
  async createUser(email: string, password: string, name: string): Promise<User> {
    return prisma.user.create({
      data: {
        email,
        password,
        name
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }
}
