import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/ErrorPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import TeamSelectionPage from "../pages/TeamSelectionPage";
import TaskDetailsPage from "../pages/TaskDetailsPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";
import ProjectsView from "../features/projects/components/ProjectsView";
import WorkspaceLayout from "../layout/WorkspaceLayout";
import TeamOverview from "../features/teams/components/TeamOverview";
import TeamMembersPage from "../pages/TeamMembersPage";
import AppLayout from "../layout/AppLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <TeamSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams/:teamId"
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeamOverview />} />
            <Route path="projects" element={<ProjectsView />} />
            <Route path="members" element={<TeamMembersPage />} />
            {/* <Route path="activity" element={<ActivityView />} /> */}
            <Route
              path="/teams/:teamId/projects/:projectId"
              element={<ProjectDetailsPage />}
            />

            <Route
              path="/teams/:teamId/projects/:projectId/tasks/:taskId"
              element={<TaskDetailsPage />}
            />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/teams" replace />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
