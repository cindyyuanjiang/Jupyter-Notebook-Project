from graphviz import Digraph
import sys
from collections import defaultdict
import networkx as nx
import itertools
import random

def propagate_and_graph(filename):
    name = filename
    new_name = name[:name.rfind(".")] + ".gv"

    g = Digraph('G', filename=new_name)
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

    worklist = set(sources)
    seen = set()
    while(len(worklist) != 0):
        cur_line = worklist.pop()
        deps = dep_graph[cur_line]

        if (cur_line in seen):
            break
        seen.add(cur_line)

        # cur_line had only one child
        if len(deps) == 1:
            # dep has only one parent cur_line
            dep = list(deps)[0]

            if (dep == cur_line):
                continue

            if(dep in initial_seeds):
                worklist.add(dep)
                continue

            # cur_line dep has overlapping colors
            if not(colors_ok(cur_line, dep)):
                worklist.add(dep)
                continue

            # cur_line has no parent
            # cur_line merge to dep
            # cur_line -> dep
            if len(parent_graph[cur_line]) == 0:
                prop_colors[dep] = prop_colors[dep].union(prop_colors[cur_line])
                prop_colors[cur_line] = prop_colors[cur_line].union(prop_colors[dep])
                worklist.add(dep)
                continue

            # cur_line, dep in same cell
            # merge dep to cur_line
            # dep -> cur_line
            if greater(cur_line, parent_graph[dep]) and line_to_cell[cur_line] == line_to_cell[dep]:
                prop_colors[cur_line] = prop_colors[cur_line].union(prop_colors[dep])
                prop_colors[dep] = prop_colors[cur_line]
                continue

            worklist.add(dep)
        else:
            dl = list(deps)
            dl.sort()

            for dep in dl:
                if (dep == cur_line):
                    continue

                if(dep in initial_seeds):
                    worklist.add(dep)
                    continue

                if not(colors_ok(cur_line, dep)):
                    worklist.add(dep)
                    continue

                # cur_line, dep in same cell
                # merge dep to cur_line
                if greater(cur_line, parent_graph[dep]) and line_to_cell[cur_line] == line_to_cell[dep]:

                    prop_colors[cur_line] = prop_colors[cur_line].union(prop_colors[dep])
                    prop_colors[dep] = prop_colors[cur_line]
                    continue

                worklist.add(dep)

    for k in sorted(cfg_deps):
        v = cfg_deps[k]
        for dep in v:
            if(dep in initial_seeds):
                continue
            if colors_ok(k, dep) and line_to_cell[k] == line_to_cell[dep]:
                prop_colors[k] = prop_colors[k].union(prop_colors[dep])
                prop_colors[dep] = prop_colors[k]

    for k in sorted(prop_colors):
        prop_colors[k] = list(prop_colors[k])
        if('lightgrey' in prop_colors[k]):
            prop_colors[k].remove('lightgrey')

    final_colors = dict()
    cell_colors = defaultdict(list)

    for k in sorted(prop_colors):
        if(len(prop_colors[k]) == 0):
            line = str(k) + " -> " + "NA\n"
            final_colors[k] = "lightgrey"
            cell_colors[line_to_cell[k]].append("lightgrey")
        else:
            if('lightblue' in prop_colors[k] and len(prop_colors[k]) >= 2):
                prop_colors[k].remove('lightblue')
            cell_colors[line_to_cell[k]].extend(list(prop_colors[k]))
            r = random.randrange(len(prop_colors[k]))
            line = str(k) + " -> " + prop_colors[k][r] + "\n"
            final_colors[k] = prop_colors[k][r]

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

    f_name = name[:name.rfind(".")] + "_output.txt"
    f = open(f_name, "w")
    f.write(output)
    f.close()

    training_cells = []
    eval_cells = []
    data_processing_cells = []
    feature_engineering_cells = []
    plotting_cells = []
    data_collection_cells = []

    for cell in cell_to_lines:
        if cell in cell_color_map:
            if cell_color_map[cell] == "purple":
                training_cells.append(cell)
            elif cell_color_map[cell] == "orange":
                eval_cells.append(cell)
            elif cell_color_map[cell] == "yellow":
                data_processing_cells.append(cell)
            elif cell_color_map[cell] == "green":
                feature_engineering_cells.append(cell)
            elif cell_color_map[cell] == "lightblue":
                plotting_cells.append(cell)
            elif cell_color_map[cell] == "red":
                data_collection_cells.append(cell)
        if cell in cell_color_map:
            g.node(str(cell), style = 'filled', color = cell_color_map[cell])
        for child in cell_dep[cell]:
            if child in cell_color_map:
                if child == cell:
                    continue
                g.node(str(child), style = 'filled', color = cell_color_map[child])
                g.edge(str(cell), str(child))

    g.render(view = False)

    num_pair_of_parallel_training_processes_common_data_collection = 0
    num_pair_of_parallel_training_processes_no_common_data_collection = 0
    for i in range(len(training_cells)):
        for j in range(i + 1, len(training_cells)):
            i_ancestors = find_ancestors(training_cells[i], cell_parent)
            j_ancestors = find_ancestors(training_cells[j], cell_parent)
            if(not (training_cells[i] in j_ancestors) and (not (training_cells[j] in i_ancestors))):
                has_common_data_collection = False
                for ancestor in i_ancestors:
                    if ((ancestor in j_ancestors) and (ancestor in data_collection_cells)):
                        has_common_data_collection = True
                        break
                if has_common_data_collection:
                    num_pair_of_parallel_training_processes_common_data_collection += 1
                else:
                    num_pair_of_parallel_training_processes_no_common_data_collection += 1

    num_eval = 0
    for i in range(len(eval_cells)):
        for j in range(i + 1, len(eval_cells)):
            i_children = cell_dep[eval_cells[i]]
            j_children = cell_dep[eval_cells[j]]
            intersection = i_children.intersection(j_children)
            if eval_cells[i] in intersection:
                intersection.remove(eval_cells[i])
            if eval_cells[j] in intersection:
                intersection.remove(eval_cells[j])
            if (len(intersection) != 0):
                num_eval += 1

    deadends = 0
    for c in data_processing_cells:
        if (len(cell_dep[c]) == 0 or (len(cell_dep[c]) == 1 and c in cell_dep[c])):
            deadends += 1

    for c in feature_engineering_cells:
        if (len(cell_dep[c]) == 0 or (len(cell_dep[c]) == 1 and c in cell_dep[c])):
            deadends += 1

    for c in plotting_cells:
        if (len(cell_dep[c]) == 0 or (len(cell_dep[c]) == 1 and c in cell_dep[c])):
            deadends += 1

    return num_pair_of_parallel_training_processes_common_data_collection, num_pair_of_parallel_training_processes_no_common_data_collection, num_eval, deadends


def generate_deps_cell_level(filename):
    f = open(filename, "r")
    deps = []
    for line in f:
        deps.append(line)
    cell_count = int(deps[0])
    deps_count = int(deps[1 + cell_count])

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
    
    cell_dep = defaultdict(set)
    for i in range(1 + cell_count + 1, 1 + cell_count + 1 + deps_count):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        cell_dep[line_to_cell[int(l[0])]].add(line_to_cell[int(l[1])])

    return cell_dep


def graph_versions(filename, changed, added, labels):
    label_to_color_map = {"training+evaluation":"yellow", "training":"purple", "evaluation":"orange", "collection":"red", "wrangling":"green", "exploration":"lightblue", "n/a":"lightgrey"}
    cell_color_map = dict()
    for k in labels:
        cell_color_map[k] = label_to_color_map[labels[k]]

    name = filename
    new_name = name[:name.rfind(".")] + "_version_change.gv"
    g = Digraph('G', filename=new_name)
    f = open(name, "r")

    deps = []
    for line in f:
        deps.append(line)
    cell_count = int(deps[0])
    deps_count = int(deps[1 + cell_count])

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
    
    cell_dep = defaultdict(set)
    for i in range(1 + cell_count + 1, 1 + cell_count + 1 + deps_count):
        line = deps[i]
        l = line.split("->")
        l = list(map(str.strip, l))
        cell_dep[line_to_cell[int(l[0])]].add(line_to_cell[int(l[1])])

    for cell in cell_to_lines:
        if cell in cell_color_map:
            if cell in changed:
                print(cell)
                g.node(str(cell), shape = 'doublecircle', style = 'filled', color = cell_color_map[cell])
            elif cell in added:
                g.node(str(cell), shape = 'diamond', style = 'filled', color = cell_color_map[cell])
            else:    
                g.node(str(cell), shape = 'circle', style = 'filled', color = cell_color_map[cell])
        for child in cell_dep[cell]:
            if child in cell_color_map:
                if child == cell:
                    continue
                if cell in changed:
                    print(cell)
                    g.node(str(child), shape = 'doublecircle', style = 'filled', color = cell_color_map[child])
                elif cell in added:
                    g.node(str(child), shape = 'diamond', style = 'filled', color = cell_color_map[child])
                else:    
                    g.node(str(child), shape = 'circle', style = 'filled', color = cell_color_map[child])
                g.edge(str(cell), str(child))

    g.render(view = False)
    return cell_dep
