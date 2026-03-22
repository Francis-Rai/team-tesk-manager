import { Outlet, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function TeamLayout() {
  const { teamId } = useParams();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Team Workspace</h2>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            to={`/teams/${teamId}`}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to={`/teams/${teamId}/projects`}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Projects
          </Link>

          <Link
            to={`/teams/${teamId}/members`}
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Members
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
