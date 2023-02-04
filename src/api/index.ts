import express from 'express';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { getBearerToken } from '../lib/auth';
import { HttpStatusCode } from '../lib/http';

export default function apiController() {
  const api = express();

  api.get('/tasks', async (req, res, next) => {
    const accessToken = getBearerToken(req);

    if (!accessToken) {
      res.status(HttpStatusCode.Unauthorized).json({
        status: HttpStatusCode.Unauthorized,
        code: 'UNAUTHORIZED',
      });
      next();
      return;
    }

    try {
      const api = new TodoistApi(accessToken);
      const tasks = await api.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error get tasks', error);
      if (error['httpStatusCode'] && error['responseData']) {
        res.status(error['httpStatusCode']).json({
          status: error['httpStatusCode'],
          message: error['responseData'],
        });
      }

      res.status(500).send();
    }
  });

  return api;
}
