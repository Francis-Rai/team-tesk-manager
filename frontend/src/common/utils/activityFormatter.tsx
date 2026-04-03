import { TaskStatusStyles } from "../../features/tasks/utils/taskStatus";

export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type ActivityType =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS"
  | "ASSIGNEE_CHANGE"
  | "SUPPORT"
  | "COMMENT";

function getActivityType(message: string): ActivityType {
  if (message.startsWith("Created Task")) return "CREATED";
  if (message.startsWith("Updated Task Details")) return "UPDATED";
  if (message.startsWith("Deleted Task")) return "DELETED";
  if (message.startsWith("Change Status")) return "STATUS";
  if (message.includes("Assignee changed")) return "ASSIGNEE_CHANGE";
  if (message.includes("Support")) return "SUPPORT";

  return "COMMENT";
}

function parseStatus(message: string): {
  from: string;
  to: string;
} | null {
  const match = message.match(/from (\w+) to (\w+)/);

  if (!match) return null;

  return {
    from: formatStatus(match[1]),
    to: formatStatus(match[2]),
  };
}

function parseAssignee(message: string): {
  from: string;
  to: string;
} | null {
  const match = message.match(/from (.+) to (.+)/);

  if (!match) return null;

  return {
    from: match[1],
    to: match[2],
  };
}

function getStatusColor(status: string): string {
  switch (status) {
    case "TODO":
      return TaskStatusStyles["TODO"];
    case "In Progress":
      return TaskStatusStyles["IN_PROGRESS"];
    case "In Review":
      return TaskStatusStyles["IN_REVIEW"];
    case "On Hold":
      return TaskStatusStyles["ON_HOLD"];
    case "Done":
      return TaskStatusStyles["DONE"];
    case "Cancelled":
      return TaskStatusStyles["CANCELLED"];
    default:
      return "text-muted-foreground";
  }
}

export function activityFormatter(message: string): React.ReactNode {
  const type = getActivityType(message);

  switch (type) {
    case "CREATED":
      return "created the task";

    case "UPDATED":
      return "updated task details";

    case "DELETED":
      return "deleted the task";

    case "STATUS": {
      const change = parseStatus(message);

      if (!change) return "updated status";

      return (
        <>
          moved → <span className={getStatusColor(change.to)}>{change.to}</span>
        </>
      );
    }

    case "ASSIGNEE_CHANGE": {
      const change = parseAssignee(message);

      if (!change) return "changed assignee";

      return (
        <>
          changed assignee to <span className="font-medium">{change.to}</span>
        </>
      );
    }

    case "SUPPORT":
      return <span className="text-muted-foreground">{message}</span>;

    case "COMMENT":
      return message;

    default:
      return message;
  }
}
