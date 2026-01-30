import express, { Router } from 'express';

import { PlayerController } from '../controllers/playerController';
import { authenticate } from '../utils/auth';

class PlayerRouter {
  public router: Router;

  constructor(playerController: PlayerController) {
    this.router = express.Router();

    this.router
      .route('/')
      .post(authenticate, async (req, res) => {
        await playerController.create(req, res);
      })
      .get(authenticate, async (req, res) => {
        await playerController.getAll(req, res);
      });

    this.router
      .route('/:id')
      .get(authenticate, async (req, res) => {
        await playerController.getById(req, res);
      })
      .put(authenticate, async (req, res) => {
        await playerController.update(req, res);
      })
      .delete(authenticate, async (req, res) => {
        await playerController.delete(req, res);
      });
  }
}

export { PlayerRouter };
