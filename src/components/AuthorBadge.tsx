import React from 'react';
import { LogOut } from 'lucide-react';

export const AuthorBadge: React.FC = () => {
    return (
        <div className="fixed bottom-24 sm:bottom-4 right-4 z-[100] flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <a
                href="https://ivillegas.site/"
                className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
                <LogOut size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Volver a mi portafolio
                </span>
            </a>

            <a
                href="https://github.com/Isaac-Villegas0506"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200 transition-colors">
                        Hecho por
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Isaac Villegas Dev
                    </span>
                </div>
            </a>
        </div>
    );
};
