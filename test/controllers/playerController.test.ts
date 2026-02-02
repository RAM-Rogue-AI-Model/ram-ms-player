import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlayerController } from '../../src/controllers/playerController';
import { PlayerService } from '../../src/services/playerService';

vi.mock('../../src/services/playerService');

describe('PlayerController', () => {
  let playerController: PlayerController;
  let mockService: PlayerService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = new PlayerService();
    playerController = new PlayerController(mockService);
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    } as unknown as Response;
  });

  it('should create a player successfully', async () => {
    mockReq.body = {
      name: 'Test',
      pv: 100,
      attack: 10,
      speed: 10,
      level: 1,
      user_id: 'u1',
    };
    const mockPlayer = { id: '1', ...mockReq.body };
    vi.mocked(mockService.create).mockResolvedValue(mockPlayer);

    await playerController.create(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockPlayer);
  });

  it('should return 400 if required fields are missing on create', async () => {
    mockReq.body = { name: 'Test' }; // Missing others

    await playerController.create(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Missing required fields',
    });
  });

  it('should get all players', async () => {
    mockReq.query = {};
    vi.mocked(mockService.list).mockResolvedValue([]);

    await playerController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.list).toHaveBeenCalledWith(undefined);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  it('should get players by user_id query param', async () => {
    mockReq.query = { user_id: 'u1' };
    vi.mocked(mockService.list).mockResolvedValue([]);

    await playerController.getAll(mockReq as Request, mockRes as Response);

    expect(mockService.list).toHaveBeenCalledWith('u1');
  });

  it('should get player by id', async () => {
    mockReq.params = { id: '1' };
    const mockPlayer = {
      id: '1',
      name: 'Test',
      pv: 100,
      attack: 10,
      speed: 10,
      level: 1,
      user_id: 'u1',
    };
    vi.mocked(mockService.getById).mockResolvedValue(mockPlayer);

    await playerController.getById(mockReq as Request, mockRes as Response);

    expect(mockService.getById).toHaveBeenCalledWith('1');
    expect(mockRes.json).toHaveBeenCalledWith(mockPlayer);
  });

  it('should return 404 if player not found by id', async () => {
    mockReq.params = { id: '1' };
    vi.mocked(mockService.getById).mockResolvedValue(null);

    await playerController.getById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
  });

  it('should return 400 if id is missing in getById', async () => {
    mockReq.params = {};
    await playerController.getById(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing player id' });
  });

  it('should update a player', async () => {
    mockReq.params = { id: '1' };
    mockReq.body = { name: 'Updated' };
    const mockPlayer = {
      id: '1',
      name: 'Updated',
      pv: 100,
      attack: 10,
      speed: 10,
      level: 1,
      user_id: 'u1',
    };

    vi.mocked(mockService.getById).mockResolvedValue(mockPlayer);
    vi.mocked(mockService.update).mockResolvedValue(mockPlayer);

    await playerController.update(mockReq as Request, mockRes as Response);

    expect(mockService.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(mockRes.json).toHaveBeenCalledWith(mockPlayer);
  });

  it('should return 404 when updating non-existent player', async () => {
    mockReq.params = { id: '1' };
    vi.mocked(mockService.getById).mockResolvedValue(null);

    await playerController.update(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it('should return 400 if id is missing in update', async () => {
    mockReq.params = {};
    await playerController.update(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should delete a player', async () => {
    mockReq.params = { id: '1' };
    const mockPlayer = {
      id: '1',
      name: 'Deleted',
      pv: 100,
      attack: 10,
      speed: 10,
      level: 1,
      user_id: 'u1',
    };
    vi.mocked(mockService.getById).mockResolvedValue(mockPlayer);

    await playerController.delete(mockReq as Request, mockRes as Response);

    expect(mockService.delete).toHaveBeenCalledWith('1');
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('should return 404 when deleting non-existent player', async () => {
    mockReq.params = { id: '1' };
    vi.mocked(mockService.getById).mockResolvedValue(null);

    await playerController.delete(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it('should return 400 if id is missing in delete', async () => {
    mockReq.params = {};
    await playerController.delete(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
