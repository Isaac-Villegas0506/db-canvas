import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { Note } from '../types/schema';
import { useUIStore } from '../store/uiStore';

interface NoteNodeProps {
    note: Note;
    isSelected: boolean;
    onSelect: () => void;
    onMove: (x: number, y: number) => void;
}

export const NoteNode: React.FC<NoteNodeProps> = ({ note, isSelected, onSelect, onMove }) => {

    return (
        <Group
            id={note.id}
            x={note.x}
            y={note.y}
            draggable
            onDragEnd={(e) => onMove(e.target.x(), e.target.y())}
            onClick={(e) => {
                e.cancelBubble = true;
                onSelect();
            }}
            onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'move';
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'default';
            }}
        >
            {isSelected && (
                <Rect
                    x={-2}
                    y={-2}
                    width={204}
                    height={204}
                    cornerRadius={4}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    listening={false}
                />
            )}

            <Rect
                width={200}
                height={200}
                fill={note.color || '#fef08a'}
                cornerRadius={2}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.1}
                shadowOffsetY={5}
            />

            <Text
                text={note.content || 'Doble clic para editar'}
                x={10}
                y={35}
                width={180}
                height={160}
                fontSize={14}
                fontFamily="Inter, sans-serif"
                fill="#451a03"
                lineHeight={1.4}
                listening={false}
            />

            <Group
                x={175}
                y={5}
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
                    if (container) container.style.cursor = 'move';
                }}
            >
                <Rect
                    width={20}
                    height={20}
                    fill="#3b82f6"
                    cornerRadius={4}
                />
                <Text
                    text="..."
                    x={4}
                    y={1}
                    fontSize={14}
                    fontStyle="bold"
                    fill="white"
                    listening={false}
                />
            </Group>
        </Group>
    );
};
