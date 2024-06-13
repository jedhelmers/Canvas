import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Line, Transformer } from 'react-konva';

const DISTANCE = 6
const STROKE_COLOR = "rgba(0, 0, 0, .5)"
const FILL_COLOR = "white"
const RADIUS = 4
const STROKE = 1


const POINTS = (node) => [
  {x: DISTANCE, y: DISTANCE}, // TL CORNER 0
  {x: -node.w/2, y: DISTANCE}, // TOP C 1
  {x: -node.w - DISTANCE, y: DISTANCE}, // TR CORNER 2
  {x: -node.w - DISTANCE, y: -node.h/2}, // R SIDE 3
  {x: -node.w - DISTANCE, y: -node.h - DISTANCE}, // BR CORNER 4
  {x: -node.w/2, y: -node.h - DISTANCE}, // BOTTOM C 5
  {x: DISTANCE, y: -node.h - DISTANCE}, // BL CORNER 6
  {x: DISTANCE, y: -node.h/2}, // L SIDE 7
]


const ConnectionHandlerBox = ({
  node,
  callback,
  display,
  onMouseEnter,
  onMouseLeave,
  setToFromLocs
}) => {
  return display ? (
      <>
        {
          POINTS(node).map((point, i) => (
            <Circle
              key={`${i}_${Math.random()}`}
              radius={RADIUS}
              fill={FILL_COLOR}
              stroke={STROKE_COLOR}
              strokeWidth={STROKE}
              listening={true}
              onDragEnd={(e) => callback(e)}
              onClick={(e) => setToFromLocs(node.id, i)}
              onMouseDown={(e) => e.cancelBubble = true}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              offsetX={point.x}
              offsetY={point.y}
            />
          ))
        }
      </>
  ) : null
}


export default ConnectionHandlerBox