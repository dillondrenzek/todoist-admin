import { TodoistApi } from '@doist/todoist-api-typescript';
import { v4 as uuidV4 } from 'uuid';
import { TodoistSyncApi } from '../lib/todoist/todoist-sync-api';

interface FilterSnapshot {
  /**
   * Uuid v4
   */
  id: string;

  /**
   * Id of the Todoist Filter
   */
  filterId: string;

  /**
   * Name of the filter
   */
  name: string;

  /**
   * query from the Filter object
   */
  query: string;

  /**
   * Number of tasks that match the filter
   */
  taskCount: number;

  /**
   * ISO string
   */
  timestamp: string;
}

export class SnapshotController {
  constructor(
    private todoistApi: TodoistApi,
    private syncApi: TodoistSyncApi
  ) {}

  /**
   * Get snapshots for the User's filters
   */
  async getFilterSnapshots(): Promise<FilterSnapshot[]> {
    const userFilters = await this.getUsersFilters();

    const filtersTasks = await Promise.all(
      userFilters.map(async (filter) => {
        const tasks = await this.getTasksWithQuery(filter.query);
        return {
          filter,
          tasks,
        };
      })
    );

    const timestamp = new Date().toISOString();

    return filtersTasks.map((ft) => {
      return {
        filterId: ft.filter.id,
        id: uuidV4(),
        name: ft.filter.name,
        query: ft.filter.query,
        taskCount: ft.tasks?.length ?? 0,
        timestamp,
      };
    });
  }

  private async getUsersFilters() {
    const syncResponse = await this.syncApi.sync(['filters']);

    if (syncResponse?.full_sync) {
      return syncResponse.filters.map((filter) => {
        return {
          id: filter.id,
          name: filter.name,
          query: filter.query,
        };
      });
    } else {
      console.error('Not a full sync');
    }

    return [];
  }

  private async getTasksWithQuery(query: string) {
    const response = await this.todoistApi.getTasks({ filter: query });
    return response;
  }
}
