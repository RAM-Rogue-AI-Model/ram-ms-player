import express, { Router } from 'express';

import { PlayerController } from '../controllers/playerController';
import { authenticate, requestDetails } from '../utils/auth';

class PlayerRouter {
  public router: Router;

  constructor(playerController: PlayerController) {
    this.router = express.Router();

    this.router
      .route('/')
      .post(requestDetails, authenticate, async (req, res) => {
        await playerController.create(req, res);
      })
      .get(requestDetails, authenticate, async (req, res) => {
        await playerController.getAll(req, res);
      });

    this.router
      .route('/:id')
      .get(requestDetails, authenticate, async (req, res) => {
        await playerController.getById(req, res);
      })
      .put(requestDetails, authenticate, async (req, res) => {
        await playerController.update(req, res);
      })
      .delete(requestDetails, authenticate, async (req, res) => {
        await playerController.delete(req, res);
      });
  }
}

export { PlayerRouter };
