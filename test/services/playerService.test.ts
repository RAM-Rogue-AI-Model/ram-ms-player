import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import { PlayerService } from '../../src/services/playerService';
import { CreatePlayerInput } from '../../src/types/playerInput';
import { prisma } from '../../src/utils/mariaConnection';

vi.mock('../../src/utils/mariaConnection', () => ({
  prisma: mockDeep(),
}));

describe('PlayerService', () => {
  const playerService = new PlayerService();

  beforeEach(() => {
    mockReset(prisma);
  });

  const mockPlayer = {
    id: '123',
    name: 'Test Player',
    pv: 100,
    attack: 10,
    speed: 10,
    level: 1,
    user_id: 'user123',
  };

  it('should create a player', async () => {
    const input: CreatePlayerInput = {
      name: 'Test Player',
      pv: 100,
      attack: 10,
      speed: 10,
      level: 1,
      user_id: 'user123',
    };

    vi.mocked(prisma.player.create).mockResolvedValue(mockPlayer);

    const result = await playerService.create(input);

    expect(result).toEqual(mockPlayer);
    expect(prisma.player.create).toHaveBeenCalledWith({ data: input });
  });

  it('should list all players', async () => {
    vi.mocked(prisma.player.findMany).mockResolvedValue([mockPlayer]);

    const result = await playerService.list();

    expect(result).toEqual([mockPlayer]);
    expect(prisma.player.findMany).toHaveBeenCalled();
  });

  it('should list players by user_id', async () => {
    vi.mocked(prisma.player.findMany).mockResolvedValue([mockPlayer]);

    const result = await playerService.list('user123');

    expect(result).toEqual([mockPlayer]);
    expect(prisma.player.findMany).toHaveBeenCalledWith({
      where: { user_id: 'user123' },
    });
  });

  it('should get player by id', async () => {
    vi.mocked(prisma.player.findUnique).mockResolvedValue(mockPlayer);

    const result = await playerService.getById('123');

    expect(result).toEqual(mockPlayer);
    expect(prisma.player.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });
  it('should update a player', async () => {
    vi.mocked(prisma.player.update).mockResolvedValue(mockPlayer);

    const result = await playerService.update('123', { name: 'Updated Name' });

    expect(result).toEqual(mockPlayer);
    expect(prisma.player.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { name: 'Updated Name' },
    });
  });

  it('should delete a player', async () => {
    vi.mocked(prisma.player.delete).mockResolvedValue(mockPlayer);

    const result = await playerService.delete('123');

    expect(result).toEqual(mockPlayer);
    expect(prisma.player.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });
});
