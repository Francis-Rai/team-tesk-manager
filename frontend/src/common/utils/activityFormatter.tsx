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
  if (message.startsWith("Created Task")) {
    return "CREATED";
  }
  if (message.startsWith("Updated Task Details")) {
    return "UPDATED";
  }
  if (message.startsWith("Deleted Task")) {
    return "DELETED";
  }
  if (message.startsWith("Change Status")) {
    return "STATUS";
  }
  if (message.includes("Assignee changed")) {
    return "ASSIGNEE_CHANGE";
  }
  if (message.includes("Support")) {
    return "SUPPORT";
  }
  return "COMMENT";
}
export function getActivityTypeLabel(message: string): string {
  switch (getActivityType(message)) {
    case "CREATED":
      return "Created";
    case "UPDATED":
      return "Updated";
    case "DELETED":
      return "Deleted";
    case "STATUS":
      return "Status";
    case "ASSIGNEE_CHANGE":
      return "Assignee";
    case "SUPPORT":
      return "Support";
    case "COMMENT":
    default:
      return "Comment";
  }
}

export function getActivityVerb(message: string): string {
  switch (getActivityType(message)) {
    case "CREATED":
      return "created";
    case "UPDATED":
      return "updated";
    case "DELETED":
      return "deleted";
    case "STATUS":
      return "changed";
    case "ASSIGNEE_CHANGE":
      return "reassigned";
    case "SUPPORT":
      return "updated";
    case "COMMENT":
    default:
      return "commented";
  }
}
function parseStatus(message: string) {
  const match = message.match(/from (\w+) to (\w+)/);

  if (!match) return null;

  return {
    from: formatStatus(match[1]),
    to: formatStatus(match[2]),
  };
}

function parseUpdatedFields(message: string): string[] {
  const match = message.match(/Task details updated: (.+)$/);

  if (!match) return [];

  return match[1]
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseAssignee(message: string) {
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
  switch (getActivityType(message)) {
    case "CREATED":
      return "Created this task.";

    case "UPDATED": {
      const fields = parseUpdatedFields(message);

      if (fields.length === 0) {
        return "Updated task details.";
      }

      return (
        <>
          Updated{" "}
          <span className="font-medium text-foreground">
            {fields.join(", ")}
          </span>
          .
        </>
      );
    }

    case "DELETED":
      return "Deleted this task.";

    case "STATUS": {
      const change = parseStatus(message);

      if (!change) return "Updated the task status.";

      return (
        <>
          Moved this task from{" "}
          <span className={getStatusColor(change.from)}>{change.from}</span> to{" "}
          <span className={getStatusColor(change.to)}>{change.to}</span>.
        </>
      );
    }

    case "ASSIGNEE_CHANGE": {
      const change = parseAssignee(message);

      if (!change) return "Changed the assignee.";

      return (
        <>
          Reassigned this task to{" "}
          <span className="font-medium text-foreground">{change.to}</span>.
        </>
      );
    }

    case "SUPPORT":
      return message;

    case "COMMENT":
    default:
      return message;
  }
}
