import React from 'react';
import { useSchemaStore } from '../store/useSchemaStore';
import { useUIStore } from '../store/uiStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { DataType } from '../types/schema';
import { Trash2, Plus, Key, Link as LinkIcon, Settings, X, ArrowUpRight, Book, BookOpen, Repeat, HelpCircle } from 'lucide-react';

const DATA_TYPES: DataType[] = [
    'INT', 'BIGINT', 'SMALLINT', 'TINYINT',
    'FLOAT', 'DOUBLE', 'DECIMAL',
    'VARCHAR', 'TEXT', 'CHAR', 'LONGTEXT',
    'BOOLEAN', 'BIT',
    'DATE', 'DATETIME', 'TIMESTAMP', 'TIME',
    'JSON', 'UUID', 'BLOB', 'ENUM'
];

const NOTE_COLORS = ['#fef3c7', '#dbeafe', '#dcfce7', '#fee2e2', '#fce7f3', '#e0e7ff'];
const TABLE_COLORS = ['#f8fafc', '#eff6ff', '#f0fdf4', '#fef2f2', '#fff7ed', '#faf5ff'];

export const PropertiesPanel: React.FC = () => {
    const {
        tables,
        relations,
        notes,
        texts,
        updateTable,
        deleteTable,
        addColumn,
        updateColumn,
        deleteColumn,
        updateNote,
        deleteNote,
        updateText,
        deleteText,
        name,
        database,
        setProjectName,
        setDatabaseEngine,
        deleteRelation
    } = useSchemaStore();

    const { selectedId, selectedType, toggleProperties, isPropertiesOpen, selectObject, setActiveTool } = useUIStore();
    const { t } = useLanguageStore();

    const renderProjectSettings = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('properties.name')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200"
                    placeholder="Mi Proyecto"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('properties.engine')}</label>
                <select
                    value={database}
                    onChange={(e) => setDatabaseEngine(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-sm text-slate-700 dark:text-slate-200"
                >
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="SQLite">SQLite</option>
                </select>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Selecciona una tabla para editar sus columnas.
                    <br />
                    Arrastra desde la barra lateral para agregar nuevos elementos.
                </p>
            </div>
        </div>
    );

    const renderTableProperties = (tableId: string) => {
        const table = tables.find(t => t.id === tableId);
        if (!table) return null;

        return (
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nombre de Tabla</label>
                        <button
                            onClick={() => { deleteTable(table.id); selectObject(null, null); }}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                            title="Eliminar Tabla"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={table.name}
                        onChange={(e) => updateTable(tableId, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200"
                    />

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Color</label>
                            <div className="grid grid-cols-6 gap-1">
                                {TABLE_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => updateTable(tableId, { color: c })}
                                        className={`w-8 h-8 rounded border-2 ${table.color === c ? 'border-slate-800 dark:border-slate-200' : 'border-slate-200 dark:border-zinc-700'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Columnas ({table.columns.length})</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => {
                                    setActiveTool('RELATION');
                                    toggleProperties();
                                }}
                                className="flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                title="Crear conexión con otra tabla"
                            >
                                <ArrowUpRight size={14} /> Conectar
                            </button>
                            <button
                                onClick={() => addColumn(tableId, { name: 'nueva_col', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false })}
                                className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40"
                            >
                                <Plus size={14} /> Agregar
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto overflow-x-hidden pr-1">
                        {table.columns.map((col) => (
                            <div key={col.id} className="bg-slate-50 dark:bg-zinc-800/50 p-2 rounded border border-slate-200 dark:border-zinc-700 group relative">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={col.name}
                                        onChange={(e) => updateColumn(tableId, col.id, { name: e.target.value })}
                                        className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                                        placeholder="Nombre"
                                    />
                                    <select
                                        value={col.type}
                                        onChange={(e) => updateColumn(tableId, col.id, { type: e.target.value as DataType })}
                                        className="w-24 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded px-1 py-1 text-[10px] text-slate-600 dark:text-slate-300"
                                    >
                                        {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateColumn(tableId, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                                        className={`p-1 rounded ${col.isPrimaryKey ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                                        title="Clave Primaria"
                                    >
                                        <Key size={12} />
                                    </button>
                                    <button
                                        onClick={() => updateColumn(tableId, col.id, { isForeignKey: !col.isForeignKey })}
                                        className={`p-1 rounded ${col.isForeignKey ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                                        title="Clave Foránea"
                                    >
                                        <LinkIcon size={12} />
                                    </button>
                                    <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-1" />
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={col.isNullable}
                                            onChange={(e) => updateColumn(tableId, col.id, { isNullable: e.target.checked })}
                                            className="w-3 h-3 rounded border-slate-300 dark:border-zinc-600"
                                        />
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Nulo</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => deleteColumn(tableId, col.id)}
                                    className="absolute top-2 right-[-24px] opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderRelationProperties = (relationId: string) => {
        const relation = relations.find(r => r.id === relationId);
        if (!relation) return null;

        const sourceTable = tables.find(t => t.id === relation.sourceTableId);
        const targetTable = tables.find(t => t.id === relation.targetTableId);
        const sourceColumn = sourceTable?.columns.find(c => c.id === relation.sourceColumnId);
        const targetColumn = targetTable?.columns.find(c => c.id === relation.targetColumnId);

        const getRelationTypeInfo = (type: string) => {
            switch (type) {
                case '1:1': return { label: 'Uno a Uno', color: 'purple', icon: <LinkIcon size={20} /> };
                case '1:N': return { label: 'Uno a Muchos', color: 'blue', icon: <Book size={20} /> };
                case 'N:1': return { label: 'Muchos a Uno', color: 'green', icon: <BookOpen size={20} /> };
                case 'N:M': return { label: 'Muchos a Muchos', color: 'orange', icon: <Repeat size={20} /> };
                default: return { label: 'Desconocido', color: 'gray', icon: <HelpCircle size={20} /> };
            }
        };

        const typeInfo = getRelationTypeInfo(relation.type);

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md bg-${typeInfo.color}-50 dark:bg-${typeInfo.color}-900/20 text-${typeInfo.color}-600 dark:text-${typeInfo.color}-400`}>
                            {typeInfo.icon}
                        </div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Relación {relation.type}</label>
                    </div>
                    <button
                        onClick={() => { deleteRelation(relation.id); selectObject(null, null); }}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-center">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{sourceTable?.name || '?'}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">.{sourceColumn?.name || '?'}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-center px-2">
                            <div className="h-0.5 flex-1 bg-slate-300 dark:bg-zinc-600"></div>
                            <span className={`mx-2 px-2 py-0.5 rounded text-xs font-bold bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/30 text-${typeInfo.color}-600 dark:text-${typeInfo.color}-400`}>
                                {relation.type}
                            </span>
                            <div className="h-0.5 flex-1 bg-slate-300 dark:bg-zinc-600"></div>
                            <span className="text-slate-400 dark:text-slate-500">→</span>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{targetTable?.name || '?'}</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400">.{targetColumn?.name || '?'}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Tipo de Relación</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['1:1', '1:N', 'N:1', 'N:M'].map(type => {
                            const info = getRelationTypeInfo(type);
                            const isActive = relation.type === type;
                            return (
                                <button
                                    key={type}
                                    className={`p-2 rounded border text-xs font-medium transition-colors ${isActive
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                        : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 text-slate-600 dark:text-slate-400'
                                        }`}
                                    disabled
                                >
                                    {info.icon} {info.label}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Para cambiar el tipo, elimina y crea una nueva relación.</p>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800" />

                <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Acciones Referenciales</label>

                    <div>
                        <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">ON DELETE</label>
                        <select
                            value={relation.onDelete || 'CASCADE'}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-sm text-slate-700 dark:text-slate-200"
                            disabled
                        >
                            <option value="CASCADE">CASCADE - Eliminar en cascada</option>
                            <option value="SET NULL">SET NULL - Establecer NULL</option>
                            <option value="SET DEFAULT">SET DEFAULT - Valor por defecto</option>
                            <option value="RESTRICT">RESTRICT - Restringir</option>
                            <option value="NO ACTION">NO ACTION - Sin acción</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">ON UPDATE</label>
                        <select
                            value={relation.onUpdate || 'CASCADE'}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-sm text-slate-700 dark:text-slate-200"
                            disabled
                        >
                            <option value="CASCADE">CASCADE - Actualizar en cascada</option>
                            <option value="SET NULL">SET NULL - Establecer NULL</option>
                            <option value="SET DEFAULT">SET DEFAULT - Valor por defecto</option>
                            <option value="RESTRICT">RESTRICT - Restringir</option>
                            <option value="NO ACTION">NO ACTION - Sin acción</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">SQL Generado</label>
                    <div className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                        <code>
                            ALTER TABLE `{sourceTable?.name}`{'\n'}
                            ADD CONSTRAINT `fk_{sourceTable?.name}_{targetTable?.name}`{'\n'}
                            FOREIGN KEY (`{sourceColumn?.name}`){'\n'}
                            REFERENCES `{targetTable?.name}` (`{targetColumn?.name}`){'\n'}
                            ON DELETE {relation.onDelete || 'CASCADE'}{'\n'}
                            ON UPDATE {relation.onUpdate || 'CASCADE'};
                        </code>
                    </div>
                </div>
            </div>
        );
    };

    const renderNoteProperties = (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (!note) return null;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nota</label>
                    <button
                        onClick={() => { deleteNote(note.id); selectObject(null, null); }}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div>
                    <label className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Color</label>
                    <div className="grid grid-cols-6 gap-1">
                        {NOTE_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => updateNote(noteId, { color: c })}
                                className={`w-8 h-8 rounded border-2 ${note.color === c ? 'border-slate-800 dark:border-slate-200' : 'border-slate-200 dark:border-zinc-700'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Contenido</label>
                    <textarea
                        value={note.content}
                        onChange={(e) => updateNote(noteId, { content: e.target.value })}
                        className="w-full h-32 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200"
                    />
                </div>
            </div>
        );
    };

    const renderTextProperties = (textId: string) => {
        const text = texts.find(t => t.id === textId);
        if (!text) return null;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Texto</label>
                    <button
                        onClick={() => { deleteText(text.id); selectObject(null, null); }}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Contenido</label>
                    <input
                        type="text"
                        value={text.content}
                        onChange={(e) => updateText(textId, { content: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Tamaño de Fuente</label>
                    <input
                        type="number"
                        value={text.fontSize}
                        onChange={(e) => updateText(textId, { fontSize: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-sm text-slate-700 dark:text-slate-200"
                        min="8"
                        max="72"
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            {!isPropertiesOpen && (
                <button
                    onClick={() => {
                        toggleProperties();
                        if (window.innerWidth < 640) {
                            useUIStore.getState().toggleToolbar(); // Close toolbar if open
                        }
                    }}
                    className="fixed top-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/50 rounded-lg shadow-lg p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Abrir Propiedades"
                >
                    <Settings size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
            )}

            {isPropertiesOpen && (
                <div className="fixed sm:absolute top-16 sm:top-0 right-0 h-[calc(100vh-4rem)] sm:h-full w-full sm:w-80 bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-xl z-40 flex flex-col transition-all duration-300">
                    <div className="h-14 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Propiedades
                        </span>
                        <button onClick={toggleProperties} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-24 sm:pb-4">
                        {selectedType === 'TABLE' && selectedId ? renderTableProperties(selectedId) :
                            selectedType === 'RELATION' && selectedId ? renderRelationProperties(selectedId) :
                                selectedType === 'NOTE' && selectedId ? renderNoteProperties(selectedId) :
                                    selectedType === 'TEXT' && selectedId ? renderTextProperties(selectedId) :
                                        renderProjectSettings()}
                    </div>
                </div>
            )}
        </>
    );
};
