import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Line, Transformer } from 'react-konva';
import { DISTANCE, SPILL } from '../utils';


const ConnectionHandlerBox = ({node, callback, display, onMouseEnter, onMouseLeave, setToFromLocs}) => {
    return display ? (
        <>
        {/* Corners */}
          <Circle
            x={node.x + node.w + DISTANCE}
            y={node.y + node.h + DISTANCE}
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 2)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Circle
            x={node.x - DISTANCE}
            y={node.y - DISTANCE}
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
            onDragEnd={(e) => callback(e)}
            onClick={(e) => setToFromLocs(node.id, 0)}
            onMouseDown={(e) => e.cancelBubble = true}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Circle
            x={node.x - DISTANCE}
            y={node.y + node.h + DISTANCE}
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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
            radius={5}
            fill="rgba(0, 0, 0, .25)"
            stroke="white"
            strokeWidth={2}
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