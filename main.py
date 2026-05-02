# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional
# from collections import deque

# app = FastAPI()

# # Allow the React dev server to call this API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ── Pydantic models ──────────────────────────────────────────────────────────

# class NodeData(BaseModel):
#     id: Optional[str] = None
#     nodeType: Optional[str] = None

# class Node(BaseModel):
#     id: str
#     type: Optional[str] = None
#     data: Optional[NodeData] = None

# class Edge(BaseModel):
#     id: str
#     source: str
#     target: str
#     sourceHandle: Optional[str] = None
#     targetHandle: Optional[str] = None

# class Pipeline(BaseModel):
#     nodes: List[Node] = []
#     edges: List[Edge] = []


# # ── DAG check (Kahn's algorithm — topological sort via BFS) ──────────────────

# def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
#     """
#     Returns True if the directed graph formed by nodes + edges is acyclic.
#     Uses Kahn's algorithm: repeatedly remove nodes with in-degree 0.
#     If all nodes are removed the graph is a DAG; a remainder means a cycle.
#     """
#     node_ids = {n.id for n in nodes}

#     # Build adjacency list and in-degree map (only for known node ids)
#     in_degree: dict[str, int] = {nid: 0 for nid in node_ids}
#     adjacency: dict[str, list[str]] = {nid: [] for nid in node_ids}

#     for edge in edges:
#         src, tgt = edge.source, edge.target
#         # Skip edges that reference nodes not in the current node list
#         if src not in node_ids or tgt not in node_ids:
#             continue
#         adjacency[src].append(tgt)
#         in_degree[tgt] += 1

#     # Start with all nodes that have no incoming edges
#     queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
#     visited = 0

#     while queue:
#         current = queue.popleft()
#         visited += 1
#         for neighbour in adjacency[current]:
#             in_degree[neighbour] -= 1
#             if in_degree[neighbour] == 0:
#                 queue.append(neighbour)

#     return visited == len(node_ids)


# # ── Endpoint ─────────────────────────────────────────────────────────────────

# @app.post('/pipelines/parse')
# def parse_pipeline(pipeline: Pipeline):
#     num_nodes = len(pipeline.nodes)
#     num_edges = len(pipeline.edges)
#     dag       = is_dag(pipeline.nodes, pipeline.edges)

#     return {
#         'num_nodes': num_nodes,
#         'num_edges': num_edges,
#         'is_dag':    dag,
#     }
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from collections import defaultdict, deque

app = FastAPI()

# ── CORS (allow React frontend) ───────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MODELS ────────────────────────────────────────────────────────────────────

class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[dict] = None

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# ── DAG CHECK (Kahn’s Algorithm) ─────────────────────────────────────────────

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    node_ids = {n.id for n in nodes}

    in_degree = defaultdict(int)
    adj = defaultdict(list)

    # Initialize in-degree for all nodes
    for node_id in node_ids:
        in_degree[node_id] = 0

    # Build graph
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # Queue for nodes with 0 in-degree
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1

        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)

# ── ROUTES ───────────────────────────────────────────────────────────────────

# ✅ 1. Health Check API
@app.get("/")
def read_root():
    return {"message": "Backend is running ✅"}

# ✅ 2. Optional GET API (for testing via query params)
@app.get("/pipelines/parse")
def parse_pipeline_get(
    nodes: int = Query(..., description="Number of nodes"),
    edges: int = Query(..., description="Number of edges")
):
    """
    Simple GET version (for testing only)
    Does NOT check DAG because structure is missing.
    """
    return {
        "num_nodes": nodes,
        "num_edges": edges,
        "is_dag": None  # Cannot determine without graph structure
    }

# ✅ 3. MAIN API (USED BY FRONTEND)
@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag,
    }