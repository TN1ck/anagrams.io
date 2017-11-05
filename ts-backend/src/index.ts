import 'source-map-support/register';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import TestRoutes from './routes/TestRoutes';
import AnagramRoutes from './routes/AnagramRoutes';

const PORT: number = parseInt(process.env.PORT, 10) || 3000;

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  public middleware(): void {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
  }

  public routes(): void {
    this.app.use(TestRoutes);
    this.app.use(AnagramRoutes);
  }
}

const server = new Server();
server.app.listen(PORT, () => {
  console.log(`Server is running on port "${PORT}".`);
});