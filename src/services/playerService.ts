import { CreatePlayerInput } from '../types/playerInput';
import { prisma } from '../utils/mariaConnection';
import { sendLog } from '../utils/message';

class PlayerService {
  async create(data: CreatePlayerInput) {
    const result = await prisma.player.create({ data });
    if (!result) {
      sendLog('PLAYER', 'INSERT', 'ERROR', `Échec de la création du player`);
      return null;
    }
    sendLog('PLAYER', 'INSERT', 'INFO', `Player ${result.id} créé`);
    return result;
  }

  async list(user_id?: string) {
    if (user_id) {
      const result = await prisma.player.findMany({
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
    const result = await prisma.player.findMany();
    sendLog('PLAYER', 'OTHER', 'INFO', `Liste de tous les players récupérée`);
    return result;
  }

  async getById(id: string) {
    const result = await prisma.player.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      sendLog('PLAYER', 'OTHER', 'WARN', `Player ${id} non trouvé`);
      return null;
    }
    sendLog('PLAYER', 'OTHER', 'INFO', `Player ${id} récupéré`);
    return result;
  }

  async update(id: string, data: Partial<CreatePlayerInput>) {
    const existingPlayer = await this.getById(id);
    if (!existingPlayer) {
      sendLog(
        'PLAYER',
        'UPDATE',
        'WARN',
        `Impossible de mettre à jour, player ${id} non trouvé`
      );
      return null;
    }
    const result = await prisma.player.update({
      where: {
        id: id,
      },
      data: data,
    });
    if (!result) {
      sendLog(
        'PLAYER',
        'UPDATE',
        'ERROR',
        `Échec de la mise à jour du player ${id}`
      );
      return null;
    }
    sendLog('PLAYER', 'UPDATE', 'INFO', `Player ${id} mis à jour`);
    return result;
  }

  async delete(id: string) {
    const existingPlayer = await this.getById(id);
    if (!existingPlayer) {
      sendLog(
        'PLAYER',
        'REMOVE',
        'WARN',
        `Impossible de supprimer, player ${id} non trouvé`
      );
      return null;
    }
    const result = await prisma.player.delete({
      where: {
        id: id,
      },
    });
    if (!result) {
      sendLog(
        'PLAYER',
        'REMOVE',
        'ERROR',
        `Échec de la suppression du player ${id}`
      );
      return null;
    }
    return result;
  }
}

export { PlayerService };
