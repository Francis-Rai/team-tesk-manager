// import { useNavigate, useParams } from "react-router-dom";
// import { useTeam } from "../hooks/useTeam";
// import TeamHeader from "./TeamHeader";
// import { getTeamPermissions } from "../utils/teamPermissions";
// import { getUserFromToken } from "../../users/api/userApi";

// export default function TeamOverview() {
//   const navigate = useNavigate();

//   const { teamId } = useParams<{ teamId: string }>();

//   const { data: team, isLoading } = useTeam(teamId || "");

//   const user = getUserFromToken();

//   if (isLoading || !team) {
//     return (
//       <div className="text-sm text-muted-foreground">Loading overview...</div>
//     );
//   }

//   if (!user?.role) return;

//   const permissions = getTeamPermissions({
//     globalRole: user.role,
//   });

//   const navigateTo = (teamId: string) => {
//     navigate(`/teams/${teamId}`);
//   };

//   return (
//     <div className="space-y-6">
//       <TeamHeader
//         teamId={team.id}
//         name={team.name}
//         description={team.description}
//         permissions={permissions}
//       />

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <OverviewCard title="Projects" description="View and manage projects" />
//         <OverviewCard title="Members" description="Manage team members" />
//         <OverviewCard title="Activity" description="View recent updates" />
//       </div>

//       <div className="border rounded-lg p-4 text-sm text-muted-foreground">
//         More dashboard widgets coming soon...
//       </div>
//     </div>
//   );
// }

// function OverviewCard({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="border rounded-lg p-4 hover:bg-muted/40 transition cursor-pointer">
//       <h3 className="font-medium">{title}</h3>
//       <p className="text-xs text-muted-foreground mt-1">{description}</p>
//     </div>
//   );
// }

import { useNavigate, useParams } from "react-router-dom";
import { useTeam } from "../hooks/useTeam";
import TeamHeader from "./TeamHeader";
import { getTeamPermissions } from "../utils/teamPermissions";
import { getUserFromToken } from "../../users/api/userApi";

import { Card, CardContent } from "../../../components/ui/card";
import TeamOverviewCard from "./TeamOverviewCard";

export default function TeamOverview() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const { data: team, isLoading } = useTeam(teamId || "");
  const user = getUserFromToken();

  if (isLoading || !team) {
    return (
      <div className="text-sm text-muted-foreground">Loading overview...</div>
    );
  }

  if (!user?.role) return null;

  const permissions = getTeamPermissions({
    globalRole: user.role,
  });

  return (
    <div className="space-y-6">
      <TeamHeader
        teamId={team.id}
        name={team.name}
        description={team.description}
        permissions={permissions}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TeamOverviewCard
          title="Projects"
          description="View and manage projects"
          onClick={() => navigate(`/teams/${team.id}/projects`)}
        />

        <TeamOverviewCard
          title="Members"
          description="Manage team members"
          onClick={() => navigate(`/teams/${team.id}/members`)}
        />

        <TeamOverviewCard
          title="Activity"
          description="View recent updates"
          onClick={() => console.log("future activity page")}
        />
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-sm font-medium">Recent Activity</h3>

          <p className="text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
