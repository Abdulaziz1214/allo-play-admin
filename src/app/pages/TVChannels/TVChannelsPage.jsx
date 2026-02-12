import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { tvChannelsApi } from "../../../services/tvChannels/tvChannels.api";

const TVChannelsPage = () => {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter
  const [selectedCategory, setSelectedCategory] = useState("");

  async function loadChannels() {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (selectedCategory) {
        params.category_id = selectedCategory;
      }

      const res = await tvChannelsApi.list(params);
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.channels || payload || [];
      setChannels(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load TV channels");
      setChannels([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await tvChannelsApi.getCategories();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.categories || payload || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadChannels();
  }, [selectedCategory]);

  function handleClearFilter() {
    setSelectedCategory("");
  }

  const columns = [
    {
      key: "logo",
      header: "Logo",
      cell: (row) => (
        <div className="w-16 h-16 bg-[var(--surface-2)] rounded overflow-hidden flex items-center justify-center">
          {row.logo_url ? (
            <img
              src={row.logo_url}
              alt={row.name}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <div className="text-xs text-[var(--muted)]">No logo</div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Channel Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => (
        <span className="px-2 py-1 text-xs bg-[var(--surface-2)] rounded">
          {row.category?.name || row.category || "—"}
        </span>
      ),
    },
    {
      key: "stream_url",
      header: "Stream",
      cell: (row) => (
        <div className="text-xs text-[var(--muted)] max-w-xs truncate">
          {row.stream_url ? (
            <a
              href={row.stream_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--primary)] underline"
            >
              {row.stream_url}
            </a>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const isActive = row.is_active !== false;
        return (
          <span
            className={`px-2 py-1 text-xs rounded ${
              isActive
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
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
          <h1 className="text-2xl font-semibold">TV Channels</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Browse all TV channels in the platform (Read-only view).
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="w-64">
              <label className="block text-sm font-medium mb-2">
                Filter by Category
              </label>
              <select
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={handleClearFilter}
              className="h-[46px]"
            >
              Clear Filter
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
          <div className="text-sm text-[var(--muted)]">Loading TV channels...</div>
        ) : (
          <Table columns={columns} data={channels} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default TVChannelsPage;
