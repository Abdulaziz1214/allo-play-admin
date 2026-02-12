
import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/Auth/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import ForbiddenPage from '../pages/Errors/ForbiddenPage';
import NotFoundPage from '../pages/Errors/NotFoundPage';
import PermissionGate from './PermissionGate';
import MoviesListPage from '../pages/Movies/MoviesListPage';
import SeriesPage from '../pages/Series/SeriesPage';
import ReelsListPage from '../pages/Reels/ReelsListPage';
import TVChannelsPage from '../pages/TVChannels/TVChannelsPage';
import UsersPage from '../pages/Users/UsersPage';
import CategoriesPage from '../pages/Categories/CategoriesPage';
import RolesPage from '../pages/Roles/RolesPage';
import AdminsPage from '../pages/Admins/AdminsPage';



export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/403", element: <ForbiddenPage /> },
      {
        path: "/movies",
        element: (
          <PermissionGate permission="movies.view">
            <MoviesListPage />
          </PermissionGate>
        ),
      },
      {
        path: "/series",
        element: (
          <PermissionGate permission="series.view">
            <SeriesPage />
          </PermissionGate>
        ),
      },
      {
        path: "/reels",
        element: (
          <PermissionGate permission="reels.view">
            <ReelsListPage />
          </PermissionGate>
        ),
      },
      {
        path: "/tv-channels",
        element: (
          <PermissionGate permission="tv_channels.view">
            <TVChannelsPage />
          </PermissionGate>
        ),
      },
      {
        path: "/users",
        element: (
          <PermissionGate permission="users.view">
            <UsersPage />
          </PermissionGate>
        ),
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/roles",
        element: (
          <PermissionGate permission="roles.view">
            <RolesPage />
          </PermissionGate>
        ),
      },
      {
        path: "/admins",
        element: (
          <PermissionGate permission="admins.view">
            <AdminsPage />
          </PermissionGate>
        ),
      },

    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);



