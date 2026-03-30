import React from 'react';
import { Building2, MapPin, Trash2, Heart } from 'lucide-react';
import { Card, Badge, Button } from '../common/UI';

export const PropertyCard = ({ p, onClick, onEdit, onDelete, onToggleBookmark, userRole }) => {
    const images = p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [];
    const firstImage = images[0] || null;

    return (
        <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 rounded-2xl">
            <div
                className="h-48 bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={onClick}
            >
                {firstImage ? (
                    <img src={firstImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <Building2 size={48} className="text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge variant={p.status === 'For Sale' ? 'primary' : 'success'} className="backdrop-blur-md bg-indigo-600/90 text-white border-none shadow-lg px-3 uppercase text-[10px] font-black">{p.status}</Badge>
                    <Badge variant="neutral" className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border-none font-bold text-[10px] px-2">{p.type}</Badge>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(p.id, !!p.is_bookmarked); }}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${p.is_bookmarked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-white/70 dark:bg-slate-800/70 text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                >
                    <Heart size={18} fill={p.is_bookmarked ? "currentColor" : "none"} className={p.is_bookmarked ? "animate-pulse" : ""} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2" onClick={onClick}>
                    <h3 className="font-black dark:text-white text-lg leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer">{p.title}</h3>
                </div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-4 tracking-tighter" onClick={onClick}>
                    {Number(p.price || 0).toLocaleString()} <span className="text-xs font-bold text-slate-400">MMK</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6" onClick={onClick}>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <MapPin size={14} className="text-rose-500" /> <span>Ward {p.ward}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Badge variant={
                            (p.listing_status || 'Active') === 'Active' ? 'success' :
                                p.listing_status === 'Sold' ? 'danger' :
                                    p.listing_status === 'Rented' ? 'warning' : 'neutral'
                        } className="uppercase font-black text-[9px] tracking-tighter">
                            {p.listing_status || 'Active'}
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-2 border-t dark:border-slate-800 pt-4">
                    <Button
                        variant="secondary"
                        className="flex-1 text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl border-slate-200"
                        onClick={onEdit}
                        disabled={!['admin', 'agent'].includes(userRole)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 border border-transparent hover:border-rose-100"
                        onClick={onDelete}
                        disabled={!['admin', 'agent'].includes(userRole)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};
