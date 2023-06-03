import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { Cron } from './infra/Cron';
import routes from './routes';

const app = express();

const task = (): void => {
  void fetch('http://127.0.0.1:5000/api/v1/projects');
};

const cronTime = process.env.CRON_SCHEDULE as string;

Cron.schedule(cronTime, task);

app.use(cors());

app.use('/api/v1', routes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
