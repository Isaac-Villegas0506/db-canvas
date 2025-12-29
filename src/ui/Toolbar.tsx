import React, { useEffect, useCallback } from 'react';
import {
    MousePointer2,
    Hand,
    ArrowUpRight,
    ZoomIn,
    ZoomOut,
    Download,
    Globe,
    Undo2,
    Redo2,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useSchemaStore } from '../store/useSchemaStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useHistoryStore } from '../store/historyStore';
import { generateSQL } from '../utils/sqlGenerator';

export const Toolbar: React.FC = () => {
    const { activeTool, setActiveTool, isToolbarOpen, toggleToolbar } = useUIStore();
    const { zoom, setViewport, pan, tables, relations, notes, texts } = useSchemaStore();
    const projectState = useSchemaStore();
    const { t, language, setLanguage } = useLanguageStore();
    const { pushState, undo, redo, canUndo, canRedo, past } = useHistoryStore();

    useEffect(() => {
        const currentSnapshot = { tables, relations, notes, texts };
        const lastSnapshot = past[past.length - 1];

        if (!lastSnapshot ||
            JSON.stringify(currentSnapshot) !== JSON.stringify(lastSnapshot)) {
            pushState(currentSnapshot);
        }
    }, [tables, relations, notes, texts]);

    const handleUndo = useCallback(() => {
        if (!canUndo()) return;

        const previousState = undo();
        if (previousState) {
            useSchemaStore.setState({
                tables: previousState.tables,
                relations: previousState.relations,
                notes: previousState.notes,
                texts: previousState.texts
            });
        }
    }, [canUndo, undo]);

    const handleRedo = useCallback(() => {
        if (!canRedo()) return;

        const nextState = redo();
        if (nextState) {
            useSchemaStore.setState({
                tables: nextState.tables,
                relations: nextState.relations,
                notes: nextState.notes,
                texts: nextState.texts
            });
        }
    }, [canRedo, redo]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    const handleZoomIn = () => setViewport(zoom * 1.2, pan);
    const handleZoomOut = () => setViewport(zoom / 1.2, pan);

    const handleExport = () => {
        const sql = generateSQL(projectState);
        const blob = new Blob([sql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectState.name.replace(/\s+/g, '_')}.sql`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const tools = [
        { id: 'SELECT' as const, icon: MousePointer2, label: t('toolbar.select'), help: 'Selecciona y mueve elementos' },
        { id: 'HAND' as const, icon: Hand, label: t('toolbar.hand'), help: 'Desplaza el canvas' },
        { id: 'RELATION' as const, icon: ArrowUpRight, label: t('toolbar.relation'), help: 'Conecta tablas' },
    ];

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            {!isToolbarOpen && (
                <button
                    onClick={toggleToolbar}
                    className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 hover:bg-slate-50 transition-all"
                    title="Mostrar barra de herramientas"
                >
                    <ChevronDown size={18} className="text-slate-600" />
                </button>
            )}

            {isToolbarOpen && (
                <div className="bg-white rounded-lg shadow-xl border border-slate-200">
                    <div className="h-12 px-4 flex items-center gap-4">
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
                            <div className="relative group">
                                <button
                                    onClick={handleUndo}
                                    disabled={!canUndo()}
                                    className={`p-2 rounded transition-colors ${canUndo()
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    title="Deshacer (Ctrl+Z)"
                                >
                                    <Undo2 size={18} />
                                </button>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                    <div className="font-medium">Deshacer</div>
                                    <div className="text-slate-300 text-[10px]">Ctrl+Z</div>
                                </div>
                            </div>
                            <div className="relative group">
                                <button
                                    onClick={handleRedo}
                                    disabled={!canRedo()}
                                    className={`p-2 rounded transition-colors ${canRedo()
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    title="Rehacer (Ctrl+Y)"
                                >
                                    <Redo2 size={18} />
                                </button>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                    <div className="font-medium">Rehacer</div>
                                    <div className="text-slate-300 text-[10px]">Ctrl+Y / Ctrl+Shift+Z</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
                            {tools.map(tool => (
                                <div key={tool.id} className="relative group">
                                    <button
                                        onClick={() => setActiveTool(tool.id)}
                                        className={`p-2 rounded hover:bg-slate-100 transition-colors ${activeTool === tool.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                                        title={tool.label}
                                    >
                                        <tool.icon size={18} />
                                    </button>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                        <div className="font-medium">{tool.label}</div>
                                        <div className="text-slate-300 text-[10px]">{tool.help}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm font-semibold text-slate-700 select-none hidden sm:block">
                            {projectState.name}
                        </div>

                        <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                            <button onClick={handleZoomOut} className="p-2 text-slate-600 hover:bg-slate-100 rounded">
                                <ZoomOut size={18} />
                            </button>
                            <span className="text-xs w-12 text-center text-slate-500">{Math.round(zoom * 100)}%</span>
                            <button onClick={handleZoomIn} className="p-2 text-slate-600 hover:bg-slate-100 rounded">
                                <ZoomIn size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                            <button
                                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 px-2 py-1 rounded uppercase"
                            >
                                <Globe size={14} />
                                {language}
                            </button>

                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
                                title={t('toolbar.export')}
                            >
                                <Download size={14} />
                                <span className="hidden lg:inline">SQL</span>
                            </button>

                            <button
                                onClick={toggleToolbar}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors ml-2"
                                title="Ocultar barra de herramientas"
                            >
                                <ChevronUp size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
