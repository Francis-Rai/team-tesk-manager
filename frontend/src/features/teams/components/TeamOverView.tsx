import { useParams } from "react-router-dom";
import { useTeam } from "../hooks/useTeam";

export default function TeamOverview() {
  const { teamId } = useParams<{ teamId: string }>();

  const { data: team, isLoading } = useTeam(teamId || "");

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading overview...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Welcome to {team?.name}</h1>

        <p className="text-sm text-muted-foreground">
          Manage projects, tasks, and team activity
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard title="Projects" description="View and manage projects" />
        <OverviewCard title="Members" description="Manage team members" />
        <OverviewCard title="Activity" description="View recent updates" />
      </div>

      {/* PLACEHOLDER SECTION */}
      <div className="border rounded-lg p-4 text-sm text-muted-foreground">
        More dashboard widgets coming soon...
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/40 transition cursor-pointer">
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
