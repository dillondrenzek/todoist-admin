import express from 'express';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { TodoistSyncApi } from '../lib/todoist/todoist-sync-api';
import { SnapshotController } from '../controllers/snapshot-controller';
import { todoistAccessToken } from '../middleware/todoist-access-token';
import apiErrorHandler from '../middleware/api-error-handler';

export default function api() {
  const api = express();

  // Gate authentication
  api.use(todoistAccessToken);

  api.get('/filter-snapshots', async (req, res, next) => {
    try {
      const accessToken = req.todoist_access_token;
      const controller = new SnapshotController(
        new TodoistApi(accessToken),
        new TodoistSyncApi(accessToken)
      );
      const response = await controller.getFilterSnapshots();

      res.status(200).send(response);
      return;
    } catch (error) {
      next(error);
    }
  });

  // Error Handling
  api.use(apiErrorHandler);

  return api;
}
