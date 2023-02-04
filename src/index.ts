import express from 'express';
import loadEnv from './env';
import { logRequests } from './middleware/logging';
import api from './api';

const env = loadEnv();
const app = express();

const port = env.APP_PORT; // default port to listen

// Logger
app.use(logRequests);

// API
app.use('/api', api());

// start the Express server
app.listen(port, () => {
  console.log(
    [
      '******************************',
      '       Server started',
      '',
      `   http://localhost:${port}`,
      '*******************************',
    ].join('\n')
  );
});
