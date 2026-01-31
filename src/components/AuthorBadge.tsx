import React from 'react';
import { LogOut } from 'lucide-react';

export const AuthorBadge: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) {
        return (
            <div className="fixed bottom-32 sm:bottom-4 right-4 z-[100]">
                <button
                    onClick={() => setIsVisible(true)}
                    className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-full shadow-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    title="Mostrar información"
                >
                    <LogOut size={16} className="rotate-180" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-32 sm:bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
            <button
                onClick={() => setIsVisible(false)}
                className="self-end p-1 mb-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm"
            >
                <LogOut size={12} />
            </button>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
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
        </div>
    );
};
