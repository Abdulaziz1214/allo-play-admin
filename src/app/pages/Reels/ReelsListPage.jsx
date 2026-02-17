import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { reelsApi } from "../../../services/reels/reels.api";

const ReelsListPage = () => {
  const { t } = useTranslation();
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadReels = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await reelsApi.list();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.reels || payload || [];
      setReels(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setReels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function onCreate() {
    const trimmedUrl = videoUrl.trim();
    if (!trimmedUrl) {
      setError(t('reels.videoUrlRequired'));
      return;
    }
    setIsCreating(true);
    setError("");
    try {
      await reelsApi.create({
        video_url: trimmedUrl,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      });
      resetForm();
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function onUpdate() {
    if (!editingReel) return;
    const trimmedUrl = videoUrl.trim();
    if (!trimmedUrl) {
      setError(t('reels.videoUrlRequired'));
      return;
    }
    setIsUpdating(true);
    setError("");
    try {
      await reelsApi.update(editingReel.id, {
        video_url: trimmedUrl,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      });
      resetForm();
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function onDelete(reelId) {
    if (!confirm(t('reels.deleteConfirm'))) return;
    setError("");
    try {
      await reelsApi.delete(reelId);
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function startEdit(reel) {
    setEditingReel(reel);
    setTitle(reel.title || "");
    setVideoUrl(reel.video_url || "");
    setDescription(reel.description || "");
  }

  function resetForm() {
    setEditingReel(null);
    setTitle("");
    setVideoUrl("");
    setDescription("");
  }

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const columns = [
    {
      key: "video",
      header: t('reels.preview'),
      cell: (row) => (
        <div className="w-16 h-16 bg-[var(--surface-2)] rounded overflow-hidden">
          {row.thumbnail_url ? (
            <img src={row.thumbnail_url} alt="Reel" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--muted)]">
              {t('reels.noPreview')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: t('common.title'),
      cell: (row) => <span className="font-medium">{row.title || t('reels.untitledReel')}</span>,
    },
    {
      key: "description",
      header: t('common.description'),
      cell: (row) => (
        <span className="text-[var(--muted)] text-sm">
          {row.description
            ? row.description.length > 50
              ? `${row.description.substring(0, 50)}...`
              : row.description
            : "—"}
        </span>
      ),
    },
    {
      key: "linked_content",
      header: t('reels.linkedTo'),
      cell: (row) => {
        const movies = row.linked_movies || [];
        const eps = row.linked_episodes || [];
        const total = movies.length + eps.length;
        if (total === 0) return <span className="text-xs text-[var(--muted)]">{t('reels.notLinked')}</span>;
        return (
          <div className="text-xs text-[var(--muted)]">
            {movies.length > 0 && <div>{movies.length} {t('reels.movies')}</div>}
            {eps.length > 0 && <div>{eps.length} {t('reels.episodes')}</div>}
          </div>
        );
      },
    },
    {
      key: "id",
      header: t('common.id'),
      cell: (row) => <span className="text-xs text-[var(--muted)]">{row.id}</span>,
    },
    {
      key: "actions",
      header: t('common.actions'),
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="px-3 py-1 text-xs" onClick={() => startEdit(row)}>
            {t('common.edit')}
          </Button>
          <Button variant="ghost" className="px-3 py-1 text-xs text-red-500 hover:bg-red-500/10" onClick={() => onDelete(row.id)}>
            {t('common.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t('reels.title')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{t('reels.description')}</p>
        </div>
        <div className="space-y-3 max-w-2xl">
          <Input
            label={t('reels.videoUrl')}
            placeholder={t('reels.videoUrlPlaceholder')}
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Input
            label={t('reels.titleLabel')}
            placeholder={t('reels.titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-2">{t('reels.descriptionLabel')}</label>
            <textarea
              className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--text)]"
              rows={3}
              placeholder={t('reels.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            {editingReel ? (
              <>
                <Button variant="primary" onClick={onUpdate} disabled={isUpdating || !videoUrl.trim()}>
                  {isUpdating ? t('reels.updating') : t('reels.updateReel')}
                </Button>
                <Button variant="secondary" onClick={resetForm}>{t('common.cancel')}</Button>
              </>
            ) : (
              <Button variant="primary" onClick={onCreate} disabled={isCreating || !videoUrl.trim()}>
                {isCreating ? t('reels.creating') : t('reels.createReel')}
              </Button>
            )}
          </div>
        </div>
      </Card>
      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">{t('reels.loadingReels')}</div>
        ) : (
          <Table columns={columns} data={reels} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default ReelsListPage;
