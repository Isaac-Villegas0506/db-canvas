import React from 'react';
import { Table, StickyNote, Type, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/uiStore';

const SidebarItem = ({ type, icon: Icon, label }: { type: string; icon: any; label: string }) => {
    const { t } = useLanguageStore();
    return (
        <div
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow transition-all group relative"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', type);
            }}
        >
            <Icon size={24} className="text-slate-600" />
            <span className="text-xs font-medium text-slate-600">{t(label)}</span>
        </div>
    );
};

export const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <div className="absolute top-20 left-4 z-50">
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 hover:bg-slate-50 transition-all"
                    title="Mostrar panel de elementos"
                >
                    <ChevronRight size={18} className="text-slate-600" />
                </button>
            )}

            {isSidebarOpen && (
                <div className="flex flex-col gap-3 w-24">
                    <SidebarItem type="table" icon={Table} label="sidebar.table" />
                    <SidebarItem type="note" icon={StickyNote} label="sidebar.note" />
                    <SidebarItem type="text" icon={Type} label="sidebar.text" />

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
                        title="Ocultar panel de elementos"
                    >
                        <ChevronLeft size={16} className="text-slate-400" />
                    </button>
                </div>
            )}
        </div>
    );
};
