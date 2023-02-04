import { TodoistApiError } from '../../api/index';

/**
 * Type guard for if a value is an error from Todoist API
 * @param value
 * @returns
 */
export function isTodoistApiError(value: unknown): value is TodoistApiError {
  return (
    value &&
    typeof value === 'object' &&
    'httpStatusCode' in value &&
    'responseData' in value
  );
}
