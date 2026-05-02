import 'reactflow/dist/style.css';
import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';
import { FilterNode }    from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { NoteNode }      from './nodes/noteNode';
import { APINode }       from './nodes/apiNode';
import { MergeNode }     from './nodes/mergeNode';

// Registered node types — key must match the type string used in store/toolbar
const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  transform:    TransformNode,
  note:         NoteNode,
  api:          APINode,
  merge:        MergeNode,
};

// MiniMap color per node type
const minimapColor = (n) =>
  ({
    customInput:  '#a78bfa',
    llm:          '#34d399',
    customOutput: '#fb923c',
    text:         '#60a5fa',
    filter:       '#f472b6',
    transform:    '#facc15',
    note:         '#94a3b8',
    api:          '#2dd4bf',
    merge:        '#c084fc',
  }[n.type] || '#4f6fa0');

const selector = (s) => ({
  nodes:         s.nodes,
  edges:         s.edges,
  getNodeID:     s.getNodeID,
  addNode:       s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect:     s.onConnect,
});

export const PipelineUI = () => {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!wrapperRef.current || !rfInstance) return;

      const raw = e.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);

      addNode({
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        flex: 1,
        background: '#0d1117',
        // Height fills whatever space remains after toolbar + submit bar
        minHeight: 0,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        snapToGrid
        snapGrid={[20, 20]}
        connectionLineType="smoothstep"
        connectionLineStyle={{
          stroke: '#4f6fa0',
          strokeWidth: 1.5,
          strokeDasharray: '5,3',
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#4f6fa0',
            strokeWidth: 1.5,
          },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#1e2d40"
          gap={24}
          size={1.2}
        />

        <Controls
          style={{
            background: '#111827',
            border: '1px solid #1e2d40',
            borderRadius: 8,
          }}
        />

        <MiniMap
          nodeColor={minimapColor}
          style={{
            background: '#111827',
            border: '1px solid #1e2d40',
            borderRadius: 8,
          }}
        />
      </ReactFlow>
    </div>
  );
};