import React from "react";

import { FiltersPage } from "../pages/filters-page/filters-page";
import { DatabasePage } from "../pages/database-page/database-page";
import { PlaylistPage } from "../pages/playlist-page/playlist-page";
import { SavedFiltersProvider } from "../hooks/use-saved-filters";
import { StatsPage } from "../pages/stats-page/stats-page";
import { CreatePage } from "../pages/create-page/create-page";

export const PATHS = {
  index: "/",
  create: "/create",
  playlist: "/playlist",
  database: "/lib",
  filters: "/filters",
  stats: "/stats",
};

export const ROUTES = [
  {
    path: PATHS.index,
    element: <CreatePage />,
  },
  { path: PATHS.create, element: <CreatePage /> },
  { path: PATHS.playlist, element: <PlaylistPage /> },
  {
    path: PATHS.filters,
    element: (
      <SavedFiltersProvider>
        <FiltersPage />
      </SavedFiltersProvider>
    ),
  },
  { path: PATHS.database, element: <DatabasePage /> },
  { path: PATHS.stats, element: <StatsPage /> },
];
