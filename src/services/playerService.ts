import { CreatePlayerInput } from '../types/playerInput';
import { prisma } from '../utils/mariaConnection';
import { sendLog } from '../utils/message';

class PlayerService {
  async create(data: CreatePlayerInput) {
    try {
      const result = await prisma.player.create({ data });
      void sendLog('PLAYER', 'INSERT', 'INFO', `Player ${result.id} créé`);
      return result;
    } catch (err) {
      console.error(err);
      void sendLog(
        'PLAYER',
        'INSERT',
        'ERROR',
        `Échec de la création du player`
      );
      return null;
    }
  }

  async list(user_id?: string) {
    try {
      if (user_id) {
        const result = await prisma.player.findMany({
          where: {
            user_id: user_id,
          },
        });
        void sendLog(
          'PLAYER',
          'OTHER',
          'INFO',
          `Liste des players pour l'utilisateur ${user_id} récupérée`
        );
        return result;
      }
      const result = await prisma.player.findMany();
      void sendLog(
        'PLAYER',
        'OTHER',
        'INFO',
        `Liste de tous les players récupérée`
      );
      return result;
    } catch (err) {
      console.error(err);
      void sendLog(
        'PLAYER',
        'OTHER',
        'ERROR',
        `Échec de la récupération des players`
      );
    }
  }

  async getById(id: string) {
    try {
      const result = await prisma.player.findUnique({
        where: {
          id: id,
        },
      });
      void sendLog('PLAYER', 'OTHER', 'INFO', `Player ${id} récupéré`);
      return result;
    } catch (err) {
      console.error(err);
      void sendLog(
        'PLAYER',
        'OTHER',
        'ERROR',
        `Échec de la récupération du player`
      );
      return;
    }
  }

  async update(id: string, data: Partial<CreatePlayerInput>) {
    try {
      const existingPlayer = await this.getById(id);
      if (!existingPlayer) {
        void sendLog(
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
      void sendLog('PLAYER', 'UPDATE', 'INFO', `Player ${id} mis à jour`);
      return result;
    } catch (err) {
      console.error(err);
      void sendLog(
        'PLAYER',
        'UPDATE',
        'ERROR',
        `Échec de la mise à jour du player ${id}`
      );
      return null;
    }
  }

  async delete(id: string) {
    try {
      const existingPlayer = await this.getById(id);
      if (!existingPlayer) {
        void sendLog(
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
      return result;
    } catch (err) {
      console.error(err);
      void sendLog(
        'PLAYER',
        'REMOVE',
        'ERROR',
        `Échec de la suppression du player ${id}`
      );
      return null;
    }
  }
}

export { PlayerService };
