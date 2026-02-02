import { CreatePlayerInput } from '../types/playerInput';
import { prisma } from '../utils/mariaConnection';
import { sendLog } from '../utils/message';

class PlayerService {
  async create(data: CreatePlayerInput) {
    return prisma.player.create({ data });
  }

  async list(user_id?: string) {
    if (user_id) {
      let result = prisma.player.findMany({
        where: {
          user_id: user_id,
        },
      });
      sendLog(
        'PLAYER',
        'OTHER',
        'INFO',
        `Liste des players pour l'utilisateur ${user_id} récupérée`
      );
      return result;
    }
    let result = prisma.player.findMany();
    sendLog('PLAYER', 'OTHER', 'INFO', `Liste de tous les players récupérée`);
    return result;
  }

  async getById(id: string) {
    let result = prisma.player.findUnique({
      where: {
        id: id,
      },
    });
    sendLog('PLAYER', 'OTHER', 'INFO', `Player ${id} récupéré`);
    return result;
  }

  async update(id: string, data: Partial<CreatePlayerInput>) {
    let result = prisma.player.update({
      where: {
        id: id,
      },
      data: data,
    });
    sendLog('PLAYER', 'UPDATE', 'INFO', `Player ${id} mis à jour`);
    return result;
  }

  async delete(id: string) {
    let result = prisma.player.delete({
      where: {
        id: id,
      },
    });
    sendLog('PLAYER', 'REMOVE', 'INFO', `Player ${id} supprimé`);
    return result;
  }
}

export { PlayerService };
