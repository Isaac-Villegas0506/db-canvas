import { useCallback } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '../store/canvasStore';

export const useZoomPan = () => {
    const { viewState, setViewState } = useCanvasStore();

    const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        const scaleBy = 1.1;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        // Limit scale
        if (newScale < 0.1 || newScale > 5) return;

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        setViewState({ scale: newScale, position: newPos });
    }, [viewState, setViewState]);

    return { handleWheel };
};
