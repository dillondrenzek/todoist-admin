import axios from 'axios';

interface Filter {
  // id: '4638878';
  id: string;
  // name: 'Important';
  name: string;
  // query: 'priority 1';
  query: string;
  // color: 'lime_green';
  color: string;
  // item_order: 3;
  item_order: number;
  // is_deleted: false;
  is_deleted: boolean;
  // is_favorite: false;
  is_favorite: boolean;
}

interface SyncResponse {
  //   sync_token	A new synchronization token. Used by the client in the next sync request to perform an incremental sync.
  // full_sync	Whether the response contains all data (a full synchronization) or just the incremental updates since the last sync.
  // user	A user object.
  // projects	An array of project objects.
  // items	An array of item objects.
  // notes	An array of item note objects.
  // project_notes	An array of project note objects.
  // sections	An array of section objects.
  // labels	An array of personal label objects.
  // filters	An array of filter objects.
  // day_orders	A JSON object specifying the order of items in daily agenda.
  // reminders	An array of reminder objects.
  // collaborators	A JSON object containing all collaborators for all shared projects. The projects field contains the list of all shared projects, where the user acts as one of collaborators.
  // collaborators_states	An array specifying the state of each collaborator in each project. The state can be invited, active, inactive, deleted.
  // completed_info	An array of completed info objects indicating the number of completed items within an active project, section, or parent item. Projects will also include the number of archived sections. Endpoints for accessing archived objects are described in the Items and sections archive section.
  // live_notifications	An array of live_notification objects.
  // live_notifications_last_read	What is the last live notification the user has seen? This is used to implement unread notifications.
  // user_settings	A JSON object containing user settings.
  // user_plan_limits	A JSON object containing user plan limits.

  filters?: Filter[];

  full_sync: boolean;

  sync_token: string;

  temp_id_mapping: Record<string, unknown>;

  // "completed_info": [ ... ],
  // "collaborators": [ ... ],
  // "collaborator_states": [ ... ],
  // "day_orders": { ... },
  // "filters": [ ... ],
  // "full_sync": true,
  // "items": [ ... ],
  // "labels": [ ... ],
  // "live_notifications": [ ... ],
  // "live_notifications_last_read_id": "0",
  // "locations": [ ... ],
  // "notes": [ ... ],
  // "project_notes": [ ... ],
  // "projects": [ ... ],
  // "reminders": [ ... ],
  // "sections": [ ... ],
  // "stats": { ... },
  // "settings_notifications": { ... },
  // "sync_token": "TnYUZEpuzf2FMA9qzyY3j4xky6dXiYejmSO85S5paZ_a9y1FI85mBbIWZGpW",
  // "temp_id_mapping": { ... },
  // "user": { ... },
  // "user_plan_limits": { ... },
  // "user_settings": { ... }
}

export class TodoistSyncApi {
  private static baseUrl = 'https://api.todoist.com/sync/v9';

  constructor(private accessToken: string) {}

  async sync(): Promise<SyncResponse> {
    try {
      const { data } = await axios.post<SyncResponse>(
        this.url('/sync'),
        {
          resource_types: ['filters'],
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);
    }
    return;
  }

  private url(path: string): string {
    return TodoistSyncApi.baseUrl + path;
  }
}
