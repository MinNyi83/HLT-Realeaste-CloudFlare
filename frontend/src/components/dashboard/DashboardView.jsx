import React from 'react';
import { Building2, Activity, Users, DollarSign, RefreshCw, Search } from 'lucide-react';
import { Card, Button } from '../common/UI';
import { FilterBar } from '../properties/FilterBar';
import { PropertyCard } from '../properties/PropertyCard';

export const DashboardView = ({ stats, properties, filteredProperties, filters, setFilters, onRefresh, onPropertyClick, userRole }) => {
    const dashboardStats = [
        { label: "Total Properties", value: stats.totalProperties, icon: Building2, color: "bg-blue-500" },
        { label: "Active Listings", value: stats.activeListings, icon: Activity, color: "bg-emerald-500" },
        { label: "Total Agents", value: stats.totalAgents, icon: Users, color: "bg-indigo-500" },
        { label: "Portfolio Value", value: `${(Number(stats.totalPortfolioValue || 0) / 1000).toFixed(1)}B`, icon: DollarSign, color: "bg-amber-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Dashboard Overview</h2>
                <Button icon={RefreshCw} onClick={onRefresh} variant="ghost" className="text-sm text-slate-500">Refresh</Button>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {dashboardStats.map((stat, idx) => (
                    <Card key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left">
                        <div className={`p-2.5 sm:p-3 rounded-lg ${stat.color} text-white mb-3 sm:mb-0`}> <stat.icon size={20} className="sm:w-6 sm:h-6" /> </div>
                        <div>
                            <p className="text-[10px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter sm:tracking-normal">{stat.label}</p>
                            <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0 sm:mt-1">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="pt-8 border-t dark:border-slate-800">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Quick Property Search</h3>
                        <p className="text-slate-500 text-sm mt-1">Find and browse listings directly from your dashboard</p>
                    </div>
                </div>

                <FilterBar filters={filters} setFilters={setFilters} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.slice(0, 6).map(p => (
                        <PropertyCard
                            key={p.id}
                            p={p}
                            onClick={() => onPropertyClick(p)}
                            userRole={userRole}
                        />
                    ))}
                </div>

                {filteredProperties.length === 0 && (
                    <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <Search className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold dark:text-white">No properties match your filters</h3>
                        <p className="text-slate-500">Try adjusting your dashboard search criteria.</p>
                        <Button variant="ghost" className="mt-4 text-indigo-600" onClick={() => setFilters({ search: "", ward: "", type: "", status: "", minPrice: "", maxPrice: "" })}>Reset Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
