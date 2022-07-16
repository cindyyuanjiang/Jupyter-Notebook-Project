import os
import sys
import time
from versions import *
from collections import defaultdict
from graph_prop_labels import *
import graphviz

def print_alternative_analysis(all_connections, start_version, end_version, all_labelings):
    print("Alternatives analysis:")
    alternatives = defaultdict(list)
    for k in all_connections[0]:
        for i in range(start_version + 1, end_version + 1):
            # stage is the same from previous version
            next_k = all_connections[i - start_version - 1][k][0]
            if all_labelings[i - start_version - 1][k] == all_labelings[i - start_version][next_k]:
                alternatives[k].append(next_k)
            else:
                break
    alternatives_by_label = defaultdict(str)
    for k in alternatives:
        if all_labelings[0][k] == "n/a" or all_labelings[0][k] == "exploration":
            continue
        alternatives_by_label[all_labelings[0][k]] += "V{}-{}".format(start_version, k)
        for i in range(len(alternatives[k])):
            alternatives_by_label[all_labelings[0][k]] += " -> V{}-{}".format(start_version + i + 1, alternatives[k][i])
        alternatives_by_label[all_labelings[0][k]] += "\n"
    for label in alternatives_by_label:
        print("{} alternatives:".format(label))
        print(alternatives_by_label[label])
    return

filename = sys.argv[1]
start_version = int(sys.argv[2])
end_version = int(sys.argv[3])
start_time = time.time()

all_connections = []
all_labelings = []
initial_labeling_filename = str(filename) + "_" + str(start_version) + "_new_labels_output.txt"
initial_labeling_file = open(initial_labeling_filename, "r")
initial_labeling_fil_content = initial_labeling_file.read()
initial_labelings = construct_labeling_map(initial_labeling_fil_content)
all_labelings.append(initial_labelings)

all_deps = []
initial_deps_filename = str(filename) + "_" + str(start_version) + "_new_labels.txt"
initial_deps_content = generate_deps_cell_level(initial_deps_filename)
all_deps.append(initial_deps_content)

all_added = []
all_removed = []
all_added.append([])

for cur_version in range(start_version, end_version):
    source_code_1 = str(filename) + "_" + str(cur_version) + "_source_code.txt"
    source_code_2 = str(filename) + "_" + str(cur_version + 1) + "_source_code.txt"
    labels_1 = str(filename) + "_" + str(cur_version) + "_new_labels_output.txt"
    labels_2 = str(filename) + "_" + str(cur_version + 1) + "_new_labels_output.txt"

    print("Notebook versions:")
    print(str(filename) + "_" + str(cur_version) + ".ipynb")
    print(str(filename) + "_" + str(cur_version + 1) + ".ipynb")
    print("\nStart analyzing:")

    analysis, connection, labelings_2, cell_deps, added, removed = analyze(source_code_1, source_code_2, labels_1, labels_2, 0.5)
    all_connections.append(connection)
    all_labelings.append(labelings_2)
    print(analysis)

    all_deps.append(cell_deps)
    all_added.append(added)
    all_removed.append(removed)

all_removed.append([])
end_time = time.time()

# print_alternative_analysis(all_connections, start_version, end_version, all_labelings)

new_name = str(filename) + "_compressed_graph" + str(start_version) + "-" + str(end_version) + ".gv"
g = Digraph('G', filename=new_name)

version_cell_name_map = dict()
for v_i in range(start_version, end_version + 1):
    version_cell_name_map[v_i] = dict()

edges_exist = dict()
label_to_color_map = {"training+evaluation":"yellow", "training":"purple", "evaluation":"orange", "collection":"red", "wrangling":"green", "exploration":"lightblue", "n/a":"lightgrey"}

version_number = start_version
for connection in all_connections:
    print("connection version {} to {}".format(version_number, version_number + 1))
    print(connection)
    version_number += 1

# TODO - use a unique id generator for node name
for cur_version in range(start_version, end_version + 1):
    if cur_version == start_version:
        for cell in all_removed[0]:
            node_name = "V" + str(start_version) + "[" + str(cell) + "]"
            gname = "cluster_" + node_name
            with g.subgraph(name=gname) as x:
                cur_label = all_labelings[cur_version - start_version][cell]
                x.node(node_name, style = 'filled', color = label_to_color_map[cur_label])
                version_cell_name_map[cur_version][cell] = node_name
                edges_exist[node_name] = dict()
        linked_cells = dict()
        for k in all_connections[0]:
            linked_cells[k] = [-1 for i in range(end_version - start_version)]
            next_k = k
            for i in range(start_version + 1, end_version + 1):
                if next_k in all_connections[i - start_version - 1]:
                    linked_cells[k][i - start_version - 1] = all_connections[i - start_version - 1][next_k][0]
                    next_k = all_connections[i - start_version - 1][next_k][0]
                else:
                    break
        # break down linked list, only identical nodes are grouped in one node
        # but one linked list should belong to one cluster
        for k in linked_cells:
            gname = "cluster_V" + str(start_version) + "[" + str(k) + "]"
            with g.subgraph(name=gname) as x:
                i = -1
                # cur_k = k
                # start of linked list is not end_version
                while i == -1 or (i < end_version - cur_version and linked_cells[k][i] != -1):
                    j = i + 1
                    if i == -1:
                        prev_k = k
                    else:    
                        prev_k = linked_cells[k][i]

                    # i inclusive, j exclusive boundary
                    if i == -1:
                        while j < end_version - cur_version and linked_cells[k][j] != -1 and \
                                all_connections[cur_version - start_version + j][prev_k][1] == 0 and \
                                all_labelings[cur_version - start_version][k] == all_labelings[cur_version - start_version + j + 1][linked_cells[k][j]]:
                            prev_k = linked_cells[k][j]
                            j += 1
                    else:
                        while j < end_version - cur_version and linked_cells[k][j] != -1 and \
                            all_connections[cur_version - start_version + j][prev_k][1] == 0 and \
                            all_labelings[cur_version - start_version + i + 1][linked_cells[k][i]] == all_labelings[cur_version - start_version + j + 1][linked_cells[k][j]]:
                            prev_k = linked_cells[k][j]
                            j += 1

                    # if j == i + 1:
                    #     cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(linked_cells[k][i]) + "]"
                    # else:
                    #     cur_node_name = "V" + str(cur_version + i + 1)
                    #     cur_node_name += "-" + str(cur_version + j) + "[" + str(linked_cells[k][i]) + "]"
                    if j == i + 1:
                        if i == -1:
                            cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(k) + "]"
                        else:
                            cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(linked_cells[k][i]) + "]"
                    else:
                        cur_node_name = "V" + str(cur_version + i + 1)
                        if i == -1:
                            cur_node_name += "-" + str(cur_version + j) + "[" + str(k) + "]"
                        else:
                            cur_node_name += "-" + str(cur_version + j) + "[" + str(linked_cells[k][i]) + "]"

                    if i == -1:
                        version_cell_name_map[cur_version][k] = cur_node_name
                        for n in range(j):
                            version_cell_name_map[cur_version + n + 1][linked_cells[k][n]] = cur_node_name
                    else:
                        for n in range(i, j):
                            true_k = linked_cells[k][n]
                            version_cell_name_map[cur_version + n + 1][true_k] = cur_node_name

                    if i == -1:
                        cur_label = all_labelings[cur_version - start_version][k]
                    else:
                        cur_label = all_labelings[cur_version - start_version + i + 1][linked_cells[k][i]]
                    x.node(cur_node_name, style = 'filled', color = label_to_color_map[cur_label])
                    edges_exist[cur_node_name] = dict()
                    i = j

    elif cur_version == end_version:
        for cell in all_added[end_version - start_version]:
            gname = "cluster_V" + str(cur_version) + "[" + str(cell) + "]"
            node_name = "V" + str(cur_version) + "[" + str(cell) + "]"
            with g.subgraph(name=gname) as x:
                cur_label = all_labelings[cur_version - start_version][cell]
                x.node(node_name, style = 'filled', color = label_to_color_map[cur_label])
                # x.node(node_name)
                version_cell_name_map[cur_version][cell] = node_name
                edges_exist[node_name] = dict()
    else:
        for cell in all_removed[cur_version - start_version]:
            all_removed_with_incoming_edges = set()
            for key in all_connections[cur_version - start_version - 1]:
                all_removed_with_incoming_edges.add(all_connections[cur_version - start_version - 1][key][0])
            # if cell in all_connections[cur_version - start_version - 1].values():
            if cell in all_removed_with_incoming_edges:
                continue
            else:
                gname = "cluster_V" + str(cur_version) + "[" + str(cell) + "]"
                node_name = "V" + str(cur_version) + "[" + str(cell) + "]"
                with g.subgraph(name=gname) as x:
                    cur_label = all_labelings[cur_version - start_version][cell]
                    x.node(node_name, style = 'filled', color = label_to_color_map[cur_label])
                    # x.node(node_name)
                    version_cell_name_map[cur_version][cell] = node_name
                    edges_exist[node_name] = dict()
        linked_cells = dict()
        for k in all_added[cur_version - start_version]:
            linked_cells[k] = [-1 for i in range(end_version - cur_version)]
            next_k = k
            for i in range(cur_version + 1, end_version + 1):
                if next_k in all_connections[i - start_version - 1]:
                    linked_cells[k][i - cur_version - 1] = all_connections[i - start_version - 1][next_k][0]
                    next_k = all_connections[i - start_version - 1][next_k][0]
                else:
                    break
        # print("cur_version = ", cur_version) 
        # print(linked_cells)
        # print(all_connections[cur_version - start_version])
        for k in linked_cells:
            gname = "cluster_V" + str(cur_version) + "[" + str(k) + "]"
            with g.subgraph(name=gname) as x:
                i = -1
                # cur_k = k
                # start of linked list is not end_version
                while i == -1 or (i < end_version - cur_version and linked_cells[k][i] != -1):
                    j = i + 1
                    if i == -1:
                        prev_k = k
                    else:    
                        prev_k = linked_cells[k][i]

                    # i inclusive, j exclusive boundary
                    if i == -1:
                        while j < end_version - cur_version and linked_cells[k][j] != -1 and \
                                all_connections[cur_version - start_version + j][prev_k][1] == 0 and \
                                all_labelings[cur_version - start_version][k] == all_labelings[cur_version - start_version + j + 1][linked_cells[k][j]]:
                            prev_k = linked_cells[k][j]
                            j += 1
                    else:
                        while j < end_version - cur_version and linked_cells[k][j] != -1 and \
                            all_connections[cur_version - start_version + j][prev_k][1] == 0 and \
                            all_labelings[cur_version - start_version + i + 1][linked_cells[k][i]] == all_labelings[cur_version - start_version + j + 1][linked_cells[k][j]]:
                            prev_k = linked_cells[k][j]
                            j += 1

                    if j == i + 1:
                        if i == -1:
                            cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(k) + "]"
                        else:
                            cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(linked_cells[k][i]) + "]"
                    else:
                        cur_node_name = "V" + str(cur_version + i + 1)
                        if i == -1:
                            cur_node_name += "-" + str(cur_version + j) + "[" + str(k) + "]"
                        else:
                            cur_node_name += "-" + str(cur_version + j) + "[" + str(linked_cells[k][i]) + "]"

                    if i == -1:
                        version_cell_name_map[cur_version][k] = cur_node_name
                        for n in range(j):
                            version_cell_name_map[cur_version + n + 1][linked_cells[k][n]] = cur_node_name
                    else:
                        for n in range(i, j):
                            true_k = linked_cells[k][n]
                            version_cell_name_map[cur_version + n + 1][true_k] = cur_node_name

                    if i == -1:
                        cur_label = all_labelings[cur_version - start_version][k]
                    else:
                        cur_label = all_labelings[cur_version - start_version + i + 1][linked_cells[k][i]]
                    x.node(cur_node_name, style = 'filled', color = label_to_color_map[cur_label])
                    edges_exist[cur_node_name] = dict()
                    i = j
                # i = 0
                # # start of linked list is not end_version
                # while i < end_version - cur_version and linked_cells[k][i] != -1:
                #     j = i
                #     # print("enter while")
                #     # print("i = ", i, ", j = ", j)
                #     # next_k = linked_cells[k][j]
                #     if i == 0:
                #         cur_k = k
                #     else:
                #         cur_k = linked_cells[k][i]
                #     # print("cur_k = ", cur_k)
                #     if i == 0:
                #         while j < end_version - cur_version and linked_cells[k][j] != -1 and \
                #                 all_connections[cur_version - start_version + j][cur_k][1] == 0 and \
                #                 all_labelings[cur_version - start_version + i][k] == all_labelings[cur_version - start_version + j][cur_k]:
                #             cur_k = linked_cells[k][j]
                #             # print("cur_k = ", cur_k)
                #             # print("j incremented in while")
                #             j += 1
                #             # next_k = linked_cells[k][j]
                #     else:
                #         while j < end_version - cur_version and linked_cells[k][j] != -1:
                #             if i == j:
                #                 # print("j incremented in while")
                #                 j += 1
                #                 continue
                #             while j < end_version - cur_version - 1 and all_connections[cur_version - start_version + j][cur_k][1] == 0 and \
                #                   all_labelings[cur_version - start_version + i][k] == all_labelings[cur_version - start_version + j][cur_k]:
                #                 cur_k = linked_cells[k][j]
                #                 # print("cur_k = ", cur_k)
                #                 # print("j incremented in while")
                #                 j += 1
                #             if j == end_version - cur_version - 1:
                #                 j += 1

                #     # if i == j:
                #     #     cur_node_name = "V" + str(cur_version + i) + "[" + str(k) + "]"
                #     #     j += 1
                #     # else:
                #     #     cur_node_name = "V" + str(cur_version + i)
                #     if i == j:
                #         if i == 0:
                #             cur_node_name = "V" + str(cur_version + i) + "[" + str(k) + "]"
                #         else:
                #             cur_node_name = "V" + str(cur_version + i + 1) + "[" + str(k) + "]"
                #         j += 1
                #     else:
                #         if i == 0:
                #             cur_node_name = "V" + str(cur_version + i)
                #         else:
                #             cur_node_name = "V" + str(cur_version + i + 1)
                #         cur_node_name += "-" + str(cur_version + j) + "[" + str(k) + "]"

                #     if i == 0:
                #         version_cell_name_map[cur_version][k] = cur_node_name
                #         for n in range(j):
                #             version_cell_name_map[cur_version + n + 1][linked_cells[k][n]] = cur_node_name
                #     else:
                #         # version_cell_name_map[cur_version + i + 1][linked_cells[k][i]] = cur_node_name
                #         for n in range(i, j):
                #             true_k = linked_cells[k][n]
                #             version_cell_name_map[cur_version + n + 1][true_k] = cur_node_name

                #     cur_label = all_labelings[cur_version - start_version + i][k]
                #     x.node(cur_node_name, style = 'filled', color = label_to_color_map[cur_label])
                #     # x.node(cur_node_name)
                #     edges_exist[cur_node_name] = dict()
                #     i = j

                # # start of linked list is end_version
                # cur_k = linked_cells[k][i-1]
                # # print(cur_version)
                # # print(linked_cells[k][i-1])
                # # print(linked_cells[k][i-2])
                # # print("i = ", i)
                # # print(linked_cells[k][i-2] in all_connections[end_version - cur_version])
                # if i == end_version - cur_version and cur_k != -1 \
                #     and (all_connections[end_version - start_version - 1][linked_cells[k][i-2]][1] != 0 \
                #         or all_labelings[end_version - start_version - 1][linked_cells[k][i-2]] != all_labelings[end_version - start_version][linked_cells[k][i-1]]):
                #     cur_k = linked_cells[k][i-1]
                #     cur_node_name = "V" + str(cur_version + i) + "[" + str(cur_k) + "]"
                #     if i == 0:
                #         version_cell_name_map[cur_version][k] = cur_node_name
                #         for n in range(j):
                #             version_cell_name_map[cur_version + n + 1][linked_cells[k][n]] = cur_node_name
                #     else:
                #         for n in range(i, j):
                #             true_k = linked_cells[k][n]
                #             version_cell_name_map[cur_version + n + 1][true_k] = cur_node_name

                #     cur_label = all_labelings[cur_version - start_version + i][cur_k]
                #     x.node(cur_node_name, style = 'filled', color = label_to_color_map[cur_label])
                #     edges_exist[cur_node_name] = dict()

# add edges
for i in range(len(all_deps)):
    for u in all_deps[i]:
        for v in all_deps[i][u]:
            if u == v:
                continue
            # print(start_version + i)
            # print(u)
            # print(v)
            u_nodename = version_cell_name_map[start_version + i][u]
            v_nodename = version_cell_name_map[start_version + i][v]
            if v_nodename in edges_exist[u_nodename]:
                continue
            edges_exist[u_nodename][v_nodename] = 1
            g.edge(u_nodename, v_nodename)

g.render(view=False)

# alternatives = dict()
# for k in all_connections[0]:
#     alternatives[k] = [-1 for i in range(end_version - start_version)]
#     for i in range(start_version + 1, end_version + 1):
#         # stage is the same from previous version
#         next_k = all_connections[i - start_version - 1][k][0]
#         # print(next_k)

#         # if all_labelings[i - start_version - 1][k] == all_labelings[i - start_version][next_k]:
#         #     alternatives[k].append(next_k)
#         # else:
#         #     break
#         if all_labelings[0][k] == all_labelings[i - start_version][next_k]:
#             alternatives[k][i - start_version - 1] = next_k
#         else:
#             continue

# # for k in alternatives:
# #     if initial_labelings[k] == "n/a" or initial_labelings[k] == "exploration":
# #         continue
# #     print("{} alternatives:".format(initial_labelings[k]))
# #     s = "V{}-{}".format(start_version, k)
# #     for i in range(len(alternatives[k])):
# #         if alternatives[k][i] == -1:
# #             continue
# #         s += " -> V{}-{}".format(start_version + i + 1, alternatives[k][i])

# #     print(s)
# #     print("\n")

# new_name = str(filename) + "_compressed_graph.gv"
# g = Digraph('G', filename=new_name)

# node_to_name_map = dict()
# for k in alternatives:
#     # cur_node_text = """<<TABLE>
#     #  <TR>"""
#     # cur_node_text += "   <TD PORT=\"{}\">V".format(start_version) + str(start_version) + "-" + str(k) + "</TD>\n"
#     # for i in range(end_version - start_version):
#     #     cur_node_text += "   <TD PORT=\"{}\">V".format(start_version+i+1) + str(start_version + i + 1) + "-" + str(alternatives[k][i]) + "</TD>\n"

#     # cur_node_text += """ </TR>
#     # </TABLE>>"""

#     # g.node(str(k), label=cur_node_text)
#     print("current k = ", k)
#     gname = "cluster_" + str(k)
#     with g.subgraph(name=gname) as x:
#         # x.node("V"+str(start_version)+"["+str(k)+"]")

#         cur_node_name = "V"
#         i = 0
#         while i < end_version - start_version:
#             j = i
#             cur_node_name += str(start_version+i)
#             print("start version = ", str(start_version+i))
#             while (j < end_version - start_version - 1) and all_connections[i][start_version+j][1] == 0:
#                 j += 1

#             if j == end_version - start_version - 1:
#                 j += 1

#             if i == j:
#                 cur_node_name += "["+str(alternatives[k][i])+"]"
#             else:
#                 cur_node_name += "-" + str(start_version+j)
#                 cur_node_name += "["+str(alternatives[k][i])+"]"

#             node_to_name_map[k] = cur_node_name
#             x.node(cur_node_name)
#             i = j

#         # for i in range(end_version - start_version):
#         #     x.node("V"+str(start_version+i+1)+"["+str(alternatives[k][i])+"]")

# for u in all_deps[0]:
#     for v in all_deps[0][u]:
#         # g.edge("cluster_" + str(u), "cluster_" + str(v))
#         if u == v:
#             continue
#         # g.edge("V"+str(start_version)+"["+str(u)+"]", "V"+str(start_version)+"["+str(v)+"]", ltail="cluster_" + str(u), lhead="cluster_" + str(v))
#         g.edge(node_to_name_map[u], node_to_name_map[v], ltail="cluster_" + str(u), lhead="cluster_" + str(v))

# g.render(view=False)
