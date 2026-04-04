import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
