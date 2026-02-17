import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { moviesApi } from "../../../services/movies/movies.api";

const MoviesListPage = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const isInitialMount = useRef(true);

  const loadMovies = useCallback(async (search, genre) => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (search?.trim()) params.q = search.trim();
      if (genre) params.genre_id = genre;

      const res = search?.trim()
        ? await moviesApi.search(params)
        : genre
        ? await moviesApi.byGenre(genre, params)
        : await moviesApi.list(params);

      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.movies || payload || [];
      setMovies(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const res = await moviesApi.getGenres();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.genres || payload || [];
      setGenres(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load genres:", e);
    }
  }, []);

  useEffect(() => {
    loadGenres();
    loadMovies("", "");
  }, [loadGenres, loadMovies]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadMovies(searchQuery, selectedGenre);
  }, [selectedGenre, loadMovies, searchQuery]);

  function handleSearch() {
    loadMovies(searchQuery, selectedGenre);
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedGenre("");
  }

  const columns = [
    {
      key: "poster",
      header: t('movies.poster'),
      cell: (row) => (
        <div className="w-12 h-16 bg-[var(--surface-2)] rounded overflow-hidden">
          {row.poster_url ? (
            <img src={row.poster_url} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--muted)]">
              {t('movies.noPoster')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: t('common.title'),
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
      header: t('movies.year'),
      cell: (row) => <span className="text-sm">{row.year || "—"}</span>,
    },
    {
      key: "genres",
      header: t('movies.genres'),
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.genres?.slice(0, 3).map((genre) => (
            <span key={genre.id} className="px-2 py-1 text-xs bg-[var(--surface-2)] rounded">
              {genre.name}
            </span>
          ))}
          {row.genres?.length > 3 && (
            <span className="text-xs text-[var(--muted)]">+{row.genres.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: t('movies.rating'),
      cell: (row) => (
        <span className="text-sm">{row.rating ? `${row.rating.toFixed(1)}` : "—"}</span>
      ),
    },
    {
      key: "duration",
      header: t('movies.duration'),
      cell: (row) => (
        <span className="text-sm text-[var(--muted)]">
          {row.duration ? `${row.duration} ${t('common.min')}` : "—"}
        </span>
      ),
    },
    {
      key: "id",
      header: t('common.id'),
      cell: (row) => <span className="text-xs text-[var(--muted)]">{row.id}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t('movies.title')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{t('movies.description')}</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label={t('common.search')}
                placeholder={t('movies.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium mb-2">{t('movies.filterByGenre')}</label>
              <select
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--text)]"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">{t('movies.allGenres')}</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
            <Button variant="primary" onClick={handleSearch} className="h-[46px]">
              {t('common.search')}
            </Button>
            <Button variant="secondary" onClick={handleClearFilters} className="h-[46px]">
              {t('common.clear')}
            </Button>
          </div>
          <div className="text-xs text-[var(--muted)]">{t('movies.readOnlyInfo')}</div>
        </div>
      </Card>

      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">{t('movies.loadingMovies')}</div>
        ) : (
          <Table columns={columns} data={movies} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default MoviesListPage;
