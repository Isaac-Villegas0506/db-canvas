export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

// Support for other shape types can be added here
export type NodeType = 'table' | 'text' | 'rectangle' | 'note' | 'group';

export interface NodeData {
    label: string;
    // Specific properties for DB tables
    columns?: ColumnData[];
    tableName?: string;
    // Generic properties
    content?: string;
    color?: string;
}

export interface ColumnData {
    id: string;
    name: string;
    type: string;
    isPk?: boolean;
    isFk?: boolean;
    isNullable?: boolean;
}

export interface NodeStyle {
    backgroundColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    textColor?: string;
    fontSize?: number;
}

export interface Node {
    id: string;
    type: NodeType;
    position: Position;
    size?: Size; // Optional, some nodes might autosize
    data: NodeData;
    style?: NodeStyle;
    rotate?: number;
    selected?: boolean;
    parentId?: string; // For grouping/layers
    zIndex?: number;
}
