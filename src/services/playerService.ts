import { CreatePlayerInput } from '../types/playerInput';
import { prisma } from '../utils/mariaConnection';

class PlayerService {
  async create(data: CreatePlayerInput) {
    return prisma.player.create({ data });
  }

  async list(user_id?: string) {
    if (user_id) {
      return prisma.player.findMany({
        where: {
          user_id: user_id,
        },
      });
    }
    return prisma.player.findMany();
  }

  async getById(id: string) {
    return prisma.player.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: Partial<CreatePlayerInput>) {
    return prisma.player.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async delete(id: string) {
    return prisma.player.delete({
      where: {
        id: id,
      },
    });
  }
}

export { PlayerService };
