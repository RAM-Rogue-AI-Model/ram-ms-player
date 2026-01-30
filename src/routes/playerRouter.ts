import express, { Router } from 'express';

import { PlayerController } from '../controllers/playerController';

class PlayerRouter {
  public router: Router;

  constructor(playerController: PlayerController) {
    this.router = express.Router();

    this.router
      .route('/')
      .post(async (req, res) => {
        await playerController.create(req, res);
      })
      .get(async (req, res) => {
        await playerController.getAll(req, res);
      });

    this.router
      .route('/:id')
      .get(async (req, res) => {
        await playerController.getById(req, res);
      })
      .put(async (req, res) => {
        await playerController.update(req, res);
      })
      .delete(async (req, res) => {
        await playerController.delete(req, res);
      });
  }
}

export { PlayerRouter };
