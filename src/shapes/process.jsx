import React, { useState, useRef, useEffect } from 'react';
import { Text, Rect, Transformer, Group } from 'react-konva';
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
    const [showTransform, setShowTransformer] = useState(true)
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
        <Group
            key={node.id}
            x={x}
            y={y}
            draggable
            onDragStart={e => setShowConnectionHandles(false)}
            onDragEnd={e => setShowConnectionHandles(true)}
            onDragMove={(e) => handleDragEnd(node.id, e)}
            onDblClick={() => setShowTransformer(node.id)}
        >
            <Rect
                width={w}
                height={h}
                fill={FILL_COLOR}
                stroke={STROKE_COLOR}
                strokeWidth={2}
            />
            <Text
                width={w}
                height={h}
                text={node?.keyname}
                fontSize={14}
                fontFamily="Arial"
                fill="black"
                align="center"
                verticalAlign="middle"
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
            {showTransform && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        console.log(oldBox, newBox)
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }

                        handleTransformEnd(node.id, newBox)
                        return newBox;
                    }}
                />
            )}
        </Group>
    )
}

export default ProcessItem