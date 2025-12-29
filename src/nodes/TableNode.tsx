import React, { useMemo } from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';
import { Table } from '../types/schema';
import { useUIStore } from '../store/uiStore';

const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 28;
const WIDTH = 240;
const PORT_RADIUS = 5;

interface TableNodeProps {
    table: Table;
    isSelected: boolean;
    onSelect: () => void;
    onMove: (x: number, y: number) => void;
    onColumnPortClick?: (tableId: string, columnId: string, side: 'left' | 'right', position: { x: number, y: number }) => void;
    activeConnections?: { sourceColumnId?: string, targetColumnId?: string }[];
}

export const TableNode: React.FC<TableNodeProps> = ({
    table,
    isSelected,
    onSelect,
    onMove,
    onColumnPortClick,
    activeConnections = []
}) => {
    const { activeTool } = useUIStore();
    const isConnectMode = activeTool === 'RELATION';

    const contentHeight = HEADER_HEIGHT + (table.columns.length * ROW_HEIGHT) + 8;

    const connectedColumnIds = useMemo(() => {
        const ids = new Set<string>();
        activeConnections.forEach(conn => {
            if (conn.sourceColumnId) ids.add(conn.sourceColumnId);
            if (conn.targetColumnId) ids.add(conn.targetColumnId);
        });
        return ids;
    }, [activeConnections]);

    const getColumnY = (index: number) => HEADER_HEIGHT + 4 + (index * ROW_HEIGHT) + ROW_HEIGHT / 2;

    const handlePortClick = (columnId: string, side: 'left' | 'right', index: number) => {
        if (isConnectMode && onColumnPortClick) {
            const y = getColumnY(index);
            const x = side === 'left' ? 0 : WIDTH;
            onColumnPortClick(table.id, columnId, side, { x: table.x + x, y: table.y + y });
        }
    };

    const getColumnIcon = (col: typeof table.columns[0]) => {
        if (col.isPrimaryKey) return '🔑';
        if (col.isForeignKey) return '🔗';
        if (col.isUnique) return '◆';
        return null;
    };

    const getTypeColor = (type: string) => {
        if (['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'FLOAT', 'DOUBLE', 'DECIMAL'].includes(type)) {
            return '#3b82f6';
        }
        if (['VARCHAR', 'TEXT', 'CHAR', 'LONGTEXT'].includes(type)) {
            return '#10b981';
        }
        if (['DATE', 'DATETIME', 'TIMESTAMP', 'TIME'].includes(type)) {
            return '#f59e0b';
        }
        if (type === 'BOOLEAN' || type === 'BIT') {
            return '#8b5cf6';
        }
        return '#64748b';
    };

    return (
        <Group
            id={table.id}
            x={table.x}
            y={table.y}
            draggable={!isConnectMode}
            onDragEnd={(e) => {
                onMove(e.target.x(), e.target.y());
            }}
            onClick={(e) => {
                e.cancelBubble = true;
                if (!isConnectMode) {
                    onSelect();
                }
            }}
            onMouseEnter={(e) => {
                if (!isConnectMode) {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'move';
                }
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'default';
            }}
        >
            {isSelected && (
                <Rect
                    x={-3}
                    y={-3}
                    width={WIDTH + 6}
                    height={contentHeight + 6}
                    cornerRadius={9}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    listening={false}
                />
            )}

            <Rect
                x={2}
                y={4}
                width={WIDTH}
                height={contentHeight}
                fill="#00000010"
                cornerRadius={6}
                listening={false}
            />

            <Rect
                width={WIDTH}
                height={contentHeight}
                fill="white"
                cornerRadius={6}
                stroke="#e2e8f0"
                strokeWidth={1}
            />

            <Group>
                <Rect
                    width={WIDTH}
                    height={HEADER_HEIGHT}
                    fill={table.color || '#f1f5f9'}
                    cornerRadius={[6, 6, 0, 0]}
                />
                <Line
                    points={[0, HEADER_HEIGHT, WIDTH, HEADER_HEIGHT]}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                />
                <Text
                    text="☰"
                    x={10}
                    y={10}
                    fontSize={14}
                    fill="#64748b"
                    listening={false}
                />
                <Text
                    text={table.name}
                    x={30}
                    y={10}
                    fontSize={14}
                    fontStyle="bold"
                    fill="#1e293b"
                    width={WIDTH - 70}
                    ellipsis
                    listening={false}
                />
                <Group x={WIDTH - 35} y={9}>
                    <Rect
                        width={24}
                        height={18}
                        fill="#e2e8f0"
                        cornerRadius={9}
                    />
                    <Text
                        text={String(table.columns.length)}
                        x={0}
                        y={3}
                        width={24}
                        align="center"
                        fontSize={11}
                        fill="#64748b"
                        listening={false}
                    />
                </Group>
            </Group>

            <Group
                x={WIDTH - 28}
                y={6}
                onClick={(e) => {
                    e.cancelBubble = true;
                    onSelect();
                    useUIStore.getState().openProperties();
                }}
                onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'pointer';
                }}
                onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = isConnectMode ? 'crosshair' : 'move';
                }}
                visible={!isConnectMode}
            >
                <Rect
                    width={22}
                    height={22}
                    fill="#3b82f6"
                    cornerRadius={4}
                />
                <Text
                    text="✎"
                    x={5}
                    y={3}
                    fontSize={12}
                    fill="white"
                    listening={false}
                />
            </Group>

            <Group y={HEADER_HEIGHT + 4}>
                {table.columns.map((col, index) => {
                    const isConnected = connectedColumnIds.has(col.id);
                    const rowY = index * ROW_HEIGHT;

                    return (
                        <Group key={col.id} y={rowY}>
                            <Rect
                                x={0}
                                y={0}
                                width={WIDTH}
                                height={ROW_HEIGHT}
                                fill={isConnected ? '#eff6ff' : 'transparent'}
                                listening={false}
                            />

                            {isConnectMode && (
                                <Group
                                    x={0}
                                    y={ROW_HEIGHT / 2}
                                    onClick={(e) => {
                                        e.cancelBubble = true;
                                        handlePortClick(col.id, 'left', index);
                                    }}
                                    onMouseEnter={(e) => {
                                        const container = e.target.getStage()?.container();
                                        if (container) container.style.cursor = 'crosshair';
                                    }}
                                    onMouseLeave={(e) => {
                                        const container = e.target.getStage()?.container();
                                        if (container) container.style.cursor = 'default';
                                    }}
                                >
                                    <Circle
                                        x={0}
                                        radius={PORT_RADIUS + 3}
                                        fill="transparent"
                                    />
                                    <Circle
                                        x={0}
                                        radius={PORT_RADIUS}
                                        fill={col.isPrimaryKey ? '#f59e0b' : '#3b82f6'}
                                        stroke="white"
                                        strokeWidth={2}
                                    />
                                </Group>
                            )}

                            {getColumnIcon(col) && (
                                <Text
                                    text={getColumnIcon(col)!}
                                    x={10}
                                    y={7}
                                    fontSize={10}
                                    listening={false}
                                />
                            )}

                            {!col.isPrimaryKey && !col.isForeignKey && (
                                <Text
                                    text={col.isNullable ? '○' : '●'}
                                    x={12}
                                    y={6}
                                    fontSize={10}
                                    fill={col.isNullable ? '#94a3b8' : '#64748b'}
                                    listening={false}
                                />
                            )}

                            <Text
                                text={col.name}
                                x={28}
                                y={7}
                                fontSize={12}
                                fontStyle={col.isPrimaryKey ? 'bold' : 'normal'}
                                fill={col.isPrimaryKey ? '#1e293b' : '#334155'}
                                width={110}
                                ellipsis
                                listening={false}
                            />

                            <Text
                                text={col.size ? `${col.type}(${col.size})` : col.type}
                                x={145}
                                y={7}
                                fontSize={10}
                                fontFamily="monospace"
                                fill={getTypeColor(col.type)}
                                width={70}
                                align="right"
                                listening={false}
                            />

                            {isConnectMode && (
                                <Group
                                    x={WIDTH}
                                    y={ROW_HEIGHT / 2}
                                    onClick={(e) => {
                                        e.cancelBubble = true;
                                        handlePortClick(col.id, 'right', index);
                                    }}
                                    onMouseEnter={(e) => {
                                        const container = e.target.getStage()?.container();
                                        if (container) container.style.cursor = 'crosshair';
                                    }}
                                    onMouseLeave={(e) => {
                                        const container = e.target.getStage()?.container();
                                        if (container) container.style.cursor = 'default';
                                    }}
                                >
                                    <Circle
                                        x={0}
                                        radius={PORT_RADIUS + 3}
                                        fill="transparent"
                                    />
                                    <Circle
                                        x={0}
                                        radius={PORT_RADIUS}
                                        fill={col.isPrimaryKey ? '#f59e0b' : '#3b82f6'}
                                        stroke="white"
                                        strokeWidth={2}
                                    />
                                </Group>
                            )}

                            {index < table.columns.length - 1 && (
                                <Line
                                    points={[8, ROW_HEIGHT, WIDTH - 8, ROW_HEIGHT]}
                                    stroke="#f1f5f9"
                                    strokeWidth={1}
                                    listening={false}
                                />
                            )}
                        </Group>
                    );
                })}
            </Group>
        </Group>
    );
};
