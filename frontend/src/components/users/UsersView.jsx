import React, { useState, useMemo } from 'react';
import { RefreshCw, Users, Trash2 } from 'lucide-react';
import { Card, Button, Badge } from '../common/UI';

export const UsersView = ({ users, currentUser, onRefresh, onUpdateRole, onBlock, onDelete }) => {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Users', count: users.length },
        { id: 'online', label: 'Online', count: users.filter(u => u.last_seen_at && (new Date() - new Date(u.last_seen_at)) < 120000).length },
        { id: 'active', label: 'Active', count: users.filter(u => u.is_blocked !== 1).length },
        { id: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length },
        { id: 'agent', label: 'Agents', count: users.filter(u => u.role === 'agent').length },
        { id: 'user', label: 'Users', count: users.filter(u => u.role === 'user').length },
    ];

    const filteredUsers = useMemo(() => {
        const now = new Date();
        if (activeTab === 'all') return users;
        if (activeTab === 'online') return users.filter(u => u.last_seen_at && (now - new Date(u.last_seen_at)) < 120000);
        if (activeTab === 'active') return users.filter(u => u.is_blocked !== 1);
        return users.filter(u => u.role === activeTab);
    }, [users, activeTab]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black dark:text-white tracking-tight leading-tight">Access Control</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage platform permissions and user status</p>
                </div>
                <Button icon={RefreshCw} onClick={onRefresh} variant="secondary" className="text-xs h-10 px-4 font-black uppercase tracking-widest">Refresh Data</Button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xl shadow-indigo-500/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        {tab.label} <span className="ml-2 py-0.5 px-2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] opacity-60">{tab.count}</span>
                    </button>
                ))}
            </div>

            <Card className="overflow-hidden border-0 shadow-2xl shadow-indigo-500/5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status & Role</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center">
                                        <Users className="mx-auto text-slate-200 mb-4" size={48} />
                                        <div className="text-lg font-black text-slate-400">No users found in this category</div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {u.picture ? (
                                                    <img src={u.picture} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700 group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600 group-hover:scale-105 transition-transform">
                                                        {u.name?.[0] || 'U'}
                                                    </div>
                                                )}
                                                {u.is_blocked === 1 ? (
                                                    <div className="absolute -bottom-1 -right-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                                                ) : (u.last_seen_at && (new Date() - new Date(u.last_seen_at)) < 120000) ? (
                                                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-800"></span>
                                                    </div>
                                                ) : (
                                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black dark:text-white text-base leading-none mb-1">{u.name || 'Incognito User'}</div>
                                                <div className="text-xs text-slate-500 font-bold tracking-tight">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={u.role === 'admin' ? 'primary' : u.role === 'agent' ? 'success' : 'neutral'} className="uppercase font-black text-[9px] tracking-tighter px-2">
                                                    {u.role?.toUpperCase() || 'USER'}
                                                </Badge>
                                                {u.is_blocked === 1 && <Badge variant="danger" className="uppercase font-black text-[9px] tracking-tighter px-2">Blocked</Badge>}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Signed up {new Date(u.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                                                <button
                                                    onClick={() => onUpdateRole(u.id, 'user')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${u.role === 'user' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                                                    disabled={u.email === currentUser.email || u.is_blocked === 1}
                                                >User</button>
                                                <button
                                                    onClick={() => onUpdateRole(u.id, 'agent')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${u.role === 'agent' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                                                    disabled={u.email === currentUser.email || u.is_blocked === 1}
                                                >Agent</button>
                                                <button
                                                    onClick={() => onUpdateRole(u.id, 'admin')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${u.role === 'admin' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                                                    disabled={u.email === currentUser.email || u.is_blocked === 1}
                                                >Admin</button>
                                            </div>

                                            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

                                            <Button
                                                variant="ghost"
                                                className={`h-9 px-3 rounded-xl text-[10px] font-black uppercase tracking-tight ${u.is_blocked === 1 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'}`}
                                                onClick={() => onBlock(u.id, u.is_blocked === 1)}
                                                disabled={u.email === currentUser.email}
                                            >
                                                {u.is_blocked === 1 ? 'Unblock' : 'Restrict'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-9 w-9 rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center p-0"
                                                onClick={() => onDelete(u.id)}
                                                disabled={u.email === currentUser.email}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
