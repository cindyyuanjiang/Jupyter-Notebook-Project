import os
import sys
import time
from versions import *
from collections import defaultdict
from graph_prop_labels import *
import graphviz

filename = sys.argv[1]
start_version = int(sys.argv[2])
end_version = int(sys.argv[3])
# print(str(filename))

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


for cur_version in range(start_version, end_version):
    source_code_1 = str(filename) + "_" + str(cur_version) + "_source_code.txt"
    source_code_2 = str(filename) + "_" + str(cur_version + 1) + "_source_code.txt"
    labels_1 = str(filename) + "_" + str(cur_version) + "_new_labels_output.txt"
    labels_2 = str(filename) + "_" + str(cur_version + 1) + "_new_labels_output.txt"

    print("Notebook versions:")
    print(str(filename) + "_" + str(cur_version) + ".ipynb")
    print(str(filename) + "_" + str(cur_version + 1) + ".ipynb")
    print("\nStart analyzing:")

    analysis, connection, labelings_2, cell_deps = analyze(source_code_1, source_code_2, labels_1, labels_2, 0.5)
    all_connections.append(connection)
    all_labelings.append(labelings_2)
    print(analysis)

    all_deps.append(cell_deps)

end_time = time.time()


# print("Alternatives analysis:")
# alternatives = defaultdict(list)
# for k in all_connections[0]:
#     # cur_k = k
#     # alternatives[k] = []
#     for i in range(start_version + 1, end_version + 1):
#         # stage is the same from previous version
#         next_k = all_connections[i - start_version - 1][k][0]
#         # print(next_k)

#         if all_labelings[i - start_version - 1][k] == all_labelings[i - start_version][next_k]:
#             alternatives[k].append(next_k)
#         else:
#             break

# for k in alternatives:
#     if initial_labelings[k] == "n/a" or initial_labelings[k] == "exploration":
#         continue
#     print("{} alternatives:".format(initial_labelings[k]))
#     # print("{} : {}".format(k, alternatives[k]))
#     s = "V{}-{}".format(start_version, k)
#     for i in range(len(alternatives[k])):
#         s += " -> V{}-{}".format(start_version + i + 1, alternatives[k][i])

#     print(s)
#     print("\n")

print("Alternatives analysis:")
alternatives = dict()
for k in all_connections[0]:
    alternatives[k] = [-1 for i in range(end_version - start_version)]
    for i in range(start_version + 1, end_version + 1):
        # stage is the same from previous version
        next_k = all_connections[i - start_version - 1][k][0]
        # print(next_k)

        # if all_labelings[i - start_version - 1][k] == all_labelings[i - start_version][next_k]:
        #     alternatives[k].append(next_k)
        # else:
        #     break
        if all_labelings[0][k] == all_labelings[i - start_version][next_k]:
            alternatives[k][i - start_version - 1] = next_k
        else:
            continue

# for k in alternatives:
#     if initial_labelings[k] == "n/a" or initial_labelings[k] == "exploration":
#         continue
#     print("{} alternatives:".format(initial_labelings[k]))
#     s = "V{}-{}".format(start_version, k)
#     for i in range(len(alternatives[k])):
#         if alternatives[k][i] == -1:
#             continue
#         s += " -> V{}-{}".format(start_version + i + 1, alternatives[k][i])

#     print(s)
#     print("\n")

new_name = str(filename) + "_compressed_graph.gv"
g = Digraph('G', filename=new_name)

for k in alternatives:
    # cur_node_text = """<<TABLE>
    #  <TR>"""
    # cur_node_text += "   <TD PORT=\"{}\">V".format(start_version) + str(start_version) + "-" + str(k) + "</TD>\n"
    # for i in range(end_version - start_version):
    #     cur_node_text += "   <TD PORT=\"{}\">V".format(start_version+i+1) + str(start_version + i + 1) + "-" + str(alternatives[k][i]) + "</TD>\n"

    # cur_node_text += """ </TR>
    # </TABLE>>"""

    # g.node(str(k), label=cur_node_text)
    gname = "cluster_" + str(k)
    with g.subgraph(name=gname) as x:
        x.node("V"+str(start_version)+"-"+str(k))
        for i in range(end_version - start_version):
            x.node("V"+str(start_version+i+1)+"-"+str(alternatives[k][i]))

for u in all_deps[0]:
    for v in all_deps[0][u]:
        # g.edge("cluster_" + str(u), "cluster_" + str(v))
        if u == v:
            continue
        g.edge("V"+str(start_version)+"-"+str(u), "V"+str(start_version)+"-"+str(v), ltail="cluster_" + str(u), lhead="cluster_" + str(v))

g.render(view=False)


