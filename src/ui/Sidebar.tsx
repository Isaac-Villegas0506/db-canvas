import React from 'react';
import { Table, StickyNote, Type, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/uiStore';
import { useSchemaStore } from '../store/useSchemaStore';

const SidebarItem = ({ type, icon: Icon, label }: { type: string; icon: any; label: string }) => {
    const { t } = useLanguageStore();
    const { pan, zoom, addTable, addNote, addText } = useSchemaStore();

    const handleAdd = () => {
        // Calculate center of viewport
        const x = (-pan.x + window.innerWidth / 2) / zoom;
        const y = (-pan.y + window.innerHeight / 2) / zoom;

        if (type === 'table') {
            addTable({ x, y, name: 'Nueva Tabla', color: '#f8fafc' });
        } else if (type === 'note') {
            addNote({ x, y, content: 'Nueva nota', color: '#fef3c7' });
        } else if (type === 'text') {
            addText({ x, y, content: 'Texto', fontSize: 16 });
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center gap-2 p-3 w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700/50 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-500 dark:hover:border-blue-400 hover:shadow transition-all group relative"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', type);
            }}
            onClick={handleAdd}
        >
            <Icon size={24} className="text-slate-600 dark:text-slate-300" />
            <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">{t(label)}</span>
        </div>
    );
};

export const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <div className="fixed sm:absolute bottom-4 sm:bottom-auto sm:top-20 left-1/2 sm:left-4 -translate-x-1/2 sm:translate-x-0 z-50">
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-700/50 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                    title="Mostrar panel de elementos"
                >
                    <ChevronRight size={18} className="text-slate-600 dark:text-slate-300 rotate-90 sm:rotate-0" />
                </button>
            )}

            {isSidebarOpen && (
                <div className="flex flex-row sm:flex-col items-center gap-3 p-2 sm:p-0 bg-white/90 sm:bg-transparent dark:bg-zinc-900/90 sm:dark:bg-transparent rounded-xl sm:rounded-none border sm:border-none border-slate-200 dark:border-zinc-700/50 shadow-xl sm:shadow-none backdrop-blur-sm sm:backdrop-blur-none sm:w-24">
                    <SidebarItem type="table" icon={Table} label="sidebar.table" />
                    <SidebarItem type="note" icon={StickyNote} label="sidebar.note" />
                    <SidebarItem type="text" icon={Type} label="sidebar.text" />

                    <div className="h-8 w-px bg-slate-200 dark:bg-zinc-700 sm:w-full sm:h-px my-1" />

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700/50 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Ocultar panel de elementos"
                    >
                        <ChevronLeft size={20} className="-rotate-90 sm:rotate-0" />
                    </button>
                </div>
            )}
        </div>
    );
};
