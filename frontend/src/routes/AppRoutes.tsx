import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/ErrorPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import TeamSelectionPage from "../pages/TeamSelectionPage";
import TeamLayout from "../layout/TeamLayout";
import ProjectPage from "../pages/ProjectPage";
import TaskDetailsPage from "../pages/TaskPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* TEAM LIST */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamSelectionPage />
            </ProtectedRoute>
          }
        />

        {/* TEAM WORKSPACE */}
        <Route
          path="/teams/:teamId"
          element={
            <ProtectedRoute>
              <TeamLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Team Dashboard</div>} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
          <Route
            path="projects/:projectId/tasks/:taskId"
            element={<TaskDetailsPage />}
          />
          <Route path="members" element={<div>Members Page</div>} />{" "}
        </Route>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/teams" replace />} />

        {/* ERROR */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
