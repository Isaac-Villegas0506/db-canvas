import { create } from 'zustand';

type ToolType = 'SELECT' | 'HAND' | 'RELATION' | 'TEXT' | 'NOTE';

interface UIStore {
    activeTool: ToolType;
    selectedId: string | null;
    selectedType: 'TABLE' | 'RELATION' | 'NOTE' | 'TEXT' | null;
    isSidebarOpen: boolean;
    isPropertiesOpen: boolean;
    isToolbarOpen: boolean;

    setActiveTool: (tool: ToolType) => void;
    selectObject: (id: string | null, type: 'TABLE' | 'RELATION' | 'NOTE' | 'TEXT' | null) => void;
    toggleSidebar: () => void;
    toggleProperties: () => void;
    toggleToolbar: () => void;
    openProperties: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    activeTool: 'SELECT',
    selectedId: null,
    selectedType: null,
    isSidebarOpen: true,
    isPropertiesOpen: true,
    isToolbarOpen: true,

    setActiveTool: (tool) => set({ activeTool: tool, selectedId: null, selectedType: null }),
    selectObject: (id, type) => set({ selectedId: id, selectedType: id ? type : null, isPropertiesOpen: !!id }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleProperties: () => set((state) => ({ isPropertiesOpen: !state.isPropertiesOpen })),
    toggleToolbar: () => set((state) => ({ isToolbarOpen: !state.isToolbarOpen })),
    openProperties: () => set({ isPropertiesOpen: true }),
}));
