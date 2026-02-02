import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { PlayerController } from './controllers/playerController';
import { PlayerRouter } from './routes/playerRouter';
import { PlayerService } from './services/playerService';
import { config } from './utils/config';

const app = express();
const port = config.PORT;

app.use(
  cors({
    origin: [config.API_GATEWAY_URL],
    credentials: true,
  })
);

app.use(express.json());

const playerService = new PlayerService();
const playerController = new PlayerController(playerService);
app.use('/player', new PlayerRouter(playerController).router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
