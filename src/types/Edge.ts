export type EdgeType = 'default' | 'straight' | 'step';

export interface Edge {
    id: string;
    source: string; // Node ID
    target: string; // Node ID
    sourceHandle?: string; // Specific port ID
    targetHandle?: string; // Specific port ID
    type?: EdgeType;
    label?: string;
    markerEnd?: string; // 'arrow', 'circle', etc.
    animated?: boolean;
}
