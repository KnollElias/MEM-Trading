from modules.logger import log
from modules.statefile import show_statefile, read_statefile, write_statefile

def read_outcome():
    return True

def increment_nodes(currentnode, statefile):
    write_statefile("last_node", currentnode)
    write_statefile("current_node", (currentnode + 1) % len(statefile["nodes"]))
    write_statefile("age", statefile["age"] + 1)
    # make the last the current
    # increase the current an modulo % the nodes length
    # increase the age

def iteration():
    lastoutcome = read_outcome() # bool
    statefile = read_statefile() # json

    currentnode = statefile["current_node"]
    lastnode = statefile["last_node"]
    balance = statefile["balance"]

    increment_nodes(currentnode, statefile)



    # if lastoutcome: # won
    #     statefile


    # calculate outcoem of last
    # get node index
    # get current risk
    # write the position as open
    # so the nodeindex must be -1 bevause we are workign wiht a starting at 0 array here, then the state can be read
    print(statefile["nodes"][0]["state"])
    print(lastoutcome)
    print("currentNode: ", currentnode)
    print("lastnode: ", lastnode)


# read statefile

# get next nodeindex

# notify a discord chanel or so

iteration()
iteration()
iteration()
iteration()
iteration()
iteration()
