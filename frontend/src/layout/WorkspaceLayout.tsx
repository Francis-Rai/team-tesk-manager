import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../features/teams/components/TeamSidebar";

export default function WorkspaceLayout() {
  const { teamId } = useParams();

  if (!teamId) return null;

  return (
    <div className="flex w-full h-full min-h-0">
      <Sidebar teamId={teamId} />

      <main className="flex flex-col flex-1 min-h-0 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
