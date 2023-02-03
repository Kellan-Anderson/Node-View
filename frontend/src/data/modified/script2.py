""" Create Limits """
""" Sort by timestep """
"""  """


"""
Load the initial data from the .csv files
Pass the initial data to sort_by_timestep() to generate the nodes in each timestep
Take the timestep sorted data and pass it to create_limits() to find the number of each group of node needed in the final data
    Returns a limits dictionary

Take the timestep-sorted dictionary and the limits dicitonary and pass to filter_group() to get the group-filtered_dictionary
Pass group_filtered_dict to limit_by_edge() to filter data by the # of edges of a node
    Returns edge_filtered_dict
Take group_filtered_dict and pass to get_final() to bring in all connected nodes from the limited data and write to final.json


sort_by_timestep()
create_limits()
limit_by_edge()
filter_group()
get_final()
"""

import json
from math import ceil

MAX_NODES = 30
MAX_EDGES = 20
MIN_EDGES = 2

# DONE
def sort_by_timestep(initial_data):
    """
    Data needs to be in the format of:
    {
        id: {
            group: #,
            timestep: #,
            edges: []
        }
    }

    loop 49 times to make timestep holders
    loop over the nodes in the initial data
        return_dict[node timestep] = {id: #, group: #, edges: []}

    Returns:
    {
        timestep#: [
            {id: #, timestep: #, edges[]},
            {id: #, timestep: #, edges[]},
            etc.
        ]
    }
    """
    return_dict = {}
    for i in range(1,50):
        return_dict[f'timestep{i}'] = []
    
    for key in initial_data:
        node = initial_data[key]
        ts = node['timestep']
        return_dict[f'timestep{ts}'].append({ "id": key, "group": node['group'], "edges": node['edges'] })
    
    return return_dict


def create_limits(timestep_sorted_dict, write_to_file=True):
    """
    Loop over nodes in timestep
    3 variables:
        group1_sum
        group2_sum
        group3_sum
    divide individual sums by total sum in each timestep to get ratio
    Take the cieling of the ratio * MAX_NODES setting to get a limit number of each group in the timestep
    Pass to return dictionary

    Returns:
    {
        timestep#: {
            group1: #,
            group2: #,
            group3: #
        }
    }
    """
    limits = {f'timestep{i}':{} for i in range(1, 50)}
    for timestep in timestep_sorted_dict:
        group1_sum = 0
        group2_sum = 0
        group3_sum = 0

        # Calc groups
        for node in timestep_sorted_dict[timestep]:
            if node['group'] == "1":
                group1_sum += 1
            elif node['group'] == "2":
                group2_sum += 2
            elif node['group'] == "3":
                group3_sum += 3
        
        timestep_total = group1_sum + group2_sum + group3_sum

        limits[timestep] = {
            "group1": ceil(MAX_NODES * (group1_sum / timestep_total)),
            "group2": ceil(MAX_NODES * (group2_sum / timestep_total)),
            "group3": ceil(MAX_NODES * (group3_sum / timestep_total)),
        }

    if write_to_file:
        with open('limits.json', 'w') as f:
            f.write(json.dumps(limits, indent=2))
    return limits

# DONE
def limit_by_edge(timestep_sorted_dict):
    """
    Loop through each timestep in sorted_tiemstep_dict:
        Loop through each node in timestep:
            if node_edges < max_edges and node_edges > min_edges:
                add to return dict
    
    Returns:
    {
        timestep#: [
            {
                id: #,
                group: #,
                edges: []
            },
        ]
    }
    """
    return_dict = {f'timestep{i}':[] for i in range(1, 50)}
    for timestep in timestep_sorted_dict:
        for node in timestep_sorted_dict[timestep]:
            num_edges = len(node['edges'])
            if num_edges > MIN_EDGES and num_edges < MAX_EDGES:
                return_dict[timestep].append(node)

    return return_dict


def filter_group(sorted_dict, limits_dict):
    """
    3 variables:
        group1: num
        group2: num
        group3: num
    Loop through each timestep in timestep_sorted_dict and compare to limits_dict:
        if group# < limits_dict_group#:
                Add node to return_dict
                group# += 1
    
    Returns:
    {
        id: {
            group: #,
            timestep: #,
            edges: []
        }
    }
    """
    rtn_dict = {f'timestep{i}': [] for i in range(1,50)}
    # Loop over every timestep
    for timestep in sorted_dict:
        # get the nodes in a timestep
        nodes = sorted_dict[timestep]
        # setup counters comp_counter & current_counter
        comp_counter = limits_dict[timestep]
        current_counter = {
            "group1": 0,
            "group2": 0,
            "group3": 0
        }
        
        # loop over the nodes in a timestep while counters are not equal
        node_cnt = 0
        while comp_counter != current_counter and node_cnt <= len(nodes) - 1:
            node = nodes[node_cnt]
            group_key = f'group{node["group"]}'
            # CHECK 1: if the current node's group is below the limit (found in comp_counter)
            if current_counter[group_key] <= comp_counter[group_key]:
                # CHECK 2: if the nodes egdes are withing the settings range
                edges = len(node['edges'])

                min_edges = 1 if group_key == "group1" else MIN_EDGES

                if edges <= MAX_EDGES and edges >= min_edges:
                    # add the node to the return dictionary
                    rtn_dict[timestep].append(node)
                    # increment the current counter
                    current_counter[group_key] += 1
            # Increment the node counter
            node_cnt += 1
    
    return rtn_dict

# DONE
def get_final(filtered_dict, initial_dict, write_to_file=True):
    """
    Final = {}
    Loop through each node in group_filtered_dict:
        Add node to final_dict
        Loop through each edge in node:
            If edge not in final:
                Add node from initial data (without the nodes edges) to the return dict
    If write_to_file is true:
        Write the dict to final.json
    """
    # Init data
    final = []

    for timestep in filtered_dict:
        # Add the node to the final data
        # Make a fake node
        for node in filtered_dict[timestep]:
            timestep_num = pull_timestep(timestep)
            temp = {
                "id": node['id'],
                "group": node['group'],
                "timestep": timestep_num,
                "edges": []
            }
            for edge_id in node['edges']:
                temp['edges'].append({
                    "id": edge_id,
                    "timestep": timestep_num,
                    "group": initial_dict[edge_id]['group']
                })
            final.append(temp)
    
    # Write to a file
    if write_to_file:
        with open('data_final.json', 'w') as f:
            f.write(json.dumps({"data": final}, indent=2))
    return { "data": final }


def pull_timestep(string):
    if string[-2:].isdigit():
        return string[-2:]
    return string[-1]

def percent_as_str(part, whole):
    frac = float(part) / float(whole)
    return str(int((frac * 10000) // 1)/100)

def print_stats(data, filename='metadata.csv'):    
    checked_nodes = []

    print_data = { f'{i}':{ "1": 0, "2": 0, "3": 0 } for i in range(1,50) }
    totals_data = {'1': 0, '2': 0, '3': 0, 'total': 0}
    for node in data:
        if node['id'] not in checked_nodes:
            checked_nodes.append(node['id'])
            print_data[node['timestep']][node['group']] += 1
            totals_data[node['group']] += 1
            totals_data['total'] += 1
    
    csv_str = "Timestep,Group 1,Group 2,Group 3,Group 1 %,Group 2 %,Group 3 %,total\n"
    for timestep in print_data:
        counts = print_data[timestep]
        g1, g2, g3 = counts['1'], counts['2'], counts['3']
        total = g1 + g2 + g3
        g1p = percent_as_str(g1, total)
        g2p = percent_as_str(g2, total)
        g3p = percent_as_str(g3, total)
        csv_str += f'Timestep {timestep},{g1},{g2},{g3},{g1p},{g2p},{g3p},{total}\n'
        
    csv_str += f'TOTALS,{totals_data["1"]},{totals_data["2"]},{totals_data["3"]},{totals_data["total"]}'
    with open(filename, 'w') as f:
        f.write(csv_str)
        print("Data written to " + filename)

# DONE
def main():
    initial_data = {}

    # Load data in from the features
    with open('features.csv', 'r') as f:
        features = f.readlines()
        for i in features:
            line = i.split(',')
            initial_data[line[0]] = { "timestep": line[1], "group": "", "edges": [] }

    # Load data from the classes
    with open('classes.csv', 'r') as f:
        classes = f.readlines()
        for i in classes:
            line = i.split(',')
            if line[1] == "unknown\n":
                group = "3"
            else:
                group = line[1]
            initial_data[line[0]]["group"] = group.strip()
    
    # Load data from edgelist
    with open('edgelist.csv', 'r') as f:
        edges = f.readlines()
        for i in edges:
            line = i.split(',')
            initial_data[line[0]]["edges"].append(line[1].strip())

    # Pass initial data to filters
    timestep_sorted_data = sort_by_timestep(initial_data)
    limits = create_limits(timestep_sorted_data)
    filtered_data = filter_group(timestep_sorted_data, limits)    
    final_data = get_final(filtered_data, initial_data)
    
    print_stats(final_data["data"])

if __name__ == "__main__":
    main()
