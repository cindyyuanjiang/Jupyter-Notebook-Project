import sys
from collections import defaultdict
import os
import time

def label_output(filename):
    name = filename
    new_name = name[:name.rfind(".")] + ".gv"
    f = open(name, "r")

    deps = []
    for line in f:
        deps.append(line)

    # cfg line dependencies between consecutive cells
    cfg_deps_btwn_cells = defaultdict(list)
    cfg_deps_btwn_cells_count = int(deps[-1])

    for i in range(len(deps) - cfg_deps_btwn_cells_count - 1, len(deps) - 1):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        cfg_deps_btwn_cells[int(l[0])].append(int(l[1]))

    # cfg line dependencies 
    cfg_deps = defaultdict(set)
    cfg_count = int(deps[-1 - cfg_deps_btwn_cells_count - 1])
    cfg_start = len(deps) - cfg_deps_btwn_cells_count - 1 - cfg_count - 1

    for i in range(cfg_start, cfg_start + cfg_count):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        cfg_deps[int(l[0])].add(int(l[1]))

    cell_count = int(deps[0])
    deps_count = int(deps[1 + cell_count])
    sources_list = (deps[-3 - cfg_count - 1 - cfg_deps_btwn_cells_count - 1]).strip()
    sources = []
    if (len(sources_list) > 0):
        sources = list(map(int, sources_list.split(',')))
    sinks_list = (deps[-2 - cfg_count - 1 - cfg_deps_btwn_cells_count - 1]).strip()
    sinks = []
    if (len(sinks_list) > 0):
        sinks = list(map(int, sinks_list.split(',')))
    all_lines_list = (deps[-1 - cfg_count - 1 - cfg_deps_btwn_cells_count - 1].strip())
    all_lines = []
    if (len(all_lines_list) > 0):
        all_lines = list(map(int, all_lines_list.split(',')))

    colors_start = cell_count + 1 + deps_count + 1
    colors_end = len(deps) - 3 - cfg_count - 1 - cfg_deps_btwn_cells_count - 1
    initial_seeds = set()

    # a mapping from cell exe count to colors(set)
    colors = defaultdict(set)
    for i in range(colors_start, colors_end):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        colors[int(l[0])].add(l[1])
        initial_seeds.add(int(l[0]))

    cell_to_lines = defaultdict(list)
    line_to_cell = defaultdict(int)
    for i in range(1, 1 + cell_count):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        if (len(l[1]) == 0):
            cell_to_lines[int(l[0])] = []
            continue
        lines = list(map(int, l[1].split(',')))
        cell_to_lines[int(l[0])] = lines
        for line in lines:
            line_to_cell[line] = int(l[0])

    dep_graph = defaultdict(set)
    parent_graph = defaultdict(set)
    cell_dep = defaultdict(set)
    cell_parent = defaultdict(set)

    for i in range(1 + cell_count + 1, 1 + cell_count + 1 + deps_count):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        dep_graph[int(l[0])].add(int(l[1]))
        parent_graph[int(l[1])].add(int(l[0]))
        cell_dep[line_to_cell[int(l[0])]].add(line_to_cell[int(l[1])])
        cell_parent[line_to_cell[int(l[1])]].add(line_to_cell[int(l[0])])

    for line in all_lines:
        if (not (line in colors)):
            colors[line] = {'lightgrey'}

    def find_ancestors(cell, parents):
        cur_parents = parents[cell]
        seen = set()
        while (len(cur_parents) != 0):
            new_parents = set()
            for p in cur_parents:
                new_parents.add(p)
            for parent in cur_parents:
                if parent in seen:
                    new_parents.remove(parent)
                    continue
                seen.add(parent)
                new_parents.remove(parent)
                new_parents = new_parents.union(parents[parent])
            cur_parents = new_parents
        return seen

    def colors_ok(u, v):
        u_colors = colors[u]
        v_colors = colors[v]
        if u_colors == {'lightgrey'} or u_colors == {'lightblue'} or u_colors == {'lightgrey', 'lightblue'}:
            return True
        if v_colors == {'lightgrey'} or v_colors == {'lightblue'} or v_colors == {'lightgrey', 'lightblue'}:
            return True
        symm_diff = u_colors.symmetric_difference(v_colors)
        if len(symm_diff) == 0 or symm_diff == {'lightgrey'} or symm_diff == {'lightblue'} or symm_diff == {'lightgrey', 'lightblue'}:
            return True
        return False

    def greater(i, l):
        for j in l:
            if i < j:
                return False
        return True

    prop_colors = defaultdict(set)
    for k in colors:
        prop_colors[k] = colors[k]

    cell_colors = defaultdict(list)

    for k in sorted(prop_colors):
        if(len(prop_colors[k]) == 0):
            cell_colors[line_to_cell[k]].append("lightgrey")
        else:
            cell_colors[line_to_cell[k]].extend(list(prop_colors[k]))

    cell_color_map = dict()
    color_to_label_map = {"yellow":"training+evaluation", "purple":"training", "orange":"evaluation", "red":"collection", "green":"wrangling", "lightblue":"exploration", "lightgrey":"n/a"}
    output = ""
    for cell in cell_colors:
        color_set = set(cell_colors[cell])
        if "purple" in color_set and "orange" in color_set:
            cell_color_map[cell] = "yellow"
        elif "purple" in color_set:
            cell_color_map[cell] = "purple"
        elif "orange" in color_set:
            cell_color_map[cell] = "orange"
        elif "red" in color_set:
            cell_color_map[cell] = "red"
        elif "green" in color_set:
            cell_color_map[cell] = "green"
        elif "lightblue" in color_set:
            cell_color_map[cell] = "lightblue"
        else:
            cell_color_map[cell] = "lightgrey"
        output += str(cell) + " : " + color_to_label_map[cell_color_map[cell]] + "\n"

    f_name = name[:name.rfind(".")] + "_no_prop_or_inf_output.txt"
    f = open(f_name, "w")
    f.write(output)
    f.close()
    return

directory_in_str = sys.argv[1]
directory = os.fsencode(directory_in_str)
num_files_processed = 0
num_notebooks_in_folder = 0
num_files_with_labels = 0

start_time = time.time()
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith("_new_labels_no_type_inf.txt"):
        num_files_with_labels += 1
        try:
            label_output(str(directory)[1:][1:-1] + filename)
            num_files_processed += 1
        except Exception as e:
            print("Exception from analyzing \"{}\": {}".format(filename, e))
            continue
    if filename.endswith(".ipynb"):
        num_notebooks_in_folder += 1

end_time = time.time()
print("num_files_processed = " + str(num_files_processed) + "\n")
print("num_files_with_labels = " + str(num_files_with_labels) + "\n")
print("num_notebooks_in_folder = " + str(num_notebooks_in_folder))
print("total time used = {}".format(end_time - start_time))
