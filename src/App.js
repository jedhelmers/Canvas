import React, { useState, useRef, useEffect } from 'react';
import { Text, Stage, Layer, Rect, Circle, Arrow, Transformer } from 'react-konva';
import useGraph from './useGraph';
import './App.css';

const metadataItem = (id, keyname, parentId, x=(Math.random() * 800), y=(Math.random() * 800), h=40, w=80) => ({
  id,
  keyname,
  parentId,
  children: [],
  x,
  y,
  h,
  w
})


const App = ({ itemId = 0}) => {
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [connecting, setConnecting] = useState({ from: null, to: null });
  const [currentNode, setCurrentNodeState] = useState(null);
  const [_, setChildren] = useState([]);
  const transformerRef = useRef(null);

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
  const addShape = (type) => {
    const id = generateId();
    const newShape = {
      id,
      type,
      x: Math.random() * window.innerWidth / 2,
      y: Math.random() * window.innerHeight / 2,
      width: 50,
      height: 50,
      radius: 25,
      fill: 'rgba(255,0,0,.5)',
      stroke: 'rgba(255,0,0,.5)',
      strokeWidth: 2,
    };

    // Add shape to the state
    setShapes((prevShapes) => [...prevShapes, newShape]);

    // Add shape to the graph
    addNode(newShape);
  };

  // Function to handle shape selection
  const handleSelect = (id) => {
    setSelectedShape(id);
    setCurrentNode(id);
    if (connecting.from === null) {
      setConnecting({ from: id, to: null });
    } else if (connecting.to === null && connecting.from !== id) {
      setConnecting((prevConnecting) => ({ ...prevConnecting, to: id }));
      addConnection(connecting.from, id);
      setConnecting({ from: null, to: null });
    }
  };

  // Function to handle shape dragging
  // Inside handleDragEnd function
  const handleDragEnd = (id, e) => {
    const node = getNode(id)

    // const newShapes = shapes.map((shape) => {
    //     if (shape.id === id) {
    //         const updatedShape = { ...shape, x: e.target.x(), y: e.target.y() };
    //         // Update node position in the graph
    //         updateNode(id, { x: updatedShape.x, y: updatedShape.y });
    //         return updatedShape;
    //     }
    //     return shape;
    // });
  const updatedShape = { ...node, x: e.target.x(), y: e.target.y() };
  // Update node position in the graph
  updateNode(id, { x: updatedShape.x, y: updatedShape.y });
  setShapes(updatedShape);
};


  // Function to handle shape transformation
  const handleTransformEnd = (id, e) => {
    const node = e.target;
    const newShapes = shapes.map((shape) => {
      if (shape.id === id) {
        if (shape.type === 'circle') {
          const updatedShape = { ...shape, x: node.x(), y: node.y(), radius: node.radius() };
          updateNode(id, updatedShape);
          return updatedShape;
        } else if (shape.type === 'rect') {
          const updatedShape = { ...shape, x: node.x(), y: node.y(), width: node.width(), height: node.height() };
          updateNode(id, updatedShape);
          return updatedShape;
        }
      }
      return shape;
    });
    setShapes(newShapes);
  };

  // Function to add a parent-child connection
  const addConnection = (fromId, toId) => {
    addChild(fromId, toId);
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
          <Arrow points={[parentX, parentY, childX, childY]} stroke="black" fill="black" />
          {drawConnections(child.id)}
        </React.Fragment>
      );
    });
  };

  useEffect(() => {
    if (itemId === 0) {
      let item1 = metadataItem(0, 'root', null);
      addNode(item1);
      addChild(null, 1);
      
      for (let i = 1; i < 5; i++) {
        const parentId = Math.floor(i * Math.random())
        let temp = metadataItem(i, `key${i}`, parentId)
        addNode(temp);
        addChild(parentId, i);
      }
    }
  }, []);

  useEffect(() => {
    const _itemId = itemId === 0 ? 0 : itemId
    setCurrentNodeState(getNode(_itemId));
    setChildren(getChildNodes(_itemId));
    // console.log(JSON.stringify(reconstructNestedJSON(0), null, 3))
  }, [itemId, getNode, updateNode, getChildNodes, currentNode]);

  const drawNodes = (node, parent = null) => {
    // console.log('node', node)
    if (!node) return

    const elements = [];
    const x = node?.x || 0;
    const y = node?.y || 0;
    const w = node?.w || 80;
    const h = node?.h || 40;

    // Create rectangle for the node
    elements.push(
      <React.Fragment key={node.id}>
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="rgba(255,0,0,.5)"
          stroke="rgba(255,0,0,.5)"
          strokeWidth={2}
          draggable
          onDragMove={(e) => handleDragEnd(node.id, e)}
          onClick={() => setSelectedShape(node.id)}
          ref={(node) => {
            if (selectedShape === node?.attrs?.id) {
              transformerRef.current.nodes([node]);
              transformerRef.current.getLayer().batchDraw();
            }
          }}
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
      </React.Fragment>
    );

    // Draw connection to the parent
    if (parent) {
      elements.push(
        <Arrow
          points={[
            parent.x + parent.w / 2,
            parent.y + parent.h / 2,
            x + w / 2,
            y + h / 2
          ]}
          stroke="black"
          fill="black"
        />
      );
    }

    // Recursively draw child nodes
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        elements.push(...drawNodes(child, node));
      });
    }

    return elements;
  };

  return (
    <div>
      <div className="controls">
        <button onClick={() => addShape('rect')}>Add Rectangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {drawNodes(reconstructNestedJSON(0))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;