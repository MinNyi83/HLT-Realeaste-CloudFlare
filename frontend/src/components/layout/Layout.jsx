import React, { useState } from 'react';
import {
    LayoutDashboard, Building2, Users, LogOut, Wifi, WifiOff, RefreshCw,
    Menu, X, Sun, Moon, Plus, Download, Search, Heart, Shield, TrendingUp, LogIn
} from 'lucide-react';
import { Button } from '../common/UI';

export const Layout = ({
    children,
    user,
    currentPage,
    setCurrentPage,
    isOnline,
    isSyncing,
    syncQueue,
    darkMode,
    setDarkMode,
    handleLogout
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Network Status Bar */}
            <div className={`fixed top-0 left-0 right-0 h-1 z-50 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 border-r dark:border-slate-700 transition-all duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col pt-[var(--sat)]`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center justify-start w-full">
                        <img src="/logo.svg" alt="HTEIN LIN THAR" className="h-10 w-auto" />
                    </div>
                    <Button variant="ghost" className="md:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </Button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-[calc(1.5rem+var(--sab))]">
                    <Button
                        variant={currentPage === 'dashboard' ? 'primary' : 'ghost'}
                        className="w-full justify-start h-12 px-4 font-bold"
                        icon={LayoutDashboard}
                        onClick={() => { setCurrentPage('dashboard'); setIsSidebarOpen(false); }}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={currentPage === 'analytics' ? 'primary' : 'ghost'}
                        className="w-full justify-start h-12 px-4 font-bold"
                        icon={TrendingUp}
                        onClick={() => { setCurrentPage('analytics'); setIsSidebarOpen(false); }}
                    >
                        Analytics
                    </Button>
                    <Button
                        variant={currentPage === 'properties' ? 'primary' : 'ghost'}
                        className="w-full justify-start h-12 px-4 font-bold"
                        icon={Building2}
                        onClick={() => { setCurrentPage('properties'); setIsSidebarOpen(false); }}
                    >
                        Listings
                    </Button>

                    <Button
                        variant={currentPage === 'favorites' ? 'primary' : 'ghost'}
                        className="w-full justify-start h-12 px-4 font-bold"
                        icon={Heart}
                        onClick={() => { setCurrentPage('favorites'); setIsSidebarOpen(false); }}
                    >
                        Favorites
                    </Button>
                    {user?.role === 'admin' && (
                        <>
                            <Button
                                variant={currentPage === 'users' ? 'primary' : 'ghost'}
                                className="w-full justify-start h-12 px-4 font-bold"
                                icon={Users}
                                onClick={() => { setCurrentPage('users'); setIsSidebarOpen(false); }}
                            >
                                Access Control
                            </Button>
                            <Button
                                variant={currentPage === 'audit-logs' ? 'primary' : 'ghost'}
                                className="w-full justify-start h-12 px-4 font-bold"
                                icon={Shield}
                                onClick={() => { setCurrentPage('audit-logs'); setIsSidebarOpen(false); }}
                            >
                                Security Audit
                            </Button>
                        </>
                    )}

                    <div className="pt-6 mt-6 border-t dark:border-slate-700">
                        <div className="px-4 py-3 flex items-center gap-3 text-sm font-medium rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            {isOnline ? <Wifi size={18} className="text-emerald-500" /> : <WifiOff size={18} className="text-rose-500" />}
                            <span className={isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                                {isOnline ? 'System Online' : 'Offline Mode'}
                            </span>
                        </div>

                        {syncQueue.length > 0 && (
                            <div className="px-4 py-3 mt-2 flex items-center gap-3 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                {syncQueue.length} Changes Pending
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-auto">
                        {user ? (
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-bold h-12 px-4"
                                icon={LogOut}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-full justify-start font-bold h-12 px-4 shadow-lg shadow-indigo-500/20"
                                icon={LogIn}
                                onClick={() => window.location.reload()}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="flex flex-col border-b dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-10 transition-all duration-300">
                    <div className="h-[var(--sat)] w-full" />
                    <div className="h-16 flex items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Button variant="ghost" className="md:hidden p-2 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                                <Menu size={24} />
                            </Button>
                            <h1 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white capitalize">{currentPage.replace('-', ' ')}</h1>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <Button variant="ghost" className="p-2 rounded-full" onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                            </Button>
                            {user && (
                                <div className="flex items-center gap-2 sm:pl-4 sm:border-l dark:border-slate-700 ml-1 sm:ml-2">
                                    {user.picture ? (
                                        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                    )}
                                    <div className="hidden lg:block text-left">
                                        <div className="text-sm font-medium">{user.name}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{user.role}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar pb-[calc(2rem+var(--sab))]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
