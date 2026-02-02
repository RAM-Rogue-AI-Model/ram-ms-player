import { Request, Response } from 'express';

import { PlayerService } from '../services/playerService';
import { CreatePlayerInput } from '../types/playerInput';

class PlayerController {
  service: PlayerService;

  constructor(service: PlayerService) {
    this.service = service;
  }

  async create(req: Request, res: Response) {
    try {
      const body = req.body as Partial<CreatePlayerInput>;
      if (
        !body.name ||
        body.pv === undefined ||
        body.attack === undefined ||
        body.speed === undefined ||
        !body.user_id
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const payload: CreatePlayerInput = body as CreatePlayerInput;
      const player = await this.service.create(payload);
      res.status(201).json(player);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create player' });
    }
  }

  async getAll(req: Request, res: Response) {
    const user_id = req.query.user_id as string | undefined;
    const players = await this.service.list(user_id);
    res.json(players);
  }

  async getById(req: Request, res: Response) {
    const id: string = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing player id' });
    }
    const player = await this.service.getById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  }

  async update(req: Request, res: Response) {
    const id: string = req.params.id as string;
    const body = req.body as Partial<CreatePlayerInput>;
    if (!id) {
      return res.status(400).json({ error: 'Missing player id' });
    }
    const playerExists = await this.service.getById(id);
    if (!playerExists) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const updatedPlayer = await this.service.update(id, body);
    res.json(updatedPlayer);
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing player id' });
    }
    const playerExists = await this.service.getById(id);
    if (!playerExists) {
      return res.status(404).json({ error: 'Player not found' });
    }
    await this.service.delete(id);
    res.status(204).send();
  }
}

export { PlayerController };
