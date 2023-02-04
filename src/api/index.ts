import express from 'express';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { TodoistSyncApi } from '../lib/todoist-sync-api';
import { SnapshotController } from '../controllers/snapshot-controller';
import { todoistAccessToken } from '../middleware/todoist-access-token';

export default function apiController() {
  const api = express();

  // Gate authentication
  api.use(todoistAccessToken());

  api.get('/filter-snapshots', async (req, res) => {
    try {
      const accessToken = req.todoist_access_token;
      const controller = new SnapshotController(
        new TodoistApi(accessToken),
        new TodoistSyncApi(accessToken)
      );
      const response = await controller.getFilterSnapshot();

      res.status(200).send(response);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send();
      return;
    }
  });

  api.get('/tasks', async (req, res) => {
    try {
      const accessToken = req.todoist_access_token;
      const api = new TodoistApi(accessToken);
      const tasks = await api.getTasks();
      res.json(tasks);
    } catch (error) {
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
