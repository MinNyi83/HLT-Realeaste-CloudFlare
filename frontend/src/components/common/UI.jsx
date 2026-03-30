import React from 'react';

export const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
        {children}
    </div>
);

export const Badge = ({ children, variant = "primary", className = "" }) => {
    const variants = {
        primary: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
        neutral: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.primary} ${className}`}>
            {children}
        </span>
    );
};

export const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, disabled = false, loading = false }) => {
    const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
        secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700",
        danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800",
        google: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700",
    };

    return (
        <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={18} />}
                    {children}
                </>
            )}
        </button>
    );
};
