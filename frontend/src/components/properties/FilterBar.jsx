import React from 'react';
import { Search } from 'lucide-react';
import { Card, Button } from '../common/UI';

export const FilterBar = ({ filters, setFilters }) => (
    <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-0 shadow-lg mb-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <select
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-medium"
                    value={filters.ward}
                    onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                >
                    <option value="">All Wards (Any)</option>
                    {Array.from({ length: 45 }, (_, i) => i + 1).map(w => (
                        <option key={w} value={w}>Ward {w}</option>
                    ))}
                </select>
                <select
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-medium"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Shop">Shop</option>
                </select>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t dark:border-slate-700">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price Range (M MMK)</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-24 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-xs font-bold"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        />
                        <span className="text-slate-400 text-xs font-bold">to</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-24 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-xs font-bold"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bedrooms</span>
                    <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                        {['Any', '1', '2', '3', '4+'].map(val => (
                            <button
                                key={val}
                                onClick={() => setFilters({ ...filters, bedrooms: val === 'Any' ? "" : val })}
                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${(filters.bedrooms || "Any") === val || (filters.bedrooms === "4" && val === "4+")
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Min Area (Sqft)</span>
                    <select
                        className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-xs font-bold"
                        value={filters.minArea}
                        onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                    >
                        <option value="">Any Size</option>
                        <option value="500">500+ sqft</option>
                        <option value="1000">1000+ sqft</option>
                        <option value="1500">1500+ sqft</option>
                        <option value="2000">2000+ sqft</option>
                        <option value="3000">3000+ sqft</option>
                    </select>
                </div>

                {Object.values(filters).some(v => v !== "") && (
                    <Button
                        variant="ghost"
                        className="mt-auto h-9 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                        onClick={() => setFilters({ search: "", ward: "", type: "", status: "", minPrice: "", maxPrice: "", bedrooms: "", minArea: "" })}
                    >
                        Clear All Filters
                    </Button>
                )}
            </div>
        </div>
    </Card>
);
