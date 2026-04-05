import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

export default function AppLayout() {
  return (
    <div className="flex flex-col  w-screen h-screen">
      <TopBar />

      <main className="flex-1 min-h-0  overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
