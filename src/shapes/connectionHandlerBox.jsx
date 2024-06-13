import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Line, Transformer } from 'react-konva';

const DISTANCE = 0
const STROKE_COLOR = "rgba(0, 0, 0, .5)"
const FILL_COLOR = "white"
const RADIUS = 4
const STROKE = 1


const ConnectionHandlerBox = ({node, callback, display, onMouseEnter, onMouseLeave, setToFromLocs}) => {
    return display ? (
        <>
        {/* Corners */}
          <Circle
            x={node.x + node.w + DISTANCE}
            y={node.y + node.h + DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            listening={true}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 4)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Circle
            x={node.x + node.w + DISTANCE}
            y={node.y - DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 2)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Circle
            x={node.x - DISTANCE}
            y={node.y - DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 0)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Circle
            x={node.x - DISTANCE}
            y={node.y + node.h + DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 7)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
          />
  
          {/* Top + Bottom */}
          <Circle
            x={node.x + (node.w/2)}
            y={node.y + node.h + DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            draggable
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 5)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
          />
          <Circle
            x={node.x + (node.w/2)}
            y={node.y - DISTANCE}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            draggable
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 1)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
          />
  
          {/* Sides */}
          <Circle
            x={node.x - DISTANCE}
            y={node.y + (node.h/2)}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            draggable
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 8)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
          />
          <Circle
            x={node.x + (node.w) + DISTANCE}
            y={node.y + (node.h/2)}
            radius={RADIUS}
            fill={FILL_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth={STROKE}
            draggable
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 3)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
          />
        </>
    ) : null
  }
  

  export default ConnectionHandlerBox