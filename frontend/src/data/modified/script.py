"""
{
    id: {
        timestep: int,
        group: int,
        edges: [ints]
    }
}

Final data format:
{
    data: [
        {id: #, timestep: #, group: #, edges:[{id: #, timestep: #, group: #}, {id: #, timestep: #, group: #}]},
    ]
}
"""

import json
from copy import deepcopy
from math import floor

# SETTINGS
MIN_EDGES = 2
MAX_EDGES = 15
MAX_NODES = 15

"""
Takes the initially loaded data and filters it based off the number of edges it 
has connected to it. Returns a modified dictionary where the keys are timesteps
instead of node id and nodes are sorted by individual timestep 
"""
def convert(data):
    d = {}
    for i in data.keys():
        if len(data[i]["edges"]) > MIN_EDGES and len(data[i]["edges"]) < MAX_EDGES:
            obj = data[i]
            mock = {"id": i, "group": obj["group"], "edges": obj["edges"]}
            ts = f"timestep{obj['timestep']}"
            try:
                d[ts].append(mock)
            except(KeyError):
                d[ts] = []
                d[ts].append(mock)
    return d

"""
Takes the data
"""
def limit(data, settings):
    d = {}
    for i in data.keys():
        d[i] = []
    for timestep in data:
        count = {"1": 0,"2": 0,"3": 0,}
        for node in data[timestep]:
            if count[node['group']] < settings[timestep][node['group']]:
                count[node['group']] += 1
                d[timestep].append(node)
    return d

"""
Takes the data in the format of 
{
    id: {
        timestep: #,
        group: #,
        edges: []
    }
}
and creates a file containing a JSON object representing the number of nodes in
a timestep scaled down to a certain amount of nodes, set by the setting 
MAX_NODES
"""
def create_limits(data, settings):
    # Loop over the keys
    # look at the object associated with the id key
    pass

def getTS(string):
    s = ""
    for i in string:
        if i.isdigit():
            s += i
    return s

def final(data, init_data):
    final_data = {"data": []}
    for timestep in data.keys():
        for i in data[timestep]:
            id = i["id"]
            group = i["group"]
            ts = getTS(timestep)
            node = {"id": id, "timestep": ts, "group": group, "edges": []}
            for j in i["edges"]:
                a_node_id = j
                a_node_group = init_data[j]["group"]
                a_node_timestep = init_data[j]["timestep"]
                a_node = {"id": a_node_id, "timestep": a_node_timestep, "group": a_node_group}
                node["edges"].append(a_node)
            final_data["data"].append(node)
    return final_data

def get_limits(init_data):
    limits = {}
    group = { "1": 0, "2": 0, "3": 0 }
    for i in range(1, 50):
        limits[f"timestep{i}"] = deepcopy(group)
    for i in init_data.keys():
        data = init_data[i]
        limits[f"timestep{data['timestep']}"][data['group']] += 1
    return limits
                
def calc_avg(limits: dict, base: int) -> dict:
    rtn = {}
    for key in limits:
        total = sum(limits[key].values())
        rtn[key] = {
            "1": floor((limits[key]["1"]/total)*base),
            "2": floor((limits[key]["2"]/total)*base),
            "3": floor((limits[key]["3"]/total)*base),
        }
    return rtn

def main():
    """ Load the features file and convert to python dictionary """
    with open("features.csv", "r") as f:
        features = f.readlines()

    data = {}
    for i in features:
        line = i.split(",")
        data[line[0]] = {"timestep": line[1], "group": "", "edges": []}
    
    """ Load data classes and add to the dictionary """
    with open("classes.csv", "r") as f:
        classes = f.readlines()
    
    for i in classes:
        line = i.split(",")
        if line[1] == "unknown\n":
            c = "3"
        else:
            c = line[1]
        data[line[0]]["group"] = c.strip()
    
    """ Load the data edges and add that to the dictionary """
    with open("edgelist.csv", "r") as f:
        edges = f.readlines()
    
    for i in edges:
        line = i.split(",")
        data[line[0]]["edges"].append(line[1].strip())

    """ Apply filters to the data """
    #temp = convert(data)
    temp = get_limits(data)
    new_data = limit(convert(data), calc_avg(temp, MAX_NODES))
    data = final(new_data, data)


    """ Write final data object to a JSON file """
    with open("limit_test.json", "w") as f:
        f.write(json.dumps(new_data, indent=2))

""" Run the program """
if __name__ == "__main__":
    main()

"""
NEO4J QUERY:

CALL apoc.load.json("filepath")
YEILD value
UNWIND value.data as data
MERGE (s:{id: data.id, timestep: data.timestep, group: data.group})
WITH s, data
UNWIND data.edges as edge
MERGE (t:{id: edge.id, timestep: edge.timestep, group: edge.group})
MERGE (s)-[:CONNECTED]->(t)
"""

"""
Load data in main
List nodes by timestep in convert

loop through nodes
    if current group num < limits group num
        add node of current group to 

Get the number of nodes in limit
Load/format all the nodes needed in final
"""