import React from 'react';
import { Line } from 'react-konva';

const Grid = ({ width, height, cellSize }) => {
    const verticalLines = [];
    const horizontalLines = [];

    // Create vertical lines
    for (let i = 0; i <= width; i += cellSize) {
        verticalLines.push(
            <Line
                key={`v-${i}`}
                points={[i, 0, i, height]}
                stroke="#ddd"
                strokeWidth={1}
            />
        );
    }

    // Create horizontal lines
    for (let i = 0; i <= height; i += cellSize) {
        horizontalLines.push(
            <Line
                key={`h-${i}`}
                points={[0, i, width, i]}
                stroke="#ddd"
                strokeWidth={1}
            />
        );
    }

    return (
        <>
            {verticalLines}
            {horizontalLines}
        </>
    );
};

export default Grid;
