import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../features/teams/components/TeamSidebar";

export default function WorkspaceLayout() {
  const { teamId } = useParams();

  if (!teamId) return null;

  return (
    <div className="h-[90vh] flex">
      <Sidebar teamId={teamId} />

      <main className="w-full min-w-0 min-h-0 p-6">
        <Outlet />
      </main>
    </div>
  );
}
