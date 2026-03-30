import React, { useMemo } from 'react';
import { Heart, Search } from 'lucide-react';
import { PropertyCard } from '../properties/PropertyCard';
import { Button } from '../common/UI';

export const BookmarksView = ({ properties, onPropertyClick, onToggleBookmark, userRole }) => {
    const bookmarkedProperties = useMemo(() => properties.filter(p => !!p.is_bookmarked), [properties]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-black dark:text-white tracking-tight leading-tight">My Favorites</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">Properties you've saved for later</p>
            </div>

            {bookmarkedProperties.length === 0 ? (
                <div className="py-20 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Heart size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold dark:text-white">No favorites yet</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Browse listings and click the heart icon to save properties you love.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedProperties.map(p => (
                        <PropertyCard
                            key={p.id}
                            p={p}
                            onClick={() => onPropertyClick(p)}
                            onToggleBookmark={onToggleBookmark}
                            userRole={userRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
