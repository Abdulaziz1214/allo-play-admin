import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { rolesApi } from "../../../services/roles/roles.api";

const RolesPage = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await rolesApi.list();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.roles || payload || [];
      setRoles(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function onCreate() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setIsCreating(true);
    setError("");
    try {
      await rolesApi.create({ name: trimmedName, description: description.trim() || undefined });
      setName("");
      setDescription("");
      await loadRoles();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function onUpdate() {
    if (!editingRole) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setIsUpdating(true);
    setError("");
    try {
      await rolesApi.update(editingRole.id, { name: trimmedName, description: description.trim() || undefined });
      setName("");
      setDescription("");
      setEditingRole(null);
      await loadRoles();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function onDelete(roleId) {
    if (!confirm(t('roles.deleteConfirm'))) return;
    setError("");
    try {
      await rolesApi.delete(roleId);
      await loadRoles();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function startEdit(role) {
    setEditingRole(role);
    setName(role.name || "");
    setDescription(role.description || "");
  }

  function cancelEdit() {
    setEditingRole(null);
    setName("");
    setDescription("");
  }

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const columns = [
    {
      key: "name",
      header: t('roles.roleName'),
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "description",
      header: t('common.description'),
      cell: (row) => <span className="text-[var(--muted)]">{row.description || "—"}</span>,
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
          <h1 className="text-2xl font-semibold">{t('roles.title')}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{t('roles.description')}</p>
        </div>
        <div className="space-y-3 max-w-2xl">
          <Input
            label={t('roles.roleName')}
            placeholder={t('roles.roleNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={t('roles.descriptionLabel')}
            placeholder={t('roles.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            {editingRole ? (
              <>
                <Button variant="primary" onClick={onUpdate} disabled={isUpdating || !name.trim()}>
                  {isUpdating ? t('roles.updating') : t('roles.updateRole')}
                </Button>
                <Button variant="secondary" onClick={cancelEdit}>{t('common.cancel')}</Button>
              </>
            ) : (
              <Button variant="primary" onClick={onCreate} disabled={isCreating || !name.trim()}>
                {isCreating ? t('roles.creating') : t('roles.createRole')}
              </Button>
            )}
          </div>
        </div>
      </Card>
      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">{t('roles.loadingRoles')}</div>
        ) : (
          <Table columns={columns} data={roles} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default RolesPage;
