import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  getNodeID: (type) => {
    const ids = get().nodes.map(n => n.id);
    const prefix =
      type === 'customInput'  ? 'input'  :
      type === 'customOutput' ? 'output' : type;
    let i = 1;
    while (ids.includes(`${prefix}_${i}`)) i++;
    return `${prefix}_${i}`;
  },

  addNode: (node) => set(s => ({ nodes: [...s.nodes, node] })),

  onNodesChange: (changes) =>
    set(s => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set(s => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set(s => ({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: true },
        s.edges
      ),
    })),

  updateNodeField: (nodeId, field, value) =>
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, [field]: value } }
          : n
      ),
    })),
}));