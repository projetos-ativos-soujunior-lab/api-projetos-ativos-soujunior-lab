import cors from 'cors';
import express, { type Request, type Response } from 'express';
import type HttpServer from './HttpServer';

export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(cors());
  }

  on = (method: string, path: string, callback: any): void => {
    this.app[method](path, async (req: Request, res: Response) => {
      try {
        const result = await callback(req, res);
        res.status(200).json(result);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'internal server error' });
      }
    });
  };

  listen = (port: number): void => {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  };
}
