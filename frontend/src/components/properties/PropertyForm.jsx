import React, { useState } from 'react';
import { Sparkles, Loader2, Link, X, Plus } from 'lucide-react';
import { Card, Button, Badge } from '../common/UI';

export const PropertyForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        title: "", price: "", ward: "", location: "", type: "Apartment",
        status: "For Sale", listing_status: "Active", bedrooms: "", bathrooms: "",
        area: "", phone: "", commission_percent: "", internal_remarks: "", description: "",
        images: []
    });
    const [imageUrl, setImageUrl] = useState("");

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const addImage = () => {
        if (imageUrl && imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageUrl.trim()]
            }));
            setImageUrl("");
        }
    };

    const removeImage = (urlToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(url => url !== urlToRemove)
        }));
    };

    return (
        <Card className="p-6 max-w-4xl mx-auto animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">{initialData ? 'Edit' : 'Add'} Property</h2>
                <Badge variant="neutral" className="font-bold opacity-50">Draft Mode</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Property Image URLs</label>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Paste image URL here (e.g. https://...)"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                            />
                        </div>
                        <Button type="button" onClick={addImage} className="px-6 rounded-xl" icon={Plus}>Add</Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(formData.images || []).map((url, idx) => (
                            <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                <img src={url} alt="Listing" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(url)}
                                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Property Title *</label>
                    <input
                        name="title"
                        placeholder="e.g. Modern Luxury Apartment near City Center"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium"
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Price (Million MMK) *</label>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium" required />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Ward (1-45) *</label>
                    <input name="ward" type="number" min="1" max="100" value={formData.ward} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium" required />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Exact Location URL or Address *</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium" required />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium" required />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Property Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium">
                        <option>Apartment</option><option>House</option><option>Land</option><option>Shop</option><option>Condo</option>
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium">
                        <option>For Sale</option><option>For Rent</option>
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Listing Status</label>
                    <select name="listing_status" value={formData.listing_status} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-medium">
                        <option>Active</option><option>Under Contract</option><option>Closed</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Beds</label>
                        <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Baths</label>
                        <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Area (Sqft)</label>
                        <input name="area" type="number" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium" />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Marketing Description</label>
                    </div>
                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm leading-relaxed"
                        placeholder="Tell a story about this property..."
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Internal Remarks (Private)</label>
                    <textarea name="internal_remarks" rows={2} value={formData.internal_remarks} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm bg-amber-50/30 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30" />
                </div>

                <div className="md:col-span-2 flex gap-3 justify-end mt-6">
                    <Button variant="ghost" onClick={onCancel} className="font-bold text-slate-500">Cancel</Button>
                    <Button
                        onClick={() => onSave({ ...formData, price: Number(formData.price), ward: Number(formData.ward) })}
                        className="px-8 shadow-xl shadow-indigo-500/20"
                    >
                        Save Property Listing
                    </Button>
                </div>
            </div>
        </Card>
    );
};
