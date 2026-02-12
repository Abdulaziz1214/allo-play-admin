import React, { useEffect, useState } from 'react'
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { genresApi } from "../../../services/genres/genres.api";


const CategoriesPage = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // create form
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function load() {
        setIsLoading(true);
        setError("");
        try {
            const res = await genresApi.list();
            const payload = res.data?.data ?? res.data;

            // разные бэки по-разному называют список
            const list = payload?.items || payload?.genres || payload || [];
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to load categories");
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function onCreate() {
        const trimmed = name.trim();
        if (!trimmed) return;

        setIsCreating(true);
        setError("");

        try {
            // чаще всего name
            await genresApi.create({ name: trimmed });
            setName("");
            await load();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to create category");
        } finally {
            setIsCreating(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const columns = [
        { key: "name", header: "Name" },
        {
            key: "id",
            header: "ID",
            cell: (row) => (
                <span className="text-xs text-[var(--muted)]">{row.id}</span>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Card className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <p className="text-sm text-[var(--muted)] mt-1">
                        Управление категориями (genres).
                    </p>
                </div>

                <div className="flex gap-3 items-end w-full max-w-xl">
                    <div className="flex-1">
                        <Input
                            label="New category"
                            placeholder="e.g. Action"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="h-[46px]"
                        onClick={onCreate}
                        disabled={isCreating || !name.trim()}
                    >
                        {isCreating ? "Creating..." : "Add"}
                    </Button>
                </div>
            </Card>

            <Card>
                {error ? (
                    <div className="text-sm text-[var(--primary)] mb-3">{error}</div>
                ) : null}

                {isLoading ? (
                    <div className="text-sm text-[var(--muted)]">Loading...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={items}
                        rowKey={(row) => row.id || row.name}
                    />
                )}
            </Card>
        </div>
    );
}

export default CategoriesPage
