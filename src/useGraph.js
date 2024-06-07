import { useState, useCallback, useEffect } from 'react';


const useGraph = () => {
    const [nodes, setNodes] = useState(new Map());
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);

    const exportNode = () => {
        const buildTree = (nodeId) => {
            const node = nodes.get(nodeId);

            if (!node) {
                return null;
            }

            const {
                keyname,
                units,
                value,
                link,
                annotation,
                type,
                ...rest
            } = node

            return {
                keyName: keyname,
                units,
                link: {
                    value,
                    type,
                },
                annotation,
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
        setNodes(prev => new Map(prev).set(metadataItem.id, { parentId: null, ...metadataItem, children: [] }));
    }, []);

    const setCurrentNode = useCallback((id) => {
        setCurrentNodeId(id);
    }, []);

    const getCurrentNode = useCallback(() => {
        return getNode(currentNodeId);
    }, [currentNodeId, nodes]);

    const getNode = useCallback((id) => {
        return nodes.get(id);
    }, [nodes]);

    const updateNode = useCallback((id, updates) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            const existingNode = newNodes.get(id);

            if (existingNode) {
                const updatedNode = { ...existingNode, ...updates };
                newNodes.set(id, updatedNode);
            }

            return newNodes;
        });
    }, []);

    const addChild = useCallback((parentId, childId) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            const parentNode = newNodes.get(parentId);
            const childNode = newNodes.get(childId);

            if (parentNode && childNode) {
                if (!parentNode.children.includes(childId)) {
                    parentNode.children.push(childId);
                    newNodes.set(childId, { ...childNode, parentId });
                }
            }
            return newNodes;
        });
    }, []);

    const getParentIds = useCallback((nodeId) => {
        const parentIds = [];
        let currentNode = nodes.get(nodeId);

        while (currentNode && currentNode.parentId !== null) {
            parentIds.push(currentNode.parentId);
            currentNode = nodes.get(currentNode.parentId);
        }

        return parentIds;
    }, [nodes]);

    const getParentKeyNames = useCallback((nodeId) => {
        const parentNodes = [];
        const parentsIds = getParentIds(nodeId)

        for (const parentId of parentsIds) {
            parentNodes.push(nodes.get(parentId))
        }

        return parentNodes;
    }, [nodes]);

    const removeNode = useCallback((id) => {
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
        const node = getNode(nodeId);

        if (!node) {
            return [];
        }

        return node.children.map(childId => getNode(childId)).filter(child => !!child);
    }, [nodes]);

    const reconstructNestedJSON = useCallback((rootId) => {
        const rootNode = nodes.get(0);

        if (!rootNode) {
            return null;
        }

        const buildTree = (node) => {
            if (node?.children.length === 0) {
                return { ...node };
            }

            return {
                ...node,
                children: node.children.map(childId => buildTree(nodes.get(childId)))
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
