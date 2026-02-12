import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { seriesApi } from "../../../services/series/series.api";

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Seasons/Episodes drill-down
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  async function loadSeries() {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      const res = searchQuery.trim()
        ? await seriesApi.search(params)
        : await seriesApi.list(params);

      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.series || payload || [];
      setSeries(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load series");
      setSeries([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSeasons(seriesItem) {
    setSelectedSeries(seriesItem);
    setLoadingSeasons(true);
    setSeasons([]);
    setSelectedSeason(null);
    setEpisodes([]);

    try {
      const res = await seriesApi.getSeasons(seriesItem.id);
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.seasons || payload || [];
      setSeasons(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load seasons");
    } finally {
      setLoadingSeasons(false);
    }
  }

  async function loadEpisodes(season) {
    setSelectedSeason(season);
    setLoadingEpisodes(true);
    setEpisodes([]);

    try {
      const res = await seriesApi.getEpisodes(season.id);
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.episodes || payload || [];
      setEpisodes(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load episodes");
    } finally {
      setLoadingEpisodes(false);
    }
  }

  function handleBackToSeries() {
    setSelectedSeries(null);
    setSeasons([]);
    setSelectedSeason(null);
    setEpisodes([]);
  }

  function handleBackToSeasons() {
    setSelectedSeason(null);
    setEpisodes([]);
  }

  useEffect(() => {
    loadSeries();
  }, []);

  function handleSearch() {
    loadSeries();
  }

  // Series columns
  const seriesColumns = [
    {
      key: "poster",
      header: "Poster",
      cell: (row) => (
        <div className="w-12 h-16 bg-[var(--surface-2)] rounded overflow-hidden">
          {row.poster_url ? (
            <img
              src={row.poster_url}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--muted)]">
              No poster
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.title}</div>
          {row.original_title && row.original_title !== row.title && (
            <div className="text-xs text-[var(--muted)]">{row.original_title}</div>
          )}
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
      cell: (row) => <span className="text-sm">{row.year || "—"}</span>,
    },
    {
      key: "seasons_count",
      header: "Seasons",
      cell: (row) => (
        <span className="text-sm">{row.seasons_count || row.total_seasons || "—"}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      cell: (row) => (
        <span className="text-sm">
          {row.rating ? `⭐ ${row.rating.toFixed(1)}` : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          className="px-3 py-1 text-xs"
          onClick={() => loadSeasons(row)}
        >
          View Seasons
        </Button>
      ),
    },
  ];

  // Seasons columns
  const seasonsColumns = [
    {
      key: "season_number",
      header: "Season",
      cell: (row) => <span className="font-medium">Season {row.season_number}</span>,
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => <span>{row.title || "—"}</span>,
    },
    {
      key: "episodes_count",
      header: "Episodes",
      cell: (row) => (
        <span className="text-sm">{row.episodes_count || row.total_episodes || "—"}</span>
      ),
    },
    {
      key: "year",
      header: "Year",
      cell: (row) => <span className="text-sm">{row.year || "—"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          className="px-3 py-1 text-xs"
          onClick={() => loadEpisodes(row)}
        >
          View Episodes
        </Button>
      ),
    },
  ];

  // Episodes columns
  const episodesColumns = [
    {
      key: "episode_number",
      header: "Episode",
      cell: (row) => <span className="font-medium">E{row.episode_number}</span>,
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => <span>{row.title || "Untitled"}</span>,
    },
    {
      key: "duration",
      header: "Duration",
      cell: (row) => (
        <span className="text-sm text-[var(--muted)]">
          {row.duration ? `${row.duration} min` : "—"}
        </span>
      ),
    },
    {
      key: "id",
      header: "ID",
      cell: (row) => <span className="text-xs text-[var(--muted)]">{row.id}</span>,
    },
  ];

  // Render Episodes View
  if (selectedSeason) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToSeasons} className="mb-4">
              ← Back to Seasons
            </Button>
            <h1 className="text-2xl font-semibold">
              {selectedSeries.title} - Season {selectedSeason.season_number}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Episodes for season {selectedSeason.season_number}
            </p>
          </div>
        </Card>

        <Card>
          {loadingEpisodes ? (
            <div className="text-sm text-[var(--muted)]">Loading episodes...</div>
          ) : (
            <Table
              columns={episodesColumns}
              data={episodes}
              rowKey={(row) => row.id}
            />
          )}
        </Card>
      </div>
    );
  }

  // Render Seasons View
  if (selectedSeries) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToSeries} className="mb-4">
              ← Back to Series
            </Button>
            <h1 className="text-2xl font-semibold">{selectedSeries.title}</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Seasons for {selectedSeries.title}
            </p>
          </div>
        </Card>

        <Card>
          {loadingSeasons ? (
            <div className="text-sm text-[var(--muted)]">Loading seasons...</div>
          ) : (
            <Table columns={seasonsColumns} data={seasons} rowKey={(row) => row.id} />
          )}
        </Card>
      </div>
    );
  }

  // Render Series List View (default)
  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Series</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Browse all TV series in the platform (Read-only view).
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Button variant="primary" onClick={handleSearch} className="h-[46px]">
              Search
            </Button>
          </div>

          <div className="text-xs text-[var(--muted)]">
            ℹ️ Admin CRUD endpoints are not yet available in the API. This is a
            read-only view using public endpoints.
          </div>
        </div>
      </Card>

      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">Loading series...</div>
        ) : (
          <Table columns={seriesColumns} data={series} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default SeriesPage;
