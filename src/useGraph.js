import { useState, useCallback, useEffect } from 'react';


const useGraph = () => {
    const [nodes, setNodes] = useState(new Map());
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);

    const exportNode = () => {
        // console.log('exportNode')
        const buildTree = (nodeId) => {
            const node = nodes.get(`${nodeId}`);

            if (!node) {
                return null;
            }

            const {
                id,
                keyname,
                children: [],
                x,
                y,
                h,
                w,
                ...rest
            } = node

            return {
                id,
                keyname,
                children: [],
                x,
                y,
                h,
                w,
                // ...rest,
                children: node.children.map(buildTree)
            };
        };

        // Find root nodes (nodes without a parent)
        const rootNodes = [];

        for (const [id, node] of nodes) {
            if (node.parentId === null) {
                rootNodes.push(buildTree(id));
            }
        }

        return rootNodes;
    };

    const addNode = useCallback((metadataItem) => {
        // console.log('addNode')
        setNodes(prev => new Map(prev).set(`${metadataItem.id}`, { parentId: null, ...metadataItem, children: [] }));
    }, []);

    const setCurrentNode = useCallback((id) => {
        // console.log('setCurrentNode')
        setCurrentNodeId(id);
    }, []);

    const getCurrentNode = useCallback(() => {
        // console.log('getCurrentNode')
        return getNode(currentNodeId);
    }, [currentNodeId, nodes]);

    const getNode = useCallback((id) => {
        // console.log('getNode')
        return nodes.get(`${id}`);
    }, [nodes]);

    const updateNode = useCallback((id, updates) => {
        // console.log('updateNode')
        setNodes(prev => {
            const newNodes = new Map(prev);
            const existingNode = newNodes.get(`${id}`);

            if (existingNode) {
                // Check if updates include x and y coordinates
                const { x, y, ...restUpdates } = updates;
                const updatedNode = { ...existingNode, ...restUpdates };

                // Update x and y if provided
                if (x !== undefined && y !== undefined) {
                    updatedNode.x = x;
                    updatedNode.y = y;
                }

                newNodes.set(`${id}`, updatedNode);
            }

            return newNodes;
        });
    }, []);

    const addChild = useCallback((parentId, childId) => {
        // console.log('addChild')
        setNodes(prev => {
            const newNodes = new Map(prev);
            const parentNode = newNodes.get(`${parentId}`);
            const childNode = newNodes.get(`${childId}`);

            if (parentNode && childNode) {
                if (!parentNode.children.includes(`${childId}`)) {
                    parentNode.children.push(`${childId}`);
                    newNodes.set(`${childId}`, { ...childNode, parentId: `${parentId}` });
                }
            }
            return newNodes;
        });
    }, []);

    const getParentIds = useCallback((nodeId) => {
        // console.log('getParentIds')
        const parentIds = [];
        let currentNode = nodes.get(`${nodeId}`);

        while (currentNode && currentNode.parentId !== null) {
            parentIds.push(currentNode.parentId);
            currentNode = nodes.get(`${currentNode.parentId}`);
        }

        return parentIds;
    }, [nodes]);

    const getParentKeyNames = useCallback((nodeId) => {
        // console.log('getParentKeyNames')
        const parentNodes = [];
        const parentsIds = getParentIds(nodeId)

        for (const parentId of parentsIds) {
            parentNodes.push(nodes.get(`${parentId}`))
        }

        return parentNodes;
    }, [nodes]);

    const removeNode = useCallback((id) => {
        // console.log('removeNode')
        setNodes(prev => {
            const newNodes = new Map(prev);

            // Find the parent node and remove the reference to this node
            for (const [nodeId, node] of newNodes) {
                if (node.children && node.children.includes(id)) {
                    node.children = node.children.filter(childId => childId !== id);
                }
            }

            // Remove the node from the map
            newNodes.delete(id);

            return newNodes;
        });
    }, []);

    const getChildNodes = useCallback((nodeId) => {
        // console.log('getChildNodes')
        const node = getNode(nodeId);

        if (!node) {
            return [];
        }

        return node.children.map(childId => getNode(childId)).filter(child => !!child);
    }, [nodes]);

    const reconstructNestedJSON = useCallback((rootId) => {
        // console.log('reconstructNestedJSON')
        const rootNode = nodes.get('0');

        if (!rootNode) {
            return null;
        }

        const buildTree = (node) => {
            if (node?.children.length === 0) {
                return { ...node };
            }

            return {
                ...node,
                children: node?.children.map(childId => buildTree(nodes.get(`${childId}`))) || []
            };
        };

        return buildTree(rootNode);
    }, [nodes]);

    useEffect(() => {
        if (currentNodeId !== null) {
            const children = getChildNodes(currentNodeId);
            setCurrentChildren(children);
        }
    }, [currentNodeId, nodes, getChildNodes]);

    return {
        nodes,
        addNode,
        getNode,
        updateNode,
        setCurrentNode,
        getCurrentNode,
        addChild,
        removeNode,
        getChildNodes,
        reconstructNestedJSON,
        getParentIds,
        getParentKeyNames,
        exportNode,
        currentChildren
    };
};

export default useGraph;
