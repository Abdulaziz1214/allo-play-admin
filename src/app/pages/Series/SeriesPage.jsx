import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { seriesApi } from "../../../services/series/series.api";

const SeriesPage = () => {
  const { t } = useTranslation();
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const loadSeries = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const res = searchQuery.trim()
        ? await seriesApi.search(params)
        : await seriesApi.list(params);
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.series || payload || [];
      setSeries(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setSeries([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

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
      setError(e?.response?.data?.message || e.message);
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
      setError(e?.response?.data?.message || e.message);
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

  const seriesColumns = [
    {
      key: "poster",
      header: t('common.poster'),
      cell: (row) => (
        <div className="w-12 h-16 bg-[var(--surface-2)] rounded overflow-hidden">
          {row.poster_url ? (
            <img src={row.poster_url} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--muted)]">
              {t('common.noPoster')}
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
      header: t('common.year'),
      cell: (row) => <span className="text-sm">{row.year || "—"}</span>,
    },
    {
      key: "seasons_count",
      header: t('series.seasons'),
      cell: (row) => <span className="text-sm">{row.seasons_count || row.total_seasons || "—"}</span>,
    },
    {
      key: "rating",
      header: t('common.rating'),
      cell: (row) => (
        <span className="text-sm">{row.rating ? `${row.rating.toFixed(1)}` : "—"}</span>
      ),
    },
    {
      key: "actions",
      header: t('common.actions'),
      cell: (row) => (
        <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => loadSeasons(row)}>
          {t('series.viewSeasons')}
        </Button>
      ),
    },
  ];

  const seasonsColumns = [
    {
      key: "season_number",
      header: t('series.season'),
      cell: (row) => <span className="font-medium">{t('series.season')} {row.season_number}</span>,
    },
    {
      key: "title",
      header: t('common.title'),
      cell: (row) => <span>{row.title || "—"}</span>,
    },
    {
      key: "episodes_count",
      header: t('series.episodes'),
      cell: (row) => <span className="text-sm">{row.episodes_count || row.total_episodes || "—"}</span>,
    },
    {
      key: "year",
      header: t('common.year'),
      cell: (row) => <span className="text-sm">{row.year || "—"}</span>,
    },
    {
      key: "actions",
      header: t('common.actions'),
      cell: (row) => (
        <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => loadEpisodes(row)}>
          {t('series.viewEpisodes')}
        </Button>
      ),
    },
  ];

  const episodesColumns = [
    {
      key: "episode_number",
      header: t('series.episode'),
      cell: (row) => <span className="font-medium">E{row.episode_number}</span>,
    },
    {
      key: "title",
      header: t('common.title'),
      cell: (row) => <span>{row.title || t('series.untitled')}</span>,
    },
    {
      key: "duration",
      header: t('common.duration'),
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

  if (selectedSeason) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToSeasons} className="mb-4">
              ← {t('series.backToSeasons')}
            </Button>
            <h1 className="text-2xl font-semibold">
              {selectedSeries.title} - {t('series.season')} {selectedSeason.season_number}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {t('series.episodesFor')} {selectedSeason.season_number}
            </p>
          </div>
        </Card>
        <Card>
          {loadingEpisodes ? (
            <div className="text-sm text-[var(--muted)]">{t('series.loadingEpisodes')}</div>
          ) : (
            <Table columns={episodesColumns} data={episodes} rowKey={(row) => row.id} />
          )}
        </Card>
      </div>
    );
  }

  if (selectedSeries) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBackToSeries} className="mb-4">
              ← {t('series.backToSeries')}
            </Button>
            <h1 className="text-2xl font-semibold">{selectedSeries.title}</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {t('series.seasonsFor')} {selectedSeries.title}
            </p>
          </div>
        </Card>
        <Card>
          {loadingSeasons ? (
            <div className="text-sm text-[var(--muted)]">{t('series.loadingSeasons')}</div>
          ) : (
            <Table columns={seasonsColumns} data={seasons} rowKey={(row) => row.id} />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t('series.title')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{t('series.description')}</p>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label={t('common.search')}
                placeholder={t('series.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="primary" onClick={handleSearch} className="h-[46px]">
              {t('common.search')}
            </Button>
          </div>
          <div className="text-xs text-[var(--muted)]">{t('movies.readOnlyInfo')}</div>
        </div>
      </Card>
      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">{t('series.loadingSeries')}</div>
        ) : (
          <Table columns={seriesColumns} data={series} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default SeriesPage;
