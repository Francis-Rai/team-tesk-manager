import { useQuery } from "@tanstack/react-query";
import { getTasks, getTaskUpdates } from "../../tasks/api/taskApi";
import type { TaskUpdate } from "../../tasks/types/taskUpdatesTypes";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { Task } from "../../tasks/types/taskTypes";
import type { ActivityItem } from "../types/activityTypes";

function mapToActivityItem(update: TaskUpdate, task: Task): ActivityItem {
  return {
    id: update.id,
    userName: update.createdByName,
    taskId: task.id,
    taskTitle: task.title,
    createdAt: update.createdAt,
    action: update.message,
  };
}

function groupByDate(items: ActivityItem[]) {
  const groups: Record<string, ActivityItem[]> = {};

  for (const item of items) {
    const date = new Date(item.createdAt).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);
  }

  return groups;
}

export const useProjectActivity = (teamId: string, projectId: string) => {
  return useQuery<Record<string, ActivityItem[]>>({
    queryKey: ["projectActivity", teamId, projectId],

    queryFn: async () => {
      const taskRes: PageResponse<Task> = await getTasks(teamId, projectId, {
        page: 0,
        size: 10,
        deletedFilter: "ACTIVE",
      });

      const tasks = taskRes.content;

      const updatesPerTask = await Promise.all(
        tasks.map(async (task) => {
          const res: PageResponse<TaskUpdate> = await getTaskUpdates(
            teamId,
            projectId,
            task.id,
            {
              page: 0,
              size: 5,
            },
          );

          return res.content.map((update) => mapToActivityItem(update, task));
        }),
      );

      const activity: ActivityItem[] = updatesPerTask.flat();

      const sorted = activity.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return groupByDate(sorted);
    },

    staleTime: 1000 * 30,
  });
};
