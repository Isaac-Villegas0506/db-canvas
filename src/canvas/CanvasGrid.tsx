import React from 'react';
import { Group, Line } from 'react-konva';
import { ViewState } from '../types';

interface CanvasGridProps {
    width: number;
    height: number;
    viewState: ViewState;
}

export const CanvasGrid: React.FC<CanvasGridProps> = ({ width, height, viewState }) => {
    const gridSize = 50;
    const { scale, position } = viewState;

    const startX = Math.floor((-position.x / scale) / gridSize) * gridSize;
    const startY = Math.floor((-position.y / scale) / gridSize) * gridSize;

    const endX = startX + (width / scale) + gridSize;
    const endY = startY + (height / scale) + gridSize;

    const lines = [];

    for (let x = startX; x < endX; x += gridSize) {
        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, startY, x, endY]}
                stroke="#e2e8f0"
                strokeWidth={1 / scale}
            />
        );
    }

    for (let y = startY; y < endY; y += gridSize) {
        lines.push(
            <Line
                key={`h-${y}`}
                points={[startX, y, endX, y]}
                stroke="#e2e8f0"
                strokeWidth={1 / scale}
            />
        );
    }

    return <Group listening={false}>{lines}</Group>;
};
