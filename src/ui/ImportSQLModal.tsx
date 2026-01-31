
import React, { useState } from 'react';
import { X, Upload, FileText, AlertTriangle, FileCode } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useSchemaStore } from '../store/useSchemaStore';
import { parseSQL } from '../utils/sqlParser';

export const ImportSQLModal: React.FC = () => {
    const { isImportModalOpen, toggleImportModal } = useUIStore();

    const [sqlContent, setSqlContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isImportModalOpen) return null;

    const handleImport = () => {
        try {
            setError(null);
            const { tables, relations } = parseSQL(sqlContent);

            if (tables.length === 0) {
                setError('No se encontraron tablas válidas en el SQL proporcionado.');
                return;
            }

            useSchemaStore.setState((state) => ({
                tables: [...state.tables, ...tables],
                relations: [...state.relations, ...relations]
            }));

            setSqlContent('');
            toggleImportModal();
        } catch (e) {
            setError('Error al procesar el SQL. Asegúrate de que la sintaxis sea válida.');
            console.error(e);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setSqlContent(content);
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col border border-slate-200 dark:border-zinc-700">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        Importar SQL
                    </h3>
                    <button
                        onClick={toggleImportModal}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-1 flex flex-col min-h-0">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>
                            Pega tus sentencias <code>CREATE TABLE</code> aquí.
                            El sistema intentará detectar tablas, columnas y claves foráneas automáticamente.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors w-fit text-sm font-medium">
                            <FileCode size={16} />
                            Cargar archivo .sql
                            <input
                                type="file"
                                accept=".sql,.txt"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    </div>

                    <textarea
                        value={sqlContent}
                        onChange={(e) => setSqlContent(e.target.value)}
                        className="flex-1 w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 font-mono text-xs text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="CREATE TABLE users ( id INT PRIMARY KEY... );"
                    />

                    {error && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
                    <button
                        onClick={toggleImportModal}
                        className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!sqlContent.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload size={16} />
                        Importar
                    </button>
                </div>
            </div>
        </div>
    );
};
