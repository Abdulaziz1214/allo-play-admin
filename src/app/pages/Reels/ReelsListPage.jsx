import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { reelsApi } from "../../../services/reels/reels.api";

const ReelsListPage = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Create/Edit form
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingReel, setEditingReel] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadReels() {
    setIsLoading(true);
    setError("");
    try {
      const res = await reelsApi.list();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.reels || payload || [];
      setReels(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load reels");
      setReels([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function onCreate() {
    const trimmedTitle = title.trim();
    const trimmedUrl = videoUrl.trim();

    if (!trimmedUrl) {
      setError("Video URL is required");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await reelsApi.create({
        video_url: trimmedUrl,
        title: trimmedTitle || undefined,
        description: description.trim() || undefined,
      });
      resetForm();
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to create reel");
    } finally {
      setIsCreating(false);
    }
  }

  async function onUpdate() {
    if (!editingReel) return;

    const trimmedTitle = title.trim();
    const trimmedUrl = videoUrl.trim();

    if (!trimmedUrl) {
      setError("Video URL is required");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      await reelsApi.update(editingReel.id, {
        video_url: trimmedUrl,
        title: trimmedTitle || undefined,
        description: description.trim() || undefined,
      });
      resetForm();
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to update reel");
    } finally {
      setIsUpdating(false);
    }
  }

  async function onDelete(reelId) {
    if (!confirm("Are you sure you want to delete this reel?")) return;

    setError("");
    try {
      await reelsApi.delete(reelId);
      await loadReels();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to delete reel");
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
  }, []);

  const columns = [
    {
      key: "video",
      header: "Preview",
      cell: (row) => (
        <div className="w-16 h-16 bg-[var(--surface-2)] rounded overflow-hidden">
          {row.thumbnail_url ? (
            <img
              src={row.thumbnail_url}
              alt="Reel thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--muted)]">
              No preview
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => (
        <span className="font-medium">{row.title || "Untitled Reel"}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => (
        <span className="text-[var(--muted)] text-sm">
          {row.description ? (
            row.description.length > 50
              ? `${row.description.substring(0, 50)}...`
              : row.description
          ) : (
            "—"
          )}
        </span>
      ),
    },
    {
      key: "linked_content",
      header: "Linked To",
      cell: (row) => {
        const movies = row.linked_movies || [];
        const episodes = row.linked_episodes || [];
        const total = movies.length + episodes.length;

        if (total === 0) {
          return <span className="text-xs text-[var(--muted)]">Not linked</span>;
        }

        return (
          <div className="text-xs text-[var(--muted)]">
            {movies.length > 0 && <div>{movies.length} movie(s)</div>}
            {episodes.length > 0 && <div>{episodes.length} episode(s)</div>}
          </div>
        );
      },
    },
    {
      key: "id",
      header: "ID",
      cell: (row) => <span className="text-xs text-[var(--muted)]">{row.id}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="px-3 py-1 text-xs"
            onClick={() => startEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            className="px-3 py-1 text-xs text-red-500 hover:bg-red-500/10"
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Reels Management</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Create and manage short-form video content (Reels).
          </p>
        </div>

        <div className="space-y-3 max-w-2xl">
          <Input
            label="Video URL"
            placeholder="https://example.com/video.mp4 or .m3u8"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Input
            label="Title (optional)"
            placeholder="e.g. Behind the Scenes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm"
              rows={3}
              placeholder="Brief description of the reel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {editingReel ? (
              <>
                <Button
                  variant="primary"
                  onClick={onUpdate}
                  disabled={isUpdating || !videoUrl.trim()}
                >
                  {isUpdating ? "Updating..." : "Update Reel"}
                </Button>
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={onCreate}
                disabled={isCreating || !videoUrl.trim()}
              >
                {isCreating ? "Creating..." : "Create Reel"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">Loading reels...</div>
        ) : (
          <Table columns={columns} data={reels} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default ReelsListPage;
