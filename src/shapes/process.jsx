import React, { useState, useRef, useEffect } from 'react';
import { Text, Rect, Transformer } from 'react-konva';
import ConnectionHandlerBox from './connectionHandlerBox'
import { DISTANCE, SPILL } from '../utils';

const STROKE_COLOR = "rgba(0, 0, 0, .5)"
const FILL_COLOR = "white"


const ProcessItem = ({
    node,
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
    const [showConnectionHandles, setShowConnectionHandles] = useState(false)
    const [x, setX] = useState(node?.x || 0)
    const [y, setY] = useState(node?.y || 0)
    const [w, setW] = useState(node?.w || 120)
    const [h, setH] = useState(node?.h || 80)
    
    useEffect(() => {
        if (node) {
            setX(node.x)
            setY(node.y)
            setW(node.w)
            setH(node.h)
        }
    }, [node])

    return (
        <React.Fragment key={node.id}>
            <Rect
                x={x + SPILL}
                y={y + SPILL}
                width={w - (SPILL * 2)}
                height={h - (SPILL * 2)}
                fill={FILL_COLOR}
                stroke={STROKE_COLOR}
                strokeWidth={2}
                listening={false}
            />
            <Text
                x={x + w / 2}
                y={y + h / 2}
                width={w}
                // height={h - (SPILL * 2)}
                text={node?.keyname}
                fontSize={14}
                fontFamily="Arial"
                fill="black"
                align="center"
                verticalAlign="middle"
                // offsetX={w / 10}
                // offsetY={h / 10}
                listening={false}
            />
            <ConnectionHandlerBox
                node={node}
                setToFromLocs={setToFromLocs}
                callback={handleConnectionEnd}
                display={showConnectionHandles}
                listening
                onMouseEnter={(e) => {
                    setShowConnectionHandles(true)
                    setHandlesPosition({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseLeave={() => {
                    setShowConnectionHandles(false)
                    setConnectingShapeId(null);
                }}
                onMouseDown={() => {
                    setConnectingShapeId(node.id);
                }}
            />
            <Rect
                id={node.id}
                x={x - DISTANCE}
                y={y - DISTANCE}
                width={w + (2 * DISTANCE)}
                height={h + (2 * DISTANCE)}
                stroke={STROKE_COLOR}
                strokeWidth={0}
                onDragMove={(e) => handleDragEnd(node.id, e)}
                listening={true}
                onDblClick={() => handleSelect(node.id)}
                onDragEnd={e => {/** USE THIS FOR UPDATING */}}
                draggable
                ref={(nodeRef) => {
                    if (selectedShape === node.id && nodeRef) {
                        transformerRef.current.nodes([nodeRef]);
                        transformerRef.current.getLayer().batchDraw();
                    }
                }}
                onMouseEnter={(e) => {
                    setHandlesVisibleId(node.id);
                    setShowConnectionHandles(true)
                    setHandlesPosition({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseLeave={() => {
                    setHandlesVisibleId(null);
                    setShowConnectionHandles(false)
                    setConnectingShapeId(null);
                }}
                onMouseDown={() => {
                    setConnectingShapeId(node.id);
                }}
                
                pointerEvents="none"
            />
            {selectedShape && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }

                        handleTransformEnd(node.id, newBox)
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    )
}

export default ProcessItem