import type {
  ActivityDetails,
  ActivityType,
} from "../types/activity.types";
import { TaskStatusStyles } from "../../features/tasks/utils/taskStatus";

type ActivityLike = {
  message: string;
  type?: ActivityType;
  details?: Partial<ActivityDetails> | null;
};

function normalizeActivity(activity: string | ActivityLike): ActivityLike {
  if (typeof activity === "string") {
    return {
      message: activity,
      type: inferLegacyType(activity),
      details: inferLegacyDetails(activity),
    };
  }

  return {
    message: activity.message,
    type: activity.type ?? inferLegacyType(activity.message),
    details: activity.details ?? inferLegacyDetails(activity.message),
  };
}

export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferLegacyType(message: string): ActivityType {
  if (message === "Task created") return "TASK_CREATED";
  if (message.startsWith("Task details updated")) return "TASK_UPDATED";
  if (message === "Task deleted") return "TASK_DELETED";
  if (message.startsWith("Status changed from ")) return "TASK_STATUS_CHANGED";
  if (message.startsWith("Assignee changed from ")) return "TASK_ASSIGNEE_CHANGED";
  if (message.startsWith("Support assigned to ")) return "TASK_SUPPORT_ASSIGNED";
  if (message.startsWith("Support changed from ")) return "TASK_SUPPORT_CHANGED";
  if (message.startsWith("Support removed (")) return "TASK_SUPPORT_REMOVED";
  return "TASK_COMMENTED";
}

function inferLegacyDetails(message: string): Partial<ActivityDetails> {
  const detailsMatch = message.match(/^Task details updated: (.+)$/);
  if (detailsMatch) {
    return {
      fields: detailsMatch[1]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    };
  }

  const statusMatch = message.match(/^Status changed from ([A-Z_]+) to ([A-Z_]+)$/);
  if (statusMatch) {
    return {
      from: statusMatch[1],
      to: statusMatch[2],
    };
  }

  const assigneeMatch = message.match(/^Assignee changed from (.+) to (.+)$/);
  if (assigneeMatch) {
    return {
      from: assigneeMatch[1],
      to: assigneeMatch[2],
    };
  }

  const supportAssignedMatch = message.match(/^Support assigned to (.+)$/);
  if (supportAssignedMatch) {
    return {
      target: supportAssignedMatch[1],
    };
  }

  const supportChangedMatch = message.match(/^Support changed from (.+) to (.+)$/);
  if (supportChangedMatch) {
    return {
      from: supportChangedMatch[1],
      to: supportChangedMatch[2],
    };
  }

  const supportRemovedMatch = message.match(/^Support removed \((.+)\)$/);
  if (supportRemovedMatch) {
    return {
      from: supportRemovedMatch[1],
      target: supportRemovedMatch[1],
    };
  }

  return {};
}

export function getActivityTypeLabel(activity: string | ActivityLike): string {
  const { type = "TASK_COMMENTED" } = normalizeActivity(activity);

  switch (type) {
    case "TASK_CREATED":
      return "Created";
    case "TASK_UPDATED":
      return "Updated";
    case "TASK_DELETED":
      return "Deleted";
    case "TASK_STATUS_CHANGED":
      return "Status";
    case "TASK_ASSIGNEE_CHANGED":
      return "Assignee";
    case "TASK_SUPPORT_ASSIGNED":
    case "TASK_SUPPORT_CHANGED":
    case "TASK_SUPPORT_REMOVED":
      return "Support";
    case "TASK_COMMENTED":
    case "PROJECT_UPDATED":
    case "TEAM_UPDATED":
    default:
      return "Comment";
  }
}

export function getActivityVerb(activity: string | ActivityLike): string {
  const { type = "TASK_COMMENTED" } = normalizeActivity(activity);

  switch (type) {
    case "TASK_CREATED":
      return "created";
    case "TASK_UPDATED":
      return "updated";
    case "TASK_DELETED":
      return "deleted";
    case "TASK_STATUS_CHANGED":
      return "changed";
    case "TASK_ASSIGNEE_CHANGED":
      return "reassigned";
    case "TASK_SUPPORT_ASSIGNED":
      return "assigned";
    case "TASK_SUPPORT_CHANGED":
      return "updated";
    case "TASK_SUPPORT_REMOVED":
      return "removed";
    case "TASK_COMMENTED":
    case "PROJECT_UPDATED":
    case "TEAM_UPDATED":
    default:
      return "commented";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "TODO":
      return TaskStatusStyles["TODO"];
    case "IN_PROGRESS":
      return TaskStatusStyles["IN_PROGRESS"];
    case "IN_REVIEW":
      return TaskStatusStyles["IN_REVIEW"];
    case "ON_HOLD":
      return TaskStatusStyles["ON_HOLD"];
    case "DONE":
      return TaskStatusStyles["DONE"];
    case "CANCELLED":
      return TaskStatusStyles["CANCELLED"];
    default:
      return "text-muted-foreground";
  }
}

export function activityFormatter(activity: string | ActivityLike): React.ReactNode {
  const normalized = normalizeActivity(activity);
  const type = normalized.type ?? "TASK_COMMENTED";
  const details = normalized.details ?? {};

  switch (type) {
    case "TASK_CREATED":
      return "Created this task.";

    case "TASK_UPDATED": {
      const fields = details.fields ?? [];

      if (fields.length === 0) {
        return "Updated task details.";
      }

      return (
        <>
          Updated{" "}
          <span className="font-medium text-foreground">{fields.join(", ")}</span>
          .
        </>
      );
    }

    case "TASK_DELETED":
      return "Deleted this task.";

    case "TASK_STATUS_CHANGED": {
      if (!details.from || !details.to) {
        return "Updated the task status.";
      }

      return (
        <>
          Moved this task from{" "}
          <span className={getStatusColor(details.from)}>
            {formatStatus(details.from)}
          </span>{" "}
          to{" "}
          <span className={getStatusColor(details.to)}>
            {formatStatus(details.to)}
          </span>
          .
        </>
      );
    }

    case "TASK_ASSIGNEE_CHANGED":
      if (!details.from || !details.to) {
        return "Changed the assignee.";
      }

      return (
        <>
          Reassigned this task from{" "}
          <span className="font-medium text-foreground">{details.from}</span> to{" "}
          <span className="font-medium text-foreground">{details.to}</span>.
        </>
      );

    case "TASK_SUPPORT_ASSIGNED":
      if (!details.target) {
        return "Assigned support.";
      }

      return (
        <>
          Assigned support to{" "}
          <span className="font-medium text-foreground">{details.target}</span>.
        </>
      );

    case "TASK_SUPPORT_CHANGED":
      if (!details.from || !details.to) {
        return "Changed support.";
      }

      return (
        <>
          Changed support from{" "}
          <span className="font-medium text-foreground">{details.from}</span> to{" "}
          <span className="font-medium text-foreground">{details.to}</span>.
        </>
      );

    case "TASK_SUPPORT_REMOVED":
      if (!details.target && !details.from) {
        return "Removed support.";
      }

      return (
        <>
          Removed support assignment for{" "}
          <span className="font-medium text-foreground">
            {details.target ?? details.from}
          </span>
          .
        </>
      );

    case "PROJECT_UPDATED":
      return "Updated this project.";
    case "TEAM_UPDATED":
      return "Updated this team.";
    case "TASK_COMMENTED":
    default:
      return normalized.message;
  }
}
