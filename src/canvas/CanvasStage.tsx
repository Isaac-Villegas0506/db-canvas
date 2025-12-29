import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Arrow, Line, Group, Text, Rect } from 'react-konva';
import { useSchemaStore } from '../store/useSchemaStore';
import { useUIStore } from '../store/uiStore';
import { TableNode } from '../nodes/TableNode';
import { NoteNode } from '../nodes/NoteNode';
import { TextNode } from '../nodes/TextNode';
import { CanvasGrid } from './CanvasGrid';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { RelationType } from '../types/schema';

const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 28;
const TABLE_WIDTH = 240;

const getColumnPortPosition = (
    table: { x: number; y: number; columns: { id: string }[] },
    columnId: string,
    side: 'left' | 'right'
) => {
    const columnIndex = table.columns.findIndex(c => c.id === columnId);
    if (columnIndex === -1) return null;

    const y = table.y + HEADER_HEIGHT + 4 + (columnIndex * ROW_HEIGHT) + ROW_HEIGHT / 2;
    const x = table.x + (side === 'right' ? TABLE_WIDTH : 0);

    return { x, y };
};

interface ConnectionState {
    tableId: string;
    columnId: string;
    side: 'left' | 'right';
    position: { x: number; y: number };
}

export const CanvasStage: React.FC = () => {
    const stageRef = useRef<any>(null);

    const {
        tables,
        relations,
        notes,
        texts,
        updateTable,
        updateNote,
        updateText,
        addTable,
        addNote,
        addText,
        addRelation,
        deleteTable,
        deleteNote,
        deleteText,
        deleteRelation,
        zoom,
        pan,
        setViewport
    } = useSchemaStore();

    const {
        activeTool,
        selectedId,
        selectedType,
        selectObject,
        setActiveTool
    } = useUIStore();

    const [connectionStart, setConnectionStart] = useState<ConnectionState | null>(null);
    const [tempEndPos, setTempEndPos] = useState<Vector2d | null>(null);
    const [showRelationModal, setShowRelationModal] = useState(false);
    const [pendingRelation, setPendingRelation] = useState<{
        source: ConnectionState;
        target: ConnectionState;
    } | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }

                if (selectedId && selectedType) {
                    e.preventDefault();

                    switch (selectedType) {
                        case 'TABLE':
                            deleteTable(selectedId);
                            break;
                        case 'NOTE':
                            deleteNote(selectedId);
                            break;
                        case 'TEXT':
                            deleteText(selectedId);
                            break;
                        case 'RELATION':
                            deleteRelation(selectedId);
                            break;
                    }

                    selectObject(null, null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, selectedType, deleteTable, deleteNote, deleteText, deleteRelation, selectObject]);

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const scaleBy = 1.05;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        const clampedScale = Math.max(0.1, Math.min(3, newScale));

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newPos = {
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        };

        setViewport(clampedScale, newPos);
    };

    const handleColumnPortClick = useCallback((
        tableId: string,
        columnId: string,
        side: 'left' | 'right',
        position: { x: number; y: number }
    ) => {
        if (activeTool !== 'RELATION') return;

        if (!connectionStart) {
            setConnectionStart({ tableId, columnId, side, position });
        } else {
            if (connectionStart.tableId !== tableId) {
                setPendingRelation({
                    source: connectionStart,
                    target: { tableId, columnId, side, position }
                });
                setShowRelationModal(true);
            }
            setConnectionStart(null);
            setTempEndPos(null);
        }
    }, [activeTool, connectionStart]);

    const createRelation = useCallback((type: RelationType) => {
        if (!pendingRelation) return;

        const { source, target } = pendingRelation;

        addRelation({
            sourceTableId: source.tableId,
            sourceColumnId: source.columnId,
            targetTableId: target.tableId,
            targetColumnId: target.columnId,
            type,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        setShowRelationModal(false);
        setPendingRelation(null);
        setActiveTool('SELECT');
    }, [pendingRelation, addRelation, setActiveTool]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        stageRef.current.setPointersPositions(e);
        const pointer = stageRef.current.getRelativePointerPosition();
        const type = e.dataTransfer.getData('nodeType');

        if (type === 'table') {
            addTable({
                name: 'Nueva Tabla',
                x: pointer.x,
                y: pointer.y,
                color: '#f8fafc'
            });
            setActiveTool('SELECT');
        } else if (type === 'note') {
            addNote({
                x: pointer.x,
                y: pointer.y,
                content: 'Doble clic para editar',
                color: '#fef3c7'
            });
            setActiveTool('SELECT');
        } else if (type === 'text') {
            addText({
                x: pointer.x,
                y: pointer.y,
                content: 'Nuevo Texto',
                fontSize: 16
            });
            setActiveTool('SELECT');
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
        if (e.target === stageRef.current) {
            selectObject(null, null);
            setConnectionStart(null);
            setTempEndPos(null);
        }
    };

    const handleMouseMove = (_e: KonvaEventObject<MouseEvent>) => {
        if (activeTool === 'RELATION' && connectionStart) {
            const pointer = stageRef.current.getRelativePointerPosition();
            if (pointer) setTempEndPos(pointer);
        }
    };

    const handleTableSelect = (tableId: string) => {
        if (activeTool !== 'RELATION') {
            selectObject(tableId, 'TABLE');
        }
    };

    const getRelationPath = (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        startSide: 'left' | 'right',
        endSide: 'left' | 'right'
    ) => {
        const dx = Math.abs(endX - startX);
        const curveOffset = Math.min(dx * 0.5, 80);

        const cp1x = startSide === 'right' ? startX + curveOffset : startX - curveOffset;
        const cp2x = endSide === 'left' ? endX - curveOffset : endX + curveOffset;

        return [
            startX, startY,
            cp1x, startY,
            cp2x, endY,
            endX, endY
        ];
    };

    const getRelationColor = (type: RelationType, isSelected: boolean) => {
        if (isSelected) return '#2563eb';
        switch (type) {
            case '1:1': return '#8b5cf6';
            case '1:N': return '#3b82f6';
            case 'N:1': return '#10b981';
            case 'N:M': return '#f59e0b';
            default: return '#94a3b8';
        }
    };

    const getRelationLabel = (type: RelationType) => {
        switch (type) {
            case '1:1': return '1:1';
            case '1:N': return '1:N';
            case 'N:1': return 'N:1';
            case 'N:M': return 'N:M';
            default: return '';
        }
    };

    const getTableConnections = (tableId: string) => {
        return relations.filter(
            r => r.sourceTableId === tableId || r.targetTableId === tableId
        ).map(r => ({
            sourceColumnId: r.sourceTableId === tableId ? r.sourceColumnId : undefined,
            targetColumnId: r.targetTableId === tableId ? r.targetColumnId : undefined
        }));
    };

    return (
        <div
            className="w-full h-full bg-slate-50 overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onWheel={handleWheel}
                onClick={handleStageClick}
                onMouseMove={handleMouseMove}
                scaleX={zoom}
                scaleY={zoom}
                x={pan.x}
                y={pan.y}
                draggable={activeTool === 'HAND'}
                onDragEnd={(e) => {
                    if (e.target === stageRef.current) {
                        setViewport(zoom, { x: e.target.x(), y: e.target.y() });
                    }
                }}
            >
                <Layer>
                    <CanvasGrid viewState={{ scale: zoom, position: pan }} width={window.innerWidth} height={window.innerHeight} />

                    {relations.map(rel => {
                        const sourceTable = tables.find(t => t.id === rel.sourceTableId);
                        const targetTable = tables.find(t => t.id === rel.targetTableId);
                        if (!sourceTable || !targetTable) return null;

                        const sourcePos = getColumnPortPosition(sourceTable, rel.sourceColumnId, 'right');
                        const targetPos = getColumnPortPosition(targetTable, rel.targetColumnId, 'left');

                        if (!sourcePos || !targetPos) {
                            const sourceHeight = HEADER_HEIGHT + (sourceTable.columns.length * ROW_HEIGHT) + 8;
                            const targetHeight = HEADER_HEIGHT + (targetTable.columns.length * ROW_HEIGHT) + 8;
                            const fallbackSource = { x: sourceTable.x + TABLE_WIDTH, y: sourceTable.y + sourceHeight / 2 };
                            const fallbackTarget = { x: targetTable.x, y: targetTable.y + targetHeight / 2 };

                            return (
                                <Arrow
                                    key={rel.id}
                                    points={[fallbackSource.x, fallbackSource.y, fallbackTarget.x, fallbackTarget.y]}
                                    stroke={getRelationColor(rel.type, selectedId === rel.id)}
                                    strokeWidth={2}
                                    fill={getRelationColor(rel.type, selectedId === rel.id)}
                                    pointerLength={8}
                                    pointerWidth={8}
                                    onClick={(e) => {
                                        e.cancelBubble = true;
                                        selectObject(rel.id, 'RELATION');
                                    }}
                                />
                            );
                        }

                        const sourceSide: 'left' | 'right' = sourcePos.x < targetPos.x ? 'right' : 'left';
                        const targetSide: 'left' | 'right' = sourcePos.x < targetPos.x ? 'left' : 'right';

                        const pathPoints = getRelationPath(
                            sourcePos.x, sourcePos.y,
                            targetPos.x, targetPos.y,
                            sourceSide, targetSide
                        );

                        const isSelected = selectedId === rel.id;
                        const color = getRelationColor(rel.type, isSelected);

                        const labelX = (sourcePos.x + targetPos.x) / 2;
                        const labelY = (sourcePos.y + targetPos.y) / 2 - 10;

                        return (
                            <Group key={rel.id}>
                                <Line
                                    points={pathPoints}
                                    stroke={color}
                                    strokeWidth={isSelected ? 3 : 2}
                                    bezier
                                    onClick={(e) => {
                                        e.cancelBubble = true;
                                        selectObject(rel.id, 'RELATION');
                                    }}
                                    onMouseEnter={(e) => {
                                        const stage = e.target.getStage();
                                        if (stage) stage.container().style.cursor = 'pointer';
                                    }}
                                    onMouseLeave={(e) => {
                                        const stage = e.target.getStage();
                                        if (stage) stage.container().style.cursor = 'default';
                                    }}
                                    hitStrokeWidth={10}
                                />

                                <Arrow
                                    points={[
                                        targetPos.x + (targetSide === 'left' ? -20 : 20),
                                        targetPos.y,
                                        targetPos.x,
                                        targetPos.y
                                    ]}
                                    stroke={color}
                                    fill={color}
                                    strokeWidth={isSelected ? 3 : 2}
                                    pointerLength={8}
                                    pointerWidth={8}
                                    listening={false}
                                />

                                <Group x={labelX - 15} y={labelY - 8}>
                                    <Rect
                                        width={30}
                                        height={16}
                                        fill="white"
                                        stroke={color}
                                        strokeWidth={1}
                                        cornerRadius={3}
                                    />
                                    <Text
                                        text={getRelationLabel(rel.type)}
                                        x={0}
                                        y={3}
                                        width={30}
                                        align="center"
                                        fontSize={10}
                                        fontStyle="bold"
                                        fill={color}
                                        listening={false}
                                    />
                                </Group>
                            </Group>
                        );
                    })}

                    {activeTool === 'RELATION' && connectionStart && tempEndPos && (
                        <Line
                            points={[
                                connectionStart.position.x,
                                connectionStart.position.y,
                                tempEndPos.x,
                                tempEndPos.y
                            ]}
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dash={[8, 4]}
                            lineCap="round"
                        />
                    )}

                    {tables.map(table => (
                        <TableNode
                            key={table.id}
                            table={table}
                            isSelected={selectedId === table.id}
                            onSelect={() => handleTableSelect(table.id)}
                            onMove={(x, y) => updateTable(table.id, { x, y })}
                            onColumnPortClick={handleColumnPortClick}
                            activeConnections={getTableConnections(table.id)}
                        />
                    ))}

                    {notes.map(note => (
                        <NoteNode
                            key={note.id}
                            note={note}
                            isSelected={selectedId === note.id}
                            onSelect={() => selectObject(note.id, 'NOTE')}
                            onMove={(x, y) => updateNote(note.id, { x, y })}
                        />
                    ))}

                    {texts.map(text => (
                        <TextNode
                            key={text.id}
                            text={text}
                            isSelected={selectedId === text.id}
                            onSelect={() => selectObject(text.id, 'TEXT')}
                            onMove={(x, y) => updateText(text.id, { x, y })}
                        />
                    ))}
                </Layer>
            </Stage>

            {showRelationModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            Tipo de Relación
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Selecciona el tipo de relación entre las tablas:
                        </p>

                        <div className="space-y-2">
                            <button
                                onClick={() => createRelation('1:1')}
                                className="w-full p-3 text-left rounded-lg border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔗</span>
                                    <div>
                                        <div className="font-semibold text-purple-600">1:1 (Uno a Uno)</div>
                                        <div className="text-xs text-slate-500">Ej: Usuario → Perfil</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => createRelation('1:N')}
                                className="w-full p-3 text-left rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📚</span>
                                    <div>
                                        <div className="font-semibold text-blue-600">1:N (Uno a Muchos)</div>
                                        <div className="text-xs text-slate-500">Ej: Autor → Libros</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => createRelation('N:1')}
                                className="w-full p-3 text-left rounded-lg border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📖</span>
                                    <div>
                                        <div className="font-semibold text-green-600">N:1 (Muchos a Uno)</div>
                                        <div className="text-xs text-slate-500">Ej: Pedidos → Cliente</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => createRelation('N:M')}
                                className="w-full p-3 text-left rounded-lg border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔄</span>
                                    <div>
                                        <div className="font-semibold text-orange-600">N:M (Muchos a Muchos)</div>
                                        <div className="text-xs text-slate-500">Ej: Estudiantes ↔ Cursos</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setShowRelationModal(false);
                                setPendingRelation(null);
                            }}
                            className="w-full mt-4 py-2 text-slate-500 hover:text-slate-700 text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
