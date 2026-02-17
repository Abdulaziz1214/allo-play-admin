import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { moviesApi } from "../../../services/movies/movies.api";
import { seriesApi } from "../../../services/series/series.api";
import { tvChannelsApi } from "../../../services/tvChannels/tvChannels.api";
import { reelsApi } from "../../../services/reels/reels.api";
import { adminsApi } from "../../../services/admins/admins.api";

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    movies: 0,
    series: 0,
    channels: 0,
    reels: 0,
    admins: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [moviesRes, seriesRes, channelsRes, reelsRes, adminsRes] =
        await Promise.allSettled([
          moviesApi.list(),
          seriesApi.list(),
          tvChannelsApi.list(),
          reelsApi.list(),
          adminsApi.list(),
        ]);

      const getCount = (result) => {
        if (result.status !== "fulfilled") return 0;
        const payload = result.value?.data?.data ?? result.value?.data;
        const list =
          payload?.items ||
          payload?.movies ||
          payload?.series ||
          payload?.channels ||
          payload?.reels ||
          payload?.admins ||
          payload ||
          [];
        return Array.isArray(list) ? list.length : 0;
      };

      setStats({
        movies: getCount(moviesRes),
        series: getCount(seriesRes),
        channels: getCount(channelsRes),
        reels: getCount(reelsRes),
        admins: getCount(adminsRes),
      });
    } catch (e) {
      console.error("Failed to load stats:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    {
      titleKey: "dashboard.totalMovies",
      value: stats.movies,
      icon: "🎬",
      color: "bg-blue-500/20 text-blue-500",
    },
    {
      titleKey: "dashboard.totalSeries",
      value: stats.series,
      icon: "📺",
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      titleKey: "dashboard.tvChannels",
      value: stats.channels,
      icon: "📡",
      color: "bg-green-500/20 text-green-500",
    },
    {
      titleKey: "dashboard.reels",
      value: stats.reels,
      icon: "🎥",
      color: "bg-orange-500/20 text-orange-500",
    },
    {
      titleKey: "dashboard.admins",
      value: stats.admins,
      icon: "👥",
      color: "bg-pink-500/20 text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t('dashboard.description')}
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-sm text-[var(--muted)]">{t('dashboard.loadingStats')}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">{t(stat.titleKey)}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`text-3xl p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.welcome')}</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            {t('dashboard.welcomeText')}
          </p>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>&#10003; {t('dashboard.manageMovies')}</li>
            <li>&#10003; {t('dashboard.manageReelsShort')}</li>
            <li>&#10003; {t('dashboard.controlRoles')}</li>
            <li>&#10003; {t('dashboard.manageAdminAccounts')}</li>
            <li>&#10003; {t('dashboard.organizeCategories')}</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
          <div className="space-y-2">
            <Link
              to="/movies"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              🎬 {t('dashboard.browseMovies')}
            </Link>
            <Link
              to="/series"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              📺 {t('dashboard.browseSeries')}
            </Link>
            <Link
              to="/reels"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              🎥 {t('dashboard.manageReels')}
            </Link>
            <Link
              to="/admins"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              👥 {t('dashboard.manageAdmins')}
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">{t('dashboard.importantNotes')}</h2>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p>
            <strong>{t('dashboard.readOnlyNote')}</strong>
          </p>
          <p>
            <strong>{t('dashboard.fullCrudNote')}</strong>
          </p>
          <p>
            <strong>{t('dashboard.futureNote')}</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
