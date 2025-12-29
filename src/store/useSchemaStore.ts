import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Table, Column, Relation, Note, TextElement, DatabaseEngine } from '../types/schema';

interface SchemaStore {
    id: string;
    name: string;
    database: DatabaseEngine;
    tables: Table[];
    relations: Relation[];
    notes: Note[];
    texts: TextElement[];
    zoom: number;
    pan: { x: number; y: number };

    setProjectName: (name: string) => void;
    setDatabaseEngine: (database: DatabaseEngine) => void;

    addTable: (tableData: Omit<Table, 'id' | 'columns'>) => void;
    updateTable: (id: string, updates: Partial<Table>) => void;
    deleteTable: (id: string) => void;
    moveTable: (id: string, x: number, y: number) => void;

    addColumn: (tableId: string, columnData: Omit<Column, 'id'>) => void;
    updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
    deleteColumn: (tableId: string, columnId: string) => void;

    addRelation: (relationData: Omit<Relation, 'id'>) => void;
    deleteRelation: (id: string) => void;

    addNote: (note: Omit<Note, 'id'>) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;

    addText: (text: Omit<TextElement, 'id'>) => void;
    updateText: (id: string, updates: Partial<TextElement>) => void;
    deleteText: (id: string) => void;

    setViewport: (zoom: number, pan: { x: number, y: number }) => void;

    resetProject: () => void;
}

const initialState = {
    id: uuidv4(),
    name: 'New Database',
    database: 'MySQL' as DatabaseEngine,
    tables: [] as Table[],
    relations: [] as Relation[],
    notes: [] as Note[],
    texts: [] as TextElement[],
    zoom: 1,
    pan: { x: 0, y: 0 },
};

export const useSchemaStore = create<SchemaStore>()(
    persist(
        (set) => ({
            ...initialState,

            setProjectName: (name) => set({ name }),
            setDatabaseEngine: (database: DatabaseEngine) => set({ database }),

            addTable: (tableData) => set((state) => {
                const newTable: Table = {
                    id: uuidv4(),
                    columns: [
                        { id: uuidv4(), name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true }
                    ],
                    ...tableData
                };
                return { tables: [...state.tables, newTable] };
            }),

            updateTable: (id, updates) => set((state) => ({
                tables: state.tables.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteTable: (id) => set((state) => ({
                tables: state.tables.filter(t => t.id !== id),
                relations: state.relations.filter(r => r.sourceTableId !== id && r.targetTableId !== id)
            })),

            moveTable: (id, x, y) => set((state) => ({
                tables: state.tables.map(t => t.id === id ? { ...t, x, y } : t)
            })),

            addColumn: (tableId, columnData) => set((state) => ({
                tables: state.tables.map(t => {
                    if (t.id !== tableId) return t;
                    return {
                        ...t,
                        columns: [...t.columns, { id: uuidv4(), ...columnData }]
                    };
                })
            })),

            updateColumn: (tableId, columnId, updates) => set((state) => ({
                tables: state.tables.map(t => {
                    if (t.id !== tableId) return t;
                    return {
                        ...t,
                        columns: t.columns.map(c => c.id === columnId ? { ...c, ...updates } : c)
                    };
                })
            })),

            deleteColumn: (tableId, columnId) => set((state) => ({
                tables: state.tables.map(t => {
                    if (t.id !== tableId) return t;
                    return {
                        ...t,
                        columns: t.columns.filter(c => c.id !== columnId)
                    };
                })
            })),

            addRelation: (relationData) => set((state) => ({
                relations: [...state.relations, { id: uuidv4(), ...relationData }]
            })),

            deleteRelation: (id) => set((state) => ({
                relations: state.relations.filter(r => r.id !== id)
            })),

            addNote: (note) => set((state) => ({
                notes: [...state.notes, { id: uuidv4(), ...note }]
            })),

            updateNote: (id, updates) => set((state) => ({
                notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
            })),

            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter(n => n.id !== id)
            })),

            addText: (text) => set((state) => ({
                texts: [...state.texts, { id: uuidv4(), ...text }]
            })),

            updateText: (id, updates) => set((state) => ({
                texts: state.texts.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteText: (id) => set((state) => ({
                texts: state.texts.filter(t => t.id !== id)
            })),

            setViewport: (zoom, pan) => set({ zoom, pan }),

            resetProject: () => set({ ...initialState, id: uuidv4() }),
        }),
        {
            name: 'dbcanvas-project',
            partialize: (state) => ({
                id: state.id,
                name: state.name,
                database: state.database,
                tables: state.tables,
                relations: state.relations,
                notes: state.notes,
                texts: state.texts,
                zoom: state.zoom,
                pan: state.pan,
            }),
        }
    )
);
