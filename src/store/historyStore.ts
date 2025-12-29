import { create } from 'zustand';
import { Table, Relation, Note, TextElement } from '../types/schema';

interface CanvasSnapshot {
    tables: Table[];
    relations: Relation[];
    notes: Note[];
    texts: TextElement[];
}

interface HistoryStore {
    past: CanvasSnapshot[];
    future: CanvasSnapshot[];

    pushState: (snapshot: CanvasSnapshot) => void;
    undo: () => CanvasSnapshot | null;
    redo: () => CanvasSnapshot | null;
    canUndo: () => boolean;
    canRedo: () => boolean;
    clear: () => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryStore>((set, get) => ({
    past: [],
    future: [],

    pushState: (snapshot) => set((state) => ({
        past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
        future: []
    })),

    undo: () => {
        const state = get();
        if (state.past.length === 0) return null;

        const previous = state.past[state.past.length - 1];
        set({
            past: state.past.slice(0, -1),
            future: [previous, ...state.future]
        });

        return state.past.length > 1 ? state.past[state.past.length - 2] : null;
    },

    redo: () => {
        const state = get();
        if (state.future.length === 0) return null;

        const next = state.future[0];
        set({
            past: [...state.past, next],
            future: state.future.slice(1)
        });

        return next;
    },

    canUndo: () => get().past.length > 1,
    canRedo: () => get().future.length > 0,

    clear: () => set({ past: [], future: [] })
}));
