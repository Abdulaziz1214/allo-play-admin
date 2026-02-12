import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth.store';
import { navItems } from '../config/navItems';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
    const { t } = useTranslation();
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const hasPermission = useAuthStore((s) => s.hasPermission);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[var(--surface)] border-r border-[var(--border)] p-5 flex flex-col">
                <div>
                    <div className="text-lg font-semibold tracking-wide">ALLO PLAY Admin</div>
                    <div className="text-xs text-[var(--muted)] mt-1">Content Management</div>
                </div>

                <nav className="mt-6 space-y-6 text-sm flex-1 overflow-y-auto">
                    {navItems.map((group) => {
                        // оставляем только доступные пункты
                        const visibleItems = group.items.filter((item) => {
                            if (!item.permission) return true;
                            return hasPermission(item.permission);
                        });

                        // если в группе ничего не видно — группу не показываем
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.section}>
                                <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                                    {group.section}
                                </div>

                                <div className="flex flex-col gap-1">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                [
                                                    "px-3 py-2 rounded-lg transition",
                                                    isActive
                                                        ? "bg-[var(--surface-2)] text-white"
                                                        : "hover:bg-[var(--surface-2)] text-[var(--text)]",
                                                ].join(" ")
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="w-full text-sm px-3 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[#222235] transition"
                    >
                        {t('auth.logout')}
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
