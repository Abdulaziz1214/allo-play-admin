import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { adminsApi } from "../../../services/admins/admins.api";
import { rolesApi } from "../../../services/roles/roles.api";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Create/Edit form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadAdmins() {
    setIsLoading(true);
    setError("");
    try {
      const res = await adminsApi.list();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.admins || payload || [];
      setAdmins(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load admins");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const res = await rolesApi.list();
      const payload = res.data?.data ?? res.data;
      const list = payload?.items || payload?.roles || payload || [];
      setRoles(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to load roles:", e);
    }
  }

  async function onCreate() {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUsername || !trimmedEmail || !password) {
      setError("Username, email, and password are required");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await adminsApi.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password: password,
        role_ids: selectedRoles,
      });
      resetForm();
      await loadAdmins();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to create admin");
    } finally {
      setIsCreating(false);
    }
  }

  async function onUpdate() {
    if (!editingAdmin) return;

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUsername || !trimmedEmail) {
      setError("Username and email are required");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const updateData = {
        username: trimmedUsername,
        email: trimmedEmail,
      };

      // Only include password if it was changed
      if (password) {
        updateData.password = password;
      }

      await adminsApi.update(editingAdmin.id, updateData);

      // Update roles separately if changed
      if (selectedRoles.length > 0) {
        await adminsApi.updateRoles(editingAdmin.id, { role_ids: selectedRoles });
      }

      resetForm();
      await loadAdmins();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to update admin");
    } finally {
      setIsUpdating(false);
    }
  }

  async function onDelete(adminId) {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    setError("");
    try {
      await adminsApi.delete(adminId);
      await loadAdmins();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to delete admin");
    }
  }

  async function toggleStatus(admin) {
    setError("");
    try {
      const newStatus = admin.is_active ? "inactive" : "active";
      await adminsApi.updateStatus(admin.id, { status: newStatus });
      await loadAdmins();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to update status");
    }
  }

  function startEdit(admin) {
    setEditingAdmin(admin);
    setUsername(admin.username || "");
    setEmail(admin.email || "");
    setPassword("");
    setSelectedRoles(admin.roles?.map((r) => r.id) || []);
  }

  function resetForm() {
    setEditingAdmin(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setSelectedRoles([]);
  }

  useEffect(() => {
    loadAdmins();
    loadRoles();
  }, []);

  const columns = [
    {
      key: "username",
      header: "Username",
      cell: (row) => <span className="font-medium">{row.username}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span className="text-[var(--muted)]">{row.email}</span>,
    },
    {
      key: "roles",
      header: "Roles",
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.roles?.map((role) => (
            <span
              key={role.id}
              className="px-2 py-1 text-xs bg-[var(--surface-2)] rounded"
            >
              {role.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            row.is_active
              ? "bg-green-500/20 text-green-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
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
            className="px-3 py-1 text-xs"
            onClick={() => toggleStatus(row)}
          >
            {row.is_active ? "Deactivate" : "Activate"}
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
          <h1 className="text-2xl font-semibold">Admins Management</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Create and manage admin users with role assignments.
          </p>
        </div>

        <div className="space-y-3 max-w-2xl">
          <Input
            label="Username"
            placeholder="e.g. john_admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="e.g. john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={editingAdmin ? "Password (leave empty to keep current)" : "Password"}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Roles</label>
            <div className="flex gap-2 flex-wrap">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-2)] rounded cursor-pointer hover:bg-[var(--surface)] transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role.id]);
                      } else {
                        setSelectedRoles(selectedRoles.filter((id) => id !== role.id));
                      }
                    }}
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {editingAdmin ? (
              <>
                <Button
                  variant="primary"
                  onClick={onUpdate}
                  disabled={isUpdating || !username.trim() || !email.trim()}
                >
                  {isUpdating ? "Updating..." : "Update Admin"}
                </Button>
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={onCreate}
                disabled={isCreating || !username.trim() || !email.trim() || !password}
              >
                {isCreating ? "Creating..." : "Create Admin"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

        {isLoading ? (
          <div className="text-sm text-[var(--muted)]">Loading admins...</div>
        ) : (
          <Table columns={columns} data={admins} rowKey={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default AdminsPage;