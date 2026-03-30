import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../features/teams/components/TeamSidebar";
import TopBar from "../features/teams/components/TopBar";

export default function WorkspaceLayout() {
  const { teamId } = useParams();

  if (!teamId) return null;

  return (
    <div className="h-screen flex">
      <Sidebar teamId={teamId} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <TopBar teamId={teamId} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
