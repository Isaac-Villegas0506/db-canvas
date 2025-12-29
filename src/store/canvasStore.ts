import { create } from 'zustand';
import { Node, Edge, ViewState, Position, NodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    selectedIds: string[];
    viewState: ViewState;
}

interface CanvasActions {
    // Nodes
    addNode: (type: Node['type'], position: Position, data?: NodeData) => void;
    updateNode: (id: string, updates: Partial<Node>) => void;
    deleteNode: (id: string) => void;
    setNodes: (nodes: Node[]) => void;

    // Edges
    addEdge: (edge: Edge) => void;
    deleteEdge: (id: string) => void;

    // Selection
    selectNode: (id: string, multi?: boolean) => void;
    deselectAll: () => void;

    // Viewport
    setViewState: (viewState: ViewState) => void;
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set) => ({
    nodes: [],
    edges: [],
    selectedIds: [],
    viewState: { scale: 1, position: { x: 0, y: 0 } },

    addNode: (type, position, data) => {
        const newNode: Node = {
            id: uuidv4(),
            type,
            position,
            data: data || { label: 'New Node' },
            size: type === 'table' ? { width: 200, height: 200 } : { width: 100, height: 100 }, // Defaults
        };
        set((state) => ({ nodes: [...state.nodes, newNode], selectedIds: [newNode.id] }));
    },

    updateNode: (id, updates) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, ...updates } : node
            )
        }));
    },

    deleteNode: (id) => {
        set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== id),
            edges: state.edges.filter((e) => e.source !== id && e.target !== id),
            selectedIds: state.selectedIds.filter((sid) => sid !== id)
        }));
    },

    setNodes: (nodes) => set({ nodes }),

    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

    deleteEdge: (id) => set((state) => ({
        edges: state.edges.filter((e) => e.id !== id)
    })),

    selectNode: (id, multi = false) => set((state) => {
        if (multi) {
            const isSelected = state.selectedIds.includes(id);
            return {
                selectedIds: isSelected
                    ? state.selectedIds.filter(sid => sid !== id)
                    : [...state.selectedIds, id]
            };
        }
        return { selectedIds: [id] };
    }),

    deselectAll: () => set({ selectedIds: [] }),

    setViewState: (viewState) => set({ viewState }),
}));
