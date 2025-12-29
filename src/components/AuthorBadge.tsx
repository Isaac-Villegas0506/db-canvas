import React from 'react';

export const AuthorBadge: React.FC = () => {
    return (
        <a
            href="https://github.com/Isaac-Villegas0506"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-50 group"
        >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
                <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    Hecho por
                </span>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                    Isaac Villegas Dev
                </span>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                </span>
            </div>
        </a>
    );
};
