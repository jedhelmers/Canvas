import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const Toolbar = ({ onDragStart, onDragEnd }) => {
    return (
        <Stage width={200} height={100}>
            <Layer>
                <Rect
                    x={5}
                    y={5}
                    width={50}
                    height={50}
                    fill="red"
                    draggable
                    onDragEnd={e => onDragEnd('process', e.evt.pageX - 40, e.evt.pageY - 140)}
                    onDragStart={onDragStart}
                    name="red-rect"
                />
                <Rect
                    x={80}
                    y={5}
                    width={50}
                    height={50}
                    fill="blue"
                    draggable
                    onDragEnd={console.log}
                    onDragStart={onDragStart}
                    name="blue-rect"
                />
            </Layer>
        </Stage>
    );
};

export default Toolbar;
