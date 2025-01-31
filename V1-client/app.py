from modules.logger import log
from modules.statefile import read_statefile, write_statefile
from modules.trader import open_new_trade
from modules.messanger import notify_message
from modules.backtester import trade_outcome
import time

def read_outcome():
    return True

def increment_nodes(currentnode, statefile):
    # make the last the current
    write_statefile("last_node", currentnode)
    # increase the current an modulo % the nodes length
    write_statefile("current_node", (currentnode + 1) % len(statefile["nodes"]))
    # increase the age
    write_statefile("age", statefile["age"] + 1)

def reset_scale(node_index, statefile, filepath=None):
    # Ensure node_index is valid
    if 0 <= node_index < len(statefile["nodes"]):
        statefile["nodes"][node_index]["scale"] = [0] * len(statefile["nodes"][node_index]["scale"])
        write_statefile("nodes", statefile["nodes"], filepath)
    else:
        print(f"Invalid node index: {node_index}.")

def brew_scale(oldscale, newstate):
    if newstate == 1:
        oldscale[0] = 1
        return oldscale
    if newstate >= 2:
        position = newstate - 1
        risk = 2 ** (newstate - 1)
        oldscale[position] = risk
        return oldscale
    
def calculate_next_risk(newstate):
    if newstate == 1:
        return 1
    if newstate >= 2:
        risk = (2 ** (newstate - 1))*2
        return risk

def backtest(age):
    print("Backtesting... : age", age)
    return trade_outcome("/home/main/Documents/GitHub/MEM-Trading/V1-client/testing/goldprice/10-20/dataset_2010-2020.csv", age+1)

def iteration():
    # lastoutcome = read_outcome() # bool
    statefile = read_statefile() # json
    lastoutcome = backtest(statefile["age"])

    initialrisk = statefile["initial_risk"]
    currentnode = statefile["current_node"]
    lastnode = statefile["last_node"]
    balance = statefile["balance"]

    # log(f"Sucessfully read statefile at age: {statefile['age']}, {lastoutcome}")
    increment_nodes(currentnode, statefile)
    
    if lastoutcome:
        # log(f"Won last trade. {statefile["age"]+2}")
        if statefile["nodes"][currentnode]["state"] == 0:
            balance += initialrisk
        if statefile["nodes"][currentnode]["state"] >= 1:
            balance += calculate_next_risk(statefile["nodes"][currentnode]["state"])
        reset_scale(currentnode, statefile)
        statefile["nodes"][currentnode]["state"] = 0

        write_statefile("nodes", statefile["nodes"])
        write_statefile("balance", balance)
    if lastoutcome == False:
        # log(f"Lost last trade. {statefile["age"]+2}")
        if statefile["nodes"][currentnode]["state"] == 0:
            balance -= initialrisk
        if statefile["nodes"][currentnode]["state"] >= 1:
            balance -= calculate_next_risk(statefile["nodes"][currentnode]["state"]+1)/2
        statefile["nodes"][currentnode]["state"] += 1
        statefile["nodes"][currentnode]["scale"] = brew_scale(statefile["nodes"][currentnode]["scale"], statefile["nodes"][currentnode]["state"])

        write_statefile("nodes", statefile["nodes"])
        write_statefile("balance", balance)

    log(f"age: {statefile['age']}, balance: {balance}, currentnode: {currentnode}, lastnode: {lastnode}, lastoutcome: {lastoutcome}")
    # open_new_trade(read_statefile()) # read statefile again after updates
    # notify_message(read_statefile()) # put the data to a discord chat for info

for _ in range(2500):
    iteration()
    time.sleep(0.1)  # Wait for 300 milliseconds
