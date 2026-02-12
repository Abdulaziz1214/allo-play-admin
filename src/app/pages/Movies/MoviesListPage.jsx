import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { moviesApi } from "../../../services/movies/movies.api";

const MoviesListPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  async function loadMovies() {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      if (selectedGenre) {
        params.genre_id = selectedGenre;
      }

      const res = searchQuery.trim()
        ? await moviesApi.search(params)
        : selectedGenre
        ? await moviesApi.byGenre(selectedGenre, params)
        : await moviesApi.list(params);

      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.movies || payload || [];
      setMovies(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load movies");
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadGenres() {
    try {
      const res = await moviesApi.getGenres();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.genres || payload || [];
      setGenres(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load genres:", e);
    }
  }

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [selectedGenre]);

  function handleSearch() {
    loadMovies();
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedGenre("");
    setTimeout(() => loadMovies(), 0);
  }

  const columns = [
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
      key: "genres",
      header: "Genres",
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-1 text-xs bg-[var(--surface-2)] rounded"
            >
              {genre.name}
            </span>
          ))}
          {row.genres?.length > 3 && (
            <span className="text-xs text-[var(--muted)]">
              +{row.genres.length - 3}
            </span>
          )}
        </div>
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

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Movies</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Browse all movies in the platform (Read-only view).
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

            <div className="w-64">
              <label className="block text-sm font-medium mb-2">Filter by Genre</label>
              <select
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="primary" onClick={handleSearch} className="h-[46px]">
              Search
            </Button>

            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="h-[46px]"
            >
              Clear
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
          <div className="text-sm text-[var(--muted)]">Loading movies...</div>
        ) : (
          <Table columns={columns} data={movies} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default MoviesListPage;
