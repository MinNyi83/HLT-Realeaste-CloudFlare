import React, { useMemo } from 'react';
import { TrendingUp, PieChart, BarChart3, Map as MapIcon, DollarSign, Building2 } from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';

export const AnalyticsView = ({ stats }) => {
    const { typeDistribution = [], wardAverages = [], totalPortfolioValue = 0 } = stats;

    const maxTypeCount = useMemo(() => Math.max(...typeDistribution.map(t => t.count), 1), [typeDistribution]);
    const maxWardPrice = useMemo(() => Math.max(...wardAverages.map(w => w.avg_price), 1), [wardAverages]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div>
                <h2 className="text-3xl font-black dark:text-white tracking-tight leading-tight">Market Analytics</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">Data-driven insights into property distributions and pricing</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Property Type Distribution */}
                <Card className="p-5 sm:p-8 border-0 shadow-2xl shadow-indigo-500/5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="p-2 bg-indigo-500 rounded-lg sm:rounded-xl text-white">
                            <PieChart size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black dark:text-white tracking-tight uppercase">Inventory Mix</h3>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {typeDistribution.map((t, idx) => (
                            <div key={idx} className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        <span className="font-bold text-xs sm:text-sm dark:text-slate-300">{t.type}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.count} Listings</span>
                                </div>
                                <div className="h-2 sm:h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        style={{ width: `${(t.count / maxTypeCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {typeDistribution.length === 0 && (
                            <div className="py-10 text-center text-slate-400 font-bold italic">No data available yet</div>
                        )}
                    </div>
                </Card>

                {/* Pricing by Ward */}
                <Card className="p-5 sm:p-8 border-0 shadow-2xl shadow-indigo-500/5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="p-2 bg-emerald-500 rounded-lg sm:rounded-xl text-white">
                            <BarChart3 size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black dark:text-white tracking-tight uppercase">Ward Pricing</h3>
                    </div>

                    <div className="space-y-4">
                        {wardAverages.map((w, idx) => (
                            <div key={idx} className="group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 text-xs font-black text-slate-400 uppercase tracking-tighter">WD {w.ward}</div>
                                    <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700/50 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${(w.avg_price / maxWardPrice) * 100}%` }}
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            <span className="text-[10px] font-black dark:text-white drop-shadow-md">
                                                {Number(w.avg_price).toFixed(1)}M
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {wardAverages.length === 0 && (
                            <div className="py-10 text-center text-slate-400 font-bold italic">No pricing trends found</div>
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <TrendingUp className="mb-4 opacity-50" size={32} />
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Portfolio Velocity</div>
                    <div className="text-3xl font-black">Stable</div>
                    <p className="text-[10px] mt-2 opacity-70">Based on recent listing activity</p>
                </Card>

                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <DollarSign className="mb-4 opacity-50" size={32} />
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Market Cap</div>
                    <div className="text-3xl font-black">{Number(totalPortfolioValue).toLocaleString()}M</div>
                    <p className="text-[10px] mt-2 opacity-70">Combined value of all active properties</p>
                </Card>

                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                    <Building2 className="mb-4 opacity-50" size={32} />
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Agent Efficiency</div>
                    <div className="text-3xl font-black">High</div>
                    <p className="text-[10px] mt-2 opacity-70">Turnover rate optimized across types</p>
                </Card>
            </div>
        </div>
    );
};
