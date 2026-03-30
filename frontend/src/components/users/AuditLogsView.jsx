import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Shield, Clock, User, Activity, Search, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '../common/UI';

export const AuditLogsView = ({ API_BASE_URL }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/logs`, { credentials: 'include' });
            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
        setIsLoading(false);
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.details?.toLowerCase().includes(search.toLowerCase())
    );

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return 'success';
        if (action.includes('UPDATE')) return 'warning';
        if (action.includes('DELETE')) return 'danger';
        return 'neutral';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black dark:text-white tracking-tight leading-tight">Security Audit</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Real-time log of administrative and sensitive actions</p>
                </div>
                <Button icon={RefreshCw} onClick={fetchLogs} loading={isLoading} variant="secondary" className="text-xs h-10 px-4 font-black uppercase tracking-widest">
                    Refresh Logs
                </Button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs by action, user, or details..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-2xl shadow-indigo-500/5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actor</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <Shield className="mx-auto text-slate-200 mb-4" size={48} />
                                        <div className="text-lg font-black text-slate-400">No audit logs found</div>
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs">
                                            <Clock size={14} className="text-indigo-400" />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <User size={14} />
                                            </div>
                                            <span className="font-black dark:text-white text-sm">{log.user_name || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <Badge variant={getActionColor(log.action)} className="font-black uppercase text-[10px]">
                                            {log.action.replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 italic text-sm text-slate-500 dark:text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">
                                        {log.details}
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
