import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TextElement } from '../types/schema';
import { useUIStore } from '../store/uiStore';

interface TextNodeProps {
    text: TextElement;
    isSelected: boolean;
    onSelect: () => void;
    onMove: (x: number, y: number) => void;
}

export const TextNode: React.FC<TextNodeProps> = ({ text, isSelected, onSelect, onMove }) => {

    const textWidth = Math.max(text.content.length * (text.fontSize / 1.8), 80);
    const textHeight = text.fontSize + 10;

    return (
        <Group
            id={text.id}
            x={text.x}
            y={text.y}
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
                    x={-4}
                    y={-4}
                    width={textWidth + 8}
                    height={textHeight + 8}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dash={[5, 5]}
                    listening={false}
                />
            )}

            <Rect
                width={textWidth}
                height={textHeight}
                fill="transparent"
            />

            <Text
                text={text.content || 'Texto'}
                fontSize={text.fontSize}
                fontFamily="Inter, sans-serif"
                fill="#334155"
                y={2}
            />

            <Group
                x={textWidth + 5}
                y={-2}
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
