import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

const HANDLE_SIZE = 10;
const HANDLE_OFFSET = 20; // Offset for the invisible rectangle

const ConnectionHandle = ({ x, y, visible, onClick }) => (
  <Circle
    x={x}
    y={y}
    radius={HANDLE_SIZE}
    fill="red"
    visible={visible}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.target.scale({ x: 1.2, y: 1.2 });
      e.target.getLayer().draw();
    }}
    onMouseLeave={(e) => {
      e.target.scale({ x: 1, y: 1 });
      e.target.getLayer().draw();
    }}
  />
);

const DraggableRect = () => {
  const [handlesVisible, setHandlesVisible] = useState(false);
  const handleVisibilityTimeout = useRef(null);

  // Coordinates for the main Rect
  const rectX = 150;
  const rectY = 100;
  const rectWidth = 200;
  const rectHeight = 100;

  // Coordinates for connection handles around the Rect
  const handleCoords = [
    { x: rectX, y: rectY }, // top-left
    { x: rectX + rectWidth, y: rectY }, // top-right
    { x: rectX, y: rectY + rectHeight }, // bottom-left
    { x: rectX + rectWidth, y: rectY + rectHeight }, // bottom-right
  ];

  const showHandles = () => {
    clearTimeout(handleVisibilityTimeout.current);
    setHandlesVisible(true);
  };

  const hideHandles = () => {
    handleVisibilityTimeout.current = setTimeout(() => {
      setHandlesVisible(false);
    }, 200);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* Main Rectangle */}
        <Rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="lightblue"
          stroke="black"
          strokeWidth={2}
        />
        {/* Text inside Rectangle */}
        <Text
          x={rectX}
          y={rectY + rectHeight / 2 - 10}
          width={rectWidth}
          align="center"
          text="Draggable Rect"
          fontSize={16}
          fontFamily="Arial"
          fill="black"
        />
        {/* Invisible Draggable Rectangle */}
        <Rect
          x={rectX - HANDLE_OFFSET}
          y={rectY - HANDLE_OFFSET}
          width={rectWidth + HANDLE_OFFSET * 2}
          height={rectHeight + HANDLE_OFFSET * 2}
          fill="transparent"
          draggable
          onMouseEnter={showHandles}
          onMouseLeave={hideHandles}
          onDragMove={(e) => {
            const node = e.target;
            const newPos = node.getPosition();
            node.x(rectX - HANDLE_OFFSET + newPos.x);
            node.y(rectY - HANDLE_OFFSET + newPos.y);
          }}
          onDragEnd={(e) => {
            console.log('Drag ended', e.target.x(), e.target.y());
          }}
        />
        {/* Connection Handles */}
        {handleCoords.map((coord, i) => (
          <ConnectionHandle
            key={i}
            x={coord.x}
            y={coord.y}
            visible={handlesVisible}
            onClick={() => alert(`Handle ${i + 1} clicked!`)}
            onMouseEnter={showHandles}
            onMouseLeave={hideHandles}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default DraggableRect;
