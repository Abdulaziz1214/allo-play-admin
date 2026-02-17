import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { tvChannelsApi } from "../../../services/tvChannels/tvChannels.api";

const TVChannelsPage = () => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const isInitialMount = useRef(true);

  const loadChannels = useCallback(async (category) => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (category) params.category_id = category;
      const res = await tvChannelsApi.list(params);
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.channels || payload || [];
      setChannels(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setChannels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await tvChannelsApi.getCategories();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.categories || payload || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadChannels("");
  }, [loadCategories, loadChannels]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadChannels(selectedCategory);
  }, [selectedCategory, loadChannels]);

  function handleClearFilter() {
    setSelectedCategory("");
  }

  const columns = [
    {
      key: "logo",
      header: t('tvChannels.logo'),
      cell: (row) => (
        <div className="w-16 h-16 bg-[var(--surface-2)] rounded overflow-hidden flex items-center justify-center">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="w-full h-full object-contain p-1" />
          ) : (
            <div className="text-xs text-[var(--muted)]">{t('tvChannels.noLogo')}</div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: t('tvChannels.channelName'),
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "category",
      header: t('tvChannels.category'),
      cell: (row) => (
        <span className="px-2 py-1 text-xs bg-[var(--surface-2)] rounded">
          {row.category?.name || row.category || "—"}
        </span>
      ),
    },
    {
      key: "stream_url",
      header: t('tvChannels.stream'),
      cell: (row) => (
        <div className="text-xs text-[var(--muted)] max-w-xs truncate">
          {row.stream_url ? (
            <a href={row.stream_url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] underline">
              {row.stream_url}
            </a>
          ) : "—"}
        </div>
      ),
    },
    {
      key: "status",
      header: t('common.status'),
      cell: (row) => {
        const isActive = row.is_active !== false;
        return (
          <span className={`px-2 py-1 text-xs rounded ${isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
            {isActive ? t('common.active') : t('common.inactive')}
          </span>
        );
      },
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
          <h1 className="text-2xl font-semibold">{t('tvChannels.title')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{t('tvChannels.description')}</p>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="w-64">
              <label className="block text-sm font-medium mb-2">{t('tvChannels.filterByCategory')}</label>
              <select
                className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--text)]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">{t('tvChannels.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <Button variant="secondary" onClick={handleClearFilter} className="h-[46px]">
              {t('tvChannels.clearFilter')}
            </Button>
          </div>
          <div className="text-xs text-[var(--muted)]">{t('movies.readOnlyInfo')}</div>
        </div>
      </Card>
      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">{t('tvChannels.loadingChannels')}</div>
        ) : (
          <Table columns={columns} data={channels} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default TVChannelsPage;
