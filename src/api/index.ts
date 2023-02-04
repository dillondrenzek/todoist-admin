import express from 'express';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { getBearerToken } from '../lib/auth';
import { HttpStatusCode } from '../lib/http';
import { TodoistSyncApi } from '../lib/todoist-sync-api';

export default function apiController() {
  const api = express();

  api.get('/filter-counts', async (req, res, next) => {
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
      const syncApi = new TodoistSyncApi(accessToken);

      const syncResponse = await syncApi.sync();

      const response = syncResponse.filters.map((filter) => {
        return {
          name: filter.name,
          query: filter.query,
          count: 0,
        };
      });

      res.status(200).send(response);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send();
      return;
    }
  });

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
