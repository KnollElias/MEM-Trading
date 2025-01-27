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

