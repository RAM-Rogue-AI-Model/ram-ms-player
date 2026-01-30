import 'dotenv/config';

import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import { PlayerController } from './controllers/playerController';
import { PlayerRouter } from './routes/playerRouter';
import { PlayerService } from './services/playerService';

(() => {
  dotenv.config();

  const app = express();
  const port = process.env.PORT ?? 3008;

  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

  const playerService = new PlayerService();
  const playerController = new PlayerController(playerService);

  app.use('/player', new PlayerRouter(playerController).router);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });
})();
