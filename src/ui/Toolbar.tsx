import React, { useEffect, useCallback } from 'react';
import {
    MousePointer2,
    Hand,
    ArrowUpRight,
    ZoomIn,
    ZoomOut,
    Download,
    Undo2,
    Redo2,
    ChevronUp,
    ChevronDown,
    Code,
    Upload,
    Moon,
    Sun
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useSchemaStore } from '../store/useSchemaStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useHistoryStore } from '../store/historyStore';
import { useThemeStore } from '../store/themeStore';
import { generateSQL } from '../utils/sqlGenerator';

export const Toolbar: React.FC = () => {
    const { activeTool, setActiveTool, isToolbarOpen, toggleToolbar } = useUIStore();
    const { zoom, setViewport, pan, tables, relations, notes, texts } = useSchemaStore();
    const projectState = useSchemaStore();
    const { t } = useLanguageStore();
    const { pushState, undo, redo, canUndo, canRedo, past } = useHistoryStore();
    const { theme, toggleTheme } = useThemeStore();

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

    const [isExpanded, setIsExpanded] = React.useState(false);
    const { isPropertiesOpen } = useUIStore();

    return (
        <>
            {!isToolbarOpen && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
                    <button
                        onClick={toggleToolbar}
                        className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-700/50 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                        title="Mostrar barra de herramientas"
                    >
                        <ChevronDown size={18} className="text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            )}

            {isToolbarOpen && (
                <div
                    className={`fixed top-4 z-40 transition-all duration-300 -translate-x-1/2
                        ${isPropertiesOpen ? 'left-[calc(50%-10rem)]' : 'left-1/2'}
                    `}
                >
                    <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-700/50 w-[95vw] sm:w-auto transition-all duration-300 overflow-hidden ${isExpanded ? 'h-auto pb-2' : 'h-14 sm:h-12'}`}>
                        <div className={`flex items-center gap-4 px-4 ${isExpanded ? 'flex-wrap pt-2 justify-center' : 'h-full overflow-hidden'}`}>

                            {/* Undo/Redo Group */}
                            <div className="flex items-center gap-1 border-r border-slate-200 dark:border-zinc-700/50 pr-4 flex-shrink-0">
                                <div className="relative group">
                                    <button
                                        onClick={handleUndo}
                                        disabled={!canUndo()}
                                        className={`p-2 rounded transition-colors ${canUndo()
                                            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                                            : 'text-slate-300 dark:text-zinc-700 cursor-not-allowed'
                                            }`}
                                        title="Deshacer (Ctrl+Z)"
                                    >
                                        <Undo2 size={18} />
                                    </button>
                                </div>
                                <div className="relative group">
                                    <button
                                        onClick={handleRedo}
                                        disabled={!canRedo()}
                                        className={`p-2 rounded transition-colors ${canRedo()
                                            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                                            : 'text-slate-300 dark:text-zinc-700 cursor-not-allowed'
                                            }`}
                                        title="Rehacer (Ctrl+Y)"
                                    >
                                        <Redo2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Tools Group */}
                            <div className="flex items-center gap-1 border-r border-slate-200 dark:border-zinc-700/50 pr-4 flex-shrink-0">
                                {tools.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveTool(tool.id)}
                                        className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${activeTool === tool.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
                                        title={tool.label}
                                    >
                                        <tool.icon size={18} />
                                    </button>
                                ))}
                            </div>

                            {/* Project Name */}
                            {!isExpanded && (
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 select-none hidden md:block whitespace-nowrap max-w-[150px] truncate flex-shrink-0">
                                    {projectState.name}
                                </div>
                            )}

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 border-l border-r sm:border-r-0 border-slate-200 dark:border-zinc-700/50 px-4 flex-shrink-0">
                                <button onClick={handleZoomOut} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded">
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-xs w-10 text-center text-slate-500 dark:text-slate-400">{Math.round(zoom * 100)}%</span>
                                <button onClick={handleZoomIn} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded">
                                    <ZoomIn size={18} />
                                </button>
                            </div>

                            {/* Actions Group */}
                            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-zinc-700/50 pl-4 flex-shrink-0">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>

                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors"
                                >
                                    <Download size={14} />
                                    <span className="hidden lg:inline">SQL</span>
                                </button>

                                <button
                                    onClick={() => useUIStore.getState().toggleImportModal()}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                                >
                                    <Upload size={14} />
                                    <span className="hidden lg:inline">Importar</span>
                                </button>

                                <button
                                    onClick={() => useUIStore.getState().toggleSQLEditor()}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors"
                                >
                                    <Code size={14} />
                                    <span className="hidden lg:inline">Editor</span>
                                </button>

                                {/* Internal Toggle Buttons */}
                                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-zinc-700/50 pl-2 ml-2">
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                        title={isExpanded ? "Colapsar" : "Expandir"}
                                    >
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <button
                                        onClick={toggleToolbar}
                                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                        title="Ocultar barra de herramientas"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expand Button */}
                        <div className="absolute bottom-0 left-0 w-full flex justify-center pb-0 sm:hidden">
                            {/* Only visible on mobile if needed, or we just rely on the side toggle. 
                               Actually, let's put the expand toggle at the end of the items.
                           */}
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};
