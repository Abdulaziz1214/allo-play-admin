import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { genresApi } from "../../../services/genres/genres.api";

const CategoriesPage = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await genresApi.list();
            const payload = res.data?.data ?? res.data;
            const list = payload?.items || payload?.genres || payload || [];
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || t('categories.failedToLoad'));
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    async function onCreate() {
        const trimmed = name.trim();
        if (!trimmed) return;
        setIsCreating(true);
        setError("");
        try {
            await genresApi.create({ name: trimmed });
            setName("");
            await load();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || t('categories.failedToCreate'));
        } finally {
            setIsCreating(false);
        }
    }

    useEffect(() => {
        load();
    }, [load]);

    const columns = [
        { key: "name", header: t('categories.name') },
        {
            key: "id",
            header: t('common.id'),
            cell: (row) => (
                <span className="text-xs text-[var(--muted)]">{row.id}</span>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Card className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
                    <p className="text-sm text-[var(--muted)] mt-1">
                        {t('categories.description')}
                    </p>
                </div>

                <div className="flex gap-3 items-end w-full max-w-xl">
                    <div className="flex-1">
                        <Input
                            label={t('categories.newCategory')}
                            placeholder={t('categories.placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && onCreate()}
                        />
                    </div>
                    <Button
                        variant="primary"
                        className="h-[46px]"
                        onClick={onCreate}
                        disabled={isCreating || !name.trim()}
                    >
                        {isCreating ? t('categories.creating') : t('categories.add')}
                    </Button>
                </div>
            </Card>

            <Card>
                {error ? (
                    <div className="text-sm text-[var(--primary)] mb-3">{error}</div>
                ) : null}

                {isLoading ? (
                    <div className="text-sm text-[var(--muted)]">{t('categories.loadingCategories')}</div>
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
