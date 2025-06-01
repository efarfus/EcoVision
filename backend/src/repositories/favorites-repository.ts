import { PrismaClient, Favorite } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export class FavoriteRepository {
  async createFavorite(userId: string, latitude: number, longitude: number, uri: string): Promise<Favorite> {
    return prisma.favorite.create({
      data: {
        userId,
        latitude,
        longitude,
        uri,
      },
    });
  }

  async getFavoriteById(id: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: { id },
    });
  }

  async getFavoriteByUserId(userId: string): Promise<Favorite[] | null> {
    return prisma.favorite.findMany({
      where: { userId },
    });
  }

  async deleteFavorite(id: string): Promise<Favorite | null> {
    return prisma.favorite.delete({
      where: { id },
    });
  }
}
