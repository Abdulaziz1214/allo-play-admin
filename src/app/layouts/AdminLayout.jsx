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
            <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] p-5 flex flex-col shrink-0">
                <div>
                    <div className="text-lg font-semibold tracking-wide">ALLO PLAY Admin</div>
                    <div className="text-xs text-[var(--muted)] mt-1">{t('common.contentManagement')}</div>
                </div>

                <nav className="mt-6 space-y-5 text-sm flex-1 overflow-y-auto">
                    {navItems.map((group) => {
                        const visibleItems = group.items.filter((item) => {
                            if (!item.permission) return true;
                            return hasPermission(item.permission);
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.sectionKey}>
                                <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                                    {t(`sections.${group.sectionKey}`)}
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
                                                        ? "bg-[var(--surface-2)] text-[var(--primary)] font-medium border-l-2 border-[var(--primary)]"
                                                        : "hover:bg-[var(--surface-2)] text-[var(--text)]",
                                                ].join(" ")
                                            }
                                        >
                                            {t(`nav.${item.labelKey}`)}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top header bar */}
                <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-6 py-3 flex items-center justify-end gap-3 shrink-0">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <div className="w-px h-6 bg-[var(--border)]" />
                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="text-sm px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--primary)] hover:text-white transition font-medium"
                    >
                        {t('auth.logout')}
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
