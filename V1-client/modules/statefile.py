import json
import os

def create_statefile(filepath=None, balance=500.0, nodes=None):
    if nodes is None:
        nodes = [
            {"index": 1, "scalecount": 5, "state": 0, "scales": [0, 0, 0, 0, 0]}
        ]
    
    if filepath is None:
        filepath = "./statefile.json"
    
    state = {
        "balance": balance,
        "nodes": nodes
    }
    
    with open(filepath, 'w') as f:
        json.dump(state, f, indent=4)

def show_statefile(filepath=None):
    if filepath is None:
        filepath = "./statefile.json"
    
    if not os.path.exists(filepath):
        print(f"No state file found at {filepath}")
        return
    
    with open(filepath, 'r') as f:
        state = json.load(f)
    
    print("Balance:", state["balance"])
    print("Nodes:")
    for node in state["nodes"]:
        print(f"  Node {node['index']}:")
        print(f"    Scale Count: {node['scalecount']}")
        print(f"    State: {node['state']}")
        print(f"    Scales: {node['scales']}")