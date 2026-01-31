
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { parseSQL } from '../utils/sqlParser';
import { useSchemaStore } from '../store/useSchemaStore';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export const SQLEditorPanel: React.FC = () => {
    const { isSQLEditorOpen, toggleSQLEditor } = useUIStore();
    const [code, setCode] = useState<string>('-- Escribe tu SQL aquí para generar tablas en tiempo real\n-- Ejemplo:\n-- CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255));\n');
    const debouncedCode = useDebounce(code, 800);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!debouncedCode.trim()) return;

        try {
            setError(null);

            const { tables: parsedTables, relations: parsedRelations } = parseSQL(debouncedCode);

            if (parsedTables.length === 0 && debouncedCode.trim().length > 50) {

            }

            if (parsedTables.length > 0) {
                useSchemaStore.setState((state) => {
                    const currentTables = [...state.tables];
                    const currentRelations = [...state.relations];

                    parsedTables.forEach(parsedTable => {
                        const existingTableIndex = currentTables.findIndex(t => t.name === parsedTable.name);

                        if (existingTableIndex !== -1) {
                            currentTables[existingTableIndex] = {
                                ...currentTables[existingTableIndex],
                                columns: parsedTable.columns.map(c => ({ ...c })),
                            };

                            parsedRelations.forEach(r => {
                                if (r.sourceTableId === parsedTable.id) r.sourceTableId = currentTables[existingTableIndex].id;
                                if (r.targetTableId === parsedTable.id) r.targetTableId = currentTables[existingTableIndex].id;
                            });
                            parsedTable.id = currentTables[existingTableIndex].id;

                        } else {
                            currentTables.push(parsedTable);
                        }
                    });

                    const mergedRelations = [...currentRelations];
                    parsedRelations.forEach(newRel => {
                        mergedRelations.push(newRel);
                    });

                    return {
                        tables: currentTables,
                        relations: mergedRelations
                    };
                });
            }

        } catch (e) {
            console.error("Parse error", e);
        }

    }, [debouncedCode]);

    if (!isSQLEditorOpen) return null;

    return (
        <div className="fixed right-0 top-14 bottom-0 w-[450px] bg-zinc-900 border-l border-zinc-700 shadow-2xl z-40 flex flex-col transition-transform duration-300">
            <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900">
                <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                    <span className="text-blue-500">{`</>`}</span> Editor SQL
                </span>
                <button
                    onClick={toggleSQLEditor}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    defaultLanguage="sql"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                        lineHeight: 20,
                        renderLineHighlight: 'all',
                        overviewRulerBorder: false,
                        hideCursorInOverviewRuler: true,
                    }}
                />
            </div>

            {error && (
                <div className="p-3 bg-red-900/30 text-red-200 text-xs border-t border-red-900/50">
                    {error}
                </div>
            )}

            <div className="p-2 border-t border-zinc-800 bg-zinc-900 text-[10px] text-zinc-500 text-center">
                Escribe SQL para generar tablas automáticamente.
            </div>
        </div>
    );
};
