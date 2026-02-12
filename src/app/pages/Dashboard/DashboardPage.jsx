import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { moviesApi } from "../../../services/movies/movies.api";
import { seriesApi } from "../../../services/series/series.api";
import { tvChannelsApi } from "../../../services/tvChannels/tvChannels.api";
import { reelsApi } from "../../../services/reels/reels.api";
import { adminsApi } from "../../../services/admins/admins.api";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    movies: 0,
    series: 0,
    channels: 0,
    reels: 0,
    admins: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  async function loadStats() {
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
  }

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Movies",
      value: stats.movies,
      icon: "🎬",
      color: "bg-blue-500/20 text-blue-500",
    },
    {
      title: "Total Series",
      value: stats.series,
      icon: "📺",
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      title: "TV Channels",
      value: stats.channels,
      icon: "📡",
      color: "bg-green-500/20 text-green-500",
    },
    {
      title: "Reels",
      value: stats.reels,
      icon: "🎥",
      color: "bg-orange-500/20 text-orange-500",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: "👥",
      color: "bg-pink-500/20 text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Overview of platform statistics and content.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-sm text-[var(--muted)]">Loading statistics...</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--muted)] mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`text-3xl p-3 rounded-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Welcome to Allo Play Admin</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            This is your admin dashboard for managing the Allo Play OTT platform.
          </p>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>✅ Manage movies, series, and TV channels</li>
            <li>✅ Create and manage reels (short videos)</li>
            <li>✅ Control user roles and permissions</li>
            <li>✅ Manage admin accounts</li>
            <li>✅ Organize content categories</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/movies"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              📽️ Browse Movies
            </a>
            <a
              href="/series"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              📺 Browse Series
            </a>
            <a
              href="/reels"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              🎥 Manage Reels
            </a>
            <a
              href="/admins"
              className="block p-3 bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-lg transition text-sm"
            >
              👥 Manage Admins
            </a>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-3">📌 Important Notes</h2>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p>
            ⚠️ <strong>Movies, Series, and TV Channels:</strong> Admin CRUD endpoints
            are not yet available in the API. These pages show read-only data from
            public endpoints.
          </p>
          <p>
            ✅ <strong>Full CRUD Available:</strong> Reels, Roles, Admins, and
            Categories have complete admin management functionality.
          </p>
          <p>
            🔧 <strong>Future Features:</strong> User management, subscriptions,
            transactions, and push notifications will be added when backend APIs are
            ready.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
