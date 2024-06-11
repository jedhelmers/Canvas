import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Line, Transformer } from 'react-konva';
import ConnectionHandlerBox from './connectionHandlerBox'
import { DISTANCE, SPILL } from '../utils';


const WorkflowItem = ({
    node,
    w,
    x,
    y,
    h,
    setHandlesVisibleId,
    setHandlesPosition,
    handleSelect,
    handleDragEnd,
    selectedShape,
    setToFromLocs,
    handleTransformEnd,
    setConnectingShapeId,
    handlesVisibleId,
    transformerRef,
    handleConnectionEnd,
}) => {

    return (
        <React.Fragment key={node.id}>
            <Rect
                id={node.id}
                x={x - DISTANCE - SPILL}
                y={y - DISTANCE - SPILL}
                width={w + (2 * DISTANCE) + (2 * SPILL)}
                height={h + (2 * DISTANCE) + (2 * SPILL)}
                stroke="rgba(255,0,0,.05)"
                strokeWidth={2}
                onMouseEnter={(e) => {
                setHandlesVisibleId(node.id);
                setHandlesPosition({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseLeave={() => {
                setHandlesVisibleId(null);
                setConnectingShapeId(null);
                }}
                onMouseDown={() => {
                setConnectingShapeId(node.id);
                }}
                pointerEvents="none"
            ></Rect>
            <Rect
                x={x + 10}
                y={y}
                width={w - 20}
                height={h}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={2}
                listening={false}
            />
            <Rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="rgba(255,255,255,.5)"
                stroke="rgba(255,0,0,.5)"
                strokeWidth={2}
                draggable
                // sceneFunc={console.log}
                onDblClick={() => handleSelect(node.id)}
                onDragEnd={e => {/** USE THIS FOR UPDATING */}}
                onDragMove={(e) => handleDragEnd(node.id, e)}
                listening={true}
                ref={(nodeRef) => {
                if (selectedShape === node.id && nodeRef) {
                    transformerRef.current.nodes([nodeRef]);
                    transformerRef.current.getLayer().batchDraw();
                }
                }}
                onMouseEnter={(e) => {
                setHandlesVisibleId(node.id);
                setHandlesPosition({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseLeave={() => {
                setHandlesVisibleId(null);
                setConnectingShapeId(null);
                }}
                onMouseDown={() => {
                setConnectingShapeId(node.id);
                }}
                onTransformEnd={(e) => handleTransformEnd(node.id, e)}
            />
            <Text
                x={x + w / 2}
                y={y + h / 2}
                text={node?.keyname}
                fontSize={14}
                fontFamily="Arial"
                fill="black"
                align="center"
                verticalAlign="middle"
                offsetX={w / 4}
                offsetY={h / 4}
            />

            <ConnectionHandlerBox
                node={node}
                setToFromLocs={setToFromLocs}
                callback={handleConnectionEnd}
                display={handlesVisibleId === node.id}
                onMouseEnter={(e) => {
                setHandlesVisibleId(node.id);
                setHandlesPosition({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseLeave={() => {
                setHandlesVisibleId(null);
                setConnectingShapeId(null);
                }}
                onMouseDown={() => {
                setConnectingShapeId(node.id);
                }}
            />

            {selectedShape && (
                <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                    }
                    return newBox;
                }}
                />
            )}
        </React.Fragment>
    )
}

export default WorkflowItem