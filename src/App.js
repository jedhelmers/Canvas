import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Line, Transformer } from 'react-konva';
import ProcessItem from './shapes/process'
import WorkflowItem from './shapes/workflow'
import Toolbar from './shapes/toolbar';
import Grid from './shapes/grid';
import { DISTANCE, PADDING, metadataItem } from './utils';
import useGraph from './useGraph';
import './App.css';


const App = ({ itemId = 0}) => {
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [stageHeight, setStageHeight] = useState(window.innerHeight);
  const [cellSize, setCellSize] = useState(20);
  const [shapes, setShapes] = useState([]);
  const [graph, setGraph] = useState({})
  const [selectedShape, setSelectedShape] = useState(null);
  const [connecting, setConnecting] = useState({ from: null, to: null });
  const [currentNode, setCurrentNodeState] = useState(null);
  const [_, setChildren] = useState([]);
  const [handlesVisibleId, setHandlesVisibleId] = useState(null);
  const [handlesPosition, setHandlesPosition] = useState({ x: 0, y: 0 });
  const [connectingShapeId, setConnectingShapeId] = useState(null);
  const [toFrom, setToFrom] = useState([null, null])

  const transformerRef = useRef(null);
  const layerRef = useRef(null)

  const {
    nodes,
    addNode,
    getNode,
    updateNode,
    setCurrentNode,
    getCurrentNode,
    addChild,
    getChildNodes,
    reconstructNestedJSON,
  } = useGraph();

  // Generate a unique string-based ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Function to add new shapes with string-based IDs
  const addShape = (type, x = 10, y = 10) => {
    const id = generateId();
    // const newShape = {
    //   id,
    //   type,
    //   x,
    //   y,
    //   width: 50,
    //   height: 50,
    //   radius: 25,
    //   fill: 'rgba(255,0,0,.5)',
    //   stroke: 'rgba(255,0,0,.5)',
    //   strokeWidth: 2,
    // };

    const newShape = metadataItem({
      id,
      keyname: "Process",
      parentId: null,
      x,
      y
    })

    // Add shape to the state
    setShapes((prevShapes) => [
      ...prevShapes.map(shape => {
        console.log('shape', shape)
        return shape
      }),
      newShape]);

    // Add shape to the graph
    addNode(newShape);
  };

  const getConnectorHandleLoc = (id, pos) => {
    const node = getNode(id)

    switch (String(pos)) {
      case '0':
        return [
          node.x - DISTANCE,
          node.y - DISTANCE,
        ]
      case '1':
        return [
          node.x + (node.w/2),
          node.y - DISTANCE
        ]
      case '2':
        return [
          node.x + node.w + DISTANCE,
          node.y - DISTANCE
        ]
      case '3':
        return [
          node.x + (node.w) + DISTANCE,
          node.y + (node.h/2)
        ]
      case '4':
        return [
          node.x + node.w + DISTANCE,
          node.y + node.h + DISTANCE,
        ]
      case '5':
        return [
          node.x + (node.w/2),
          node.y + node.h + DISTANCE
        ]
      case '6':
        return [
          node.x,
          node.y
        ]
      case '7':
        return [
          node.x - DISTANCE,
          node.y + node.h + DISTANCE
        ]
      case '8':
        return [
          node.x - DISTANCE,
          node.y + (node.h/2)
        ]
      default:
        return [0,0]
    }
  }

  // Function to handle shape selection
  const handleSelect = (id, pos = 4) => {
    console.log('WEW')
    setSelectedShape(id);
    setCurrentNode(id);
    // console.log(id)
    // console.log(connecting)
    if (connecting.from === null) {
      setConnecting({ from: id, to: null });
    } else if (connecting.to === null && connecting.from !== id) {
      setConnecting((prevConnecting) => ({ ...prevConnecting, to: id }));
      addConnection(connecting.from, id, pos);
      setConnecting({ from: null, to: null });
    }
  };

  // Function to handle shape dragging
  // Inside handleDragEnd function
  const handleDragEnd = (id, e) => {
    const node = getNode(id); // Directly get the node
    if (!node) return;

    if (true || ~~e.target.x() % (cellSize / 2) === 0 || ~~e.target.y() % (cellSize / 2) === 0) {
      const updatedShape = { ...node, x: e.target.x(), y: e.target.y() };

      // Update node position in the graph
      updateNode(id, { x: updatedShape.x, y: updatedShape.y });

      // Update shapes with the new position (if necessary)
      setShapes(prevShapes => {
        const shapeIndex = prevShapes.findIndex(shape => shape.id === id);
        if (shapeIndex !== -1) {
          const newShapes = [...prevShapes];
          newShapes[shapeIndex] = updatedShape;
          return newShapes;
        }
        return prevShapes;
      });
    }
  };

  // Function to handle shape transformation
  const handleTransformEnd = (id, e) => {
    console.log(id, e)
    const node = getNode(id); // Directly get the node

    if (!node) return;

    // const scaleX = e.target.scaleX();
    // const scaleY = e.target.scaleY();

    // Update the node's dimensions and position
    const updatedNode = {
      x: e.x,
      y: e.y,
      w: e.width,
      h: e.height
    };

    // Reset scale to avoid cumulative scaling issues
    // e.target.scaleX(1);
    // e.target.scaleY(1);

    // Update node dimensions in the graph
    updateNode(id, updatedNode);

    // Update shapes with the new dimensions (if necessary)
    setShapes(prevShapes => {
      const shapeIndex = prevShapes.findIndex(shape => shape.id === id);
      if (shapeIndex !== -1) {
        const newShapes = [...prevShapes];
        newShapes[shapeIndex] = { ...node, ...updatedNode };
        return newShapes;
      }
      return prevShapes;
    });
  };

  // Function to add a parent-child connection
  const addConnection = (fromId, toId, pos) => {
    addChild(fromId, toId, pos);
  };

  // Function to draw connections
  const drawConnections = (parentId) => {
    const parentNode = getNode(parentId);
    if (!parentNode) {
      return null;
    }
    const childNodes = getChildNodes(parentId);
    return childNodes.map((child) => {
      if (!child) return null;
      const parentShape = shapes.find((shape) => shape.id === parentId);
      const childShape = shapes.find((shape) => shape.id === child.id);
      if (!parentShape || !childShape) return null;

      const parentX = parentShape.x + (parentShape.width || parentShape.radius || 0) / 2;
      const parentY = parentShape.y + (parentShape.height || parentShape.radius || 0) / 2;
      const childX = childShape.x + (childShape.width || childShape.radius || 0) / 2;
      const childY = childShape.y + (childShape.height || childShape.radius || 0) / 2;

      return (
        <React.Fragment key={`${parentId}-${child.id}`}>
          <Arrow
            points={[
              parentX,
              parentY,
              childX,
              childY
            ]}
            stroke="black"
            fill="black"
          />
          {drawConnections(child.id)}
        </React.Fragment>
      );
    });
  };

  const handleConnectionEnd = (e) => {
    const target = e.target;
    const stage = target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const shape = stage.getIntersection(pointerPosition);

    if (shape) {
      const shapeId = shape.attrs.id;
      if (shapeId && connectingShapeId !== shapeId) {
        // Create a connection from connectingShapeId to shapeId
        console.log('WOO')
        addChild(connectingShapeId, shapeId, 4);
      }
    }

    setHandlesVisibleId(shape.attrs.id);
    setConnectingShapeId(null);
  };

  const setToFromLocs = (id, pos) => {
    // console.log(pos)

    if (id && !toFrom.includes(id)) {
      if (!toFrom[0]?.id) {
        setToFrom([
          {
            id,
            posTo: pos
          },
          null
        ])
      } else if (!toFrom[1]?.id) {
        setToFrom([
          {
            id: toFrom[0].id,
            posTo: toFrom[0].posTo
          },
          {
            id,
            posTo: pos
          },
        ])
      } else {
        setToFrom([null, null])
      }
    }
  }

  const createAdvancedOrthogonalPath = (startPoint, endPoint, middlePoint = null) => {
    const path = [startPoint];
    const [startX, startY] = startPoint;
    const [endX, endY] = endPoint;

    // Determine the direction to extend the padding
    const horizontalPadding = startX < endX ? PADDING : -PADDING;
    const verticalPadding = startY < endY ? PADDING : -PADDING;

    // Extend outward by PADDING pixels before bending
    if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
      // Horizontal path
      path.push([startX + horizontalPadding, startY]);

      if (middlePoint) {
        path.push([middlePoint[0], startY + verticalPadding]);
        path.push(middlePoint);
        path.push([middlePoint[0], endY - verticalPadding]);
      } else {
        path.push([endX - horizontalPadding, startY]);
      }
    } else {
      // Vertical path
      path.push([startX, startY + verticalPadding]);

      if (middlePoint) {
        path.push([startX + horizontalPadding, middlePoint[1]]);
        path.push(middlePoint);
        path.push([endX - horizontalPadding, middlePoint[1]]);
      } else {
        path.push([startX, endY - verticalPadding]);
      }
    }

    // Finally, move to the end point
    path.push(endPoint);

    return path;
  }

  useEffect(() => {
    if (toFrom[0]?.id && toFrom[1]?.id) {
      const parentNode = getNode(toFrom[0].id)
      const childNode = getNode(toFrom[1].id)

      childNode.parentId = parentNode.id
      updateNode(childNode.id, childNode)

      parentNode.children.push({id: `${childNode.id}`, posTo: toFrom[1]?.posTo, posFrom: toFrom[0]?.posFrom})
      updateNode(parentNode.id, parentNode)

      // Reset
      setToFrom([null, null])
    }
  }, [toFrom])

  useEffect(() => {
    if (itemId === 0) {
      let item1 = metadataItem({id: 0, keyname: 'root', parentId: null});
      addNode(item1);
      addChild(null, 1, 0);

      for (let i = 1; i < 5; i++) {
        const parentId = Math.floor(i * Math.random())
        let temp = metadataItem({id: i, keyname: `key${i}`, parentId: parentId})
        addNode(temp);
        addChild(parentId, i, Math.floor(8 * Math.random()), Math.floor(8 * Math.random()));
      }
    }
  }, []);

  useEffect(() => {
    // console.log(nodes)
  }, [nodes])

  useEffect(() => {
    const _itemId = itemId === 0 ? 0 : itemId
    setCurrentNodeState(getNode(_itemId));
    setChildren(getChildNodes(_itemId));
    setGraph(reconstructNestedJSON(0))
  }, [itemId, getNode, getChildNodes, currentNode]);

  // useEffect to handle window resize
  useEffect(() => {
      const handleResize = () => {
          setStageHeight(window.innerHeight);
          setStageWidth(window.innerWidth)
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function to remove event listener
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  const drawShapeNodes = (node) => {
    if (!node) return

    const elements = [];

    // Create rectangle for the node
    elements.push(
      <ProcessItem
        node={node}
        setHandlesVisibleId={setHandlesVisibleId}
        setHandlesPosition={setHandlesPosition}
        handleSelect={handleSelect}
        handleDragEnd={handleDragEnd}
        selectedShape={selectedShape}
        setConnectingShapeId={setConnectingShapeId}
        transformerRef={transformerRef}
        setToFromLocs={setToFromLocs}
        handleTransformEnd={handleTransformEnd}
        handleConnectionEnd={handleConnectionEnd}
      />
    );

    return elements
  };

  const drawLines = () => {
    if (!nodes) return

    const elements = [];

    for (const parentNode of [...nodes.values()]) {
      for (const childLine of parentNode.children) {
        const fromCoords = getConnectorHandleLoc(parentNode.id, childLine.posFrom)
        const toCoords = getConnectorHandleLoc(childLine.id, childLine.posTo)

        elements.push(
          <Line
            points={
              createAdvancedOrthogonalPath(fromCoords, toCoords).flat()
            }
            stroke="black"
            fill="black"
          />
        )
      }
    }

    return elements
  };

  return (
    <div>
      <div className="controls">
        <Toolbar onDragEnd={addShape}/>
        <button onClick={() => addShape('rect')}>Add Rectangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
      </div>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          <Grid width={stageWidth} height={stageHeight} cellSize={cellSize} />
        </Layer>
        <Layer>
          {drawLines()}
        </Layer>
        <Layer ref={layerRef}>
          <Transformer
            ref={transformerRef}
          />
          {
            [...nodes.values()].map(node => drawShapeNodes(node))
          }
        </Layer>
      </Stage>
    </div>
  );
};

export default App;