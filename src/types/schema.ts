export type DatabaseEngine = 'MySQL' | 'PostgreSQL' | 'SQLite';

export type DataType =
    | 'INT' | 'BIGINT' | 'SMALLINT' | 'TINYINT'
    | 'FLOAT' | 'DOUBLE' | 'DECIMAL'
    | 'VARCHAR' | 'TEXT' | 'CHAR' | 'LONGTEXT'
    | 'BOOLEAN' | 'BIT'
    | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'TIME' | 'YEAR'
    | 'JSON' | 'UUID' | 'BLOB' | 'BINARY'
    | 'ENUM' | 'SET';

export type ReferentialAction = 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';

export interface Column {
    id: string;
    name: string;
    type: DataType;
    size?: number;
    precision?: number;
    scale?: number;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isNullable: boolean;
    isUnique: boolean;
    isAutoIncrement?: boolean;
    isUnsigned?: boolean;
    defaultValue?: string;
    comment?: string;
    enumValues?: string[];
    referencesTableId?: string;
    referencesColumnId?: string;
}

export interface Index {
    id: string;
    name: string;
    columnIds: string[];
    isUnique: boolean;
    type: 'BTREE' | 'HASH' | 'FULLTEXT';
}

export interface Table {
    id: string;
    name: string;
    x: number;
    y: number;
    columns: Column[];
    indexes?: Index[];
    comment?: string;
    color?: string;
    engine?: 'InnoDB' | 'MyISAM' | 'MEMORY';
    charset?: string;
    collation?: string;
}

export type RelationType = '1:1' | '1:N' | 'N:1' | 'N:M';

export interface Relation {
    id: string;
    name?: string;
    sourceTableId: string;
    sourceColumnId: string;
    targetTableId: string;
    targetColumnId: string;
    type: RelationType;
    onDelete: ReferentialAction;
    onUpdate: ReferentialAction;
    junctionTableId?: string;
    label?: string;
    color?: string;
}

export interface JunctionTable {
    id: string;
    name: string;
    sourceTableId: string;
    targetTableId: string;
    sourceColumnName: string;
    targetColumnName: string;
    additionalColumns?: Column[];
}

export interface Note {
    id: string;
    x: number;
    y: number;
    content: string;
    color: string;
    width?: number;
    height?: number;
}

export interface TextElement {
    id: string;
    x: number;
    y: number;
    content: string;
    fontSize: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
}

export interface ProjectState {
    id: string;
    name: string;
    database: DatabaseEngine;
    tables: Table[];
    relations: Relation[];
    notes: Note[];
    texts: TextElement[];
    zoom: number;
    pan: { x: number, y: number };
}

export interface ConnectionPoint {
    tableId: string;
    columnId: string;
    side: 'left' | 'right';
    x: number;
    y: number;
}
