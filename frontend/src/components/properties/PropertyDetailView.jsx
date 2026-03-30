import React, { useState } from 'react';
import { ArrowLeft, Building2, MapPin, DollarSign, Home, Activity, LayoutDashboard, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, Button, Card } from '../common/UI';

export const PropertyDetailView = ({ property, onBack }) => {
    const [activeImage, setActiveImage] = useState(0);
    if (!property) return null;

    const images = property.images ? (typeof property.images === 'string' ? JSON.parse(property.images) : property.images) : [];

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" className="p-2 rounded-xl" onClick={onBack}>
                    <ArrowLeft size={24} />
                </Button>
                <div className="flex-1">
                    <h2 className="text-3xl font-black dark:text-white tracking-tight leading-tight">{property.title}</h2>
                    <div className="flex items-center text-slate-500 mt-1">
                        <MapPin size={18} className="mr-2 text-rose-500" />
                        {property.location}, Ward {property.ward}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl relative group">
                            {images.length > 0 ? (
                                <>
                                    <img src={images[activeImage]} alt="" className="w-full h-full object-cover transition-all duration-700" />
                                    {images.length > 1 && (
                                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={() => setActiveImage(prev => (prev + 1) % images.length)}
                                                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Building2 size={80} className="opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Badge variant="primary" className="backdrop-blur-md bg-indigo-600/90 text-white border-none shadow-lg px-3 uppercase text-[10px] font-black">{property.type}</Badge>
                                <Badge variant="success" className="backdrop-blur-md bg-emerald-600/90 text-white border-none shadow-lg px-3 uppercase text-[10px] font-black">{property.status}</Badge>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Price", value: `${Number(property.price).toLocaleString()} M`, sub: "MMK", icon: DollarSign, color: "text-indigo-600" },
                            { label: "Beds", value: property.bedrooms || '0', icon: Home, color: "text-amber-500" },
                            { label: "Baths", value: property.bathrooms || '0', icon: Activity, color: "text-blue-500" },
                            { label: "Area", value: property.area || '0', sub: "sqft", icon: LayoutDashboard, color: "text-emerald-500" },
                            { label: "Ward", value: property.ward, icon: MapPin, color: "text-rose-500" },
                            { label: "Status", value: property.listing_status || 'Active', icon: Activity, color: "text-indigo-500" },
                        ].map((spec, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                <spec.icon size={18} className={`${spec.color} mb-2`} />
                                <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">{spec.label}</div>
                                <div className="text-lg font-black dark:text-white">
                                    {spec.value} <span className="text-xs font-bold text-slate-400">{spec.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Listing Description</h3>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-lg bg-white dark:bg-slate-800/30 p-8 rounded-3xl border dark:border-slate-800 shadow-sm">
                            {property.description || "Looking for a prime real estate opportunity? This property offers excellent value and a great location."}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 sticky top-24 border-0 shadow-2xl shadow-indigo-500/10 active:scale-[0.98] transition-transform bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                        <h3 className="text-lg font-black mb-4 dark:text-white uppercase tracking-tight">Contact Agent</h3>
                        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">H</div>
                            <div>
                                <div className="font-bold dark:text-white text-sm">HTL Properties</div>
                                <div className="text-[10px] text-slate-500 uppercase font-black">Verified Agent</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <a href={`tel:${property.phone}`} className="block">
                                <Button className="w-full h-14 text-lg font-black shadow-xl shadow-indigo-600/30 rounded-2xl" icon={Phone}>Call Now</Button>
                            </a>
                            <a href={`sms:${property.phone}`} className="block">
                                <Button variant="secondary" className="w-full h-14 text-lg font-black rounded-2xl" icon={Mail}>Send Message</Button>
                            </a>
                        </div>

                        <p className="mt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Always visit the property in person <br /> before making any payments.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
