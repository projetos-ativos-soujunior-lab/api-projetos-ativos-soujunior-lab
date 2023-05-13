import 'dotenv/config';
import express from 'express';
import routes from './routes';

const app = express();

app.use('/api/v1', routes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
