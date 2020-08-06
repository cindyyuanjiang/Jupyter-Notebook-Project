from graphviz import Digraph
import sys
from collections import defaultdict

name = sys.argv[1]
new_name = name.split(".")[1].split('/')[2] + "-4.gv"


g = Digraph('G', filename=new_name)
f = open(name, "r")


def color_to_label(color):
    if(color == 'red'):
        return 'Data collection'
    elif(color == 'yellow'):
        return 'Data cleaning'
    elif(color == 'green'):
        return 'Data labeling'
    elif(color == 'blue'):
        return 'Feature engineering'
    elif(color == 'purple'):
        return 'Training'
    elif(color == 'orange'):
        return 'Evaluation'
    elif(color == 'lightblue'):
        return 'Plotting'
    else:
        return 'Miscellaneous'


deps = []
for line in f:
    deps.append(line)


deps_count = int(deps[0])

sources = (deps[-3]).strip().split(',')
print('sources')
print(sources)

sinks = (deps[-2]).strip().split(',')
print('sinks')
print(sinks)

# list of all cells
all_cells = (deps[-1]).split(',') 


# a mapping from cell exe count to colors(set)
colors = defaultdict(set)
init_colors = defaultdict(set)

for i in range(deps_count+1, len(deps)-3):
    line = deps[i]
    l = line.split("->")
    l = list(map(str.strip, l))

    colors[l[0]].add(l[1])
    init_colors[l[0]].add(l[1])



# a mapping from cell exe count to children(set of cell exe counts)
dep_graph = defaultdict(set)
# a mapping from cell exe count to parents(set of cell exe counts)
parents = defaultdict(set)

# all cells appeared in the dependency graph
cells = set()

for i in range(1, 1+deps_count):
    line = deps[i]
    l = line.split("->")
    l = list(map(str.strip, l))

    cells.add(l[0])
    cells.add(l[1])

    dep_graph[l[0]].add(l[1])
    parents[l[1]].add(l[0])


# add mapping of cells that are not in the specified color mappings
for cell in all_cells:
    if (not (cell in colors)):
        colors[cell] = {'lightgrey'}
        init_colors[cell] = {'lightgrey'}


# new_colors = dict()

# for cell in colors:
#     new_colors[cell] = list(colors[cell])
#     if((len(new_colors[cell]) >= 2) and ('lightblue' in new_colors[cell])):
#         new_colors[cell].remove('lightblue')
#     if((len(new_colors[cell]) >= 2) and ('lightgrey' in new_colors[cell])):
#         new_colors[cell].remove('lightgrey')


# for cell in all_cells:
#     if(len(dep_graph[cell]) != 0):
#         g.node(cell, style = 'filled', color = new_colors[cell][0])

#         for child in dep_graph[cell]:
#             g.node(child, style = 'filled', color = new_colors[child][0])
#             g.edge(cell, child)
#     else:
#         g.node(cell, style = 'filled', color = new_colors[cell][0])
            

# g.view()


# print the initial labels/titles for each cell in actual order
print('Currently processing: ' + name.split(".")[1].split('/')[2] + '.ipynb')
print(all_cells)
print('\n\n\n')


# print('\nInitial titles for each cell:')
# for i in range(len(all_cells)):
#     print('Cell ' + all_cells[i] + ':')
#     print(colors[all_cells[i]])
#     print()


# may be eliminated b/c using defaultdict
for cell in cells:
    if (not (cell in dep_graph)):
        dep_graph[cell] = set()
    if (not (cell in parents)):
        parents[cell] = set()


# for cell in cells:
#     print(str(cell) + ' children : ')
#     print(dep_graph[cell])
#     print()


# for cell in cells:
#     print(str(cell) + ' parents : ')
#     print(parents[cell])
#     print()



#graph contraction
worklist = set(sources)

# a copy of all cells
new_cells_list = [all_cells[i] for i in range(len(all_cells))]
print(new_cells_list)

# map from cell to which cells are merged to it
merged = defaultdict(set)


while(len(worklist) != 0):
    cur_cell = worklist.pop()
    print('Currently processing')
    print(cur_cell)

    # whether we want to keep this cell in the next round
    flag = True

    # special case: parent/cur_cell merged to child, parent/cur_cell has no parent and only one child
    if((len(dep_graph[cur_cell])==1) and (len(parents[cur_cell])==0) and (colors[cur_cell] == {'lightgrey'} or colors[cur_cell] == {'lightblue'})):
        

        child = list(dep_graph[cur_cell])[0]
        dep_graph.pop(cur_cell)

        colors[child] = (colors[cur_cell].union(colors[child]))

        parents[child].remove(cur_cell)

        parents.pop(cur_cell)
        colors.pop(cur_cell)
        cells.remove(cur_cell)
        new_cells_list.remove(cur_cell)



        new_merged = merged[cur_cell].union(merged[child])
        new_merged.add(cur_cell)
        merged.pop(cur_cell)
        merged[child] = new_merged

        worklist.add(child)
        continue

        print('removed cell: ' + cur_cell)
    else:

        for child in dep_graph[cur_cell]:
            # lightblue or lightgrey child merged to parent
            if((len(parents[child])==1) and (colors[child] == {'lightgrey'} or colors[child] == {'lightblue'})):

                colors[cur_cell] = (colors[cur_cell].union(colors[child]))

                dep_graph[cur_cell] = dep_graph[cur_cell].union(dep_graph[child])

                for parent in parents[child]:
                    dep_graph[parent].remove(child)
                    if(parent != cur_cell):
                        dep_graph[parent].add(cur_cell)

                for grandchild in dep_graph[child]:
                    parents[grandchild].remove(child)
                    parents[grandchild].add(cur_cell)

                dep_graph.pop(child)
                parents.pop(child)
                colors.pop(child)
                cells.remove(child)
                new_cells_list.remove(child)

                flag = (flag and False)

                

                new_merged = merged[child].union(merged[cur_cell])
                new_merged.add(child)
                merged.pop(child)
                merged[cur_cell] = new_merged

                print('removed cell: ' + str(child))
            elif((len(parents[child])==1) and ((colors[cur_cell] == {'lightblue'}) or (colors[cur_cell] == {'lightgrey'}))):

                colors[cur_cell] = (colors[cur_cell].union(colors[child]))

                dep_graph[cur_cell] = dep_graph[cur_cell].union(dep_graph[child])

                for parent in parents[child]:
                    dep_graph[parent].remove(child)
                    if(parent != cur_cell):
                        dep_graph[parent].add(cur_cell)

                for grandchild in dep_graph[child]:
                    parents[grandchild].remove(child)
                    parents[grandchild].add(cur_cell)

                dep_graph.pop(child)
                parents.pop(child)
                colors.pop(child)
                cells.remove(child)
                new_cells_list.remove(child)

                flag = (flag and False)

            

                new_merged = merged[child].union(merged[cur_cell])
                new_merged.add(child)
                merged.pop(child)
                merged[cur_cell] = new_merged

                print('removed cell: ' + str(child))

            # same color child merged to parent (both have one color/label)
            elif((len(parents[child])==1) and (len(colors[cur_cell]) == 1) and (len(colors[child]) == 1) and (colors[cur_cell] == colors[child])):

                colors[cur_cell] = (colors[cur_cell].union(colors[child]))

                dep_graph[cur_cell] = dep_graph[cur_cell].union(dep_graph[child])

                for parent in parents[child]:
                    dep_graph[parent].remove(child)
                    if(parent != cur_cell):
                        dep_graph[parent].add(cur_cell)

                for grandchild in dep_graph[child]:
                    parents[grandchild].remove(child)
                    parents[grandchild].add(cur_cell)

                dep_graph.pop(child)
                parents.pop(child)
                colors.pop(child)
                cells.remove(child)
                new_cells_list.remove(child)

                flag = (flag and False)


                new_merged = merged[child].union(merged[cur_cell])
                new_merged.add(child)
                merged.pop(child)
                merged[cur_cell] = new_merged

                print('removed cell: ' + str(child))

                # print('removed cell: ' + str(child))
            elif((len(parents[child])==1) and (colors[cur_cell].symmetric_difference(colors[child]) == {'lightblue'})):

                colors[cur_cell] = (colors[cur_cell].union(colors[child]))

                dep_graph[cur_cell] = dep_graph[cur_cell].union(dep_graph[child])

                for parent in parents[child]:
                    dep_graph[parent].remove(child)
                    if(parent != cur_cell):
                        dep_graph[parent].add(cur_cell)

                for grandchild in dep_graph[child]:
                    parents[grandchild].remove(child)
                    parents[grandchild].add(cur_cell)

                dep_graph.pop(child)
                parents.pop(child)
                colors.pop(child)
                cells.remove(child)
                new_cells_list.remove(child)

                flag = (flag and False)


                new_merged = merged[child].union(merged[cur_cell])
                new_merged.add(child)
                merged.pop(child)
                merged[cur_cell] = new_merged

                print('removed cell: ' + str(child))

            elif((len(parents[child])==1) and ((colors[child].issubset(colors[cur_cell])) or (colors[cur_cell].issubset(colors[child])))):

                colors[cur_cell] = (colors[cur_cell].union(colors[child]))

                dep_graph[cur_cell] = dep_graph[cur_cell].union(dep_graph[child])

                for parent in parents[child]:
                    dep_graph[parent].remove(child)
                    if(parent != cur_cell):
                        dep_graph[parent].add(cur_cell)

                for grandchild in dep_graph[child]:
                    parents[grandchild].remove(child)
                    parents[grandchild].add(cur_cell)

                dep_graph.pop(child)
                parents.pop(child)
                colors.pop(child)
                cells.remove(child)
                new_cells_list.remove(child)

                flag = (flag and False)


                new_merged = merged[child].union(merged[cur_cell])
                new_merged.add(child)
                merged.pop(child)
                merged[cur_cell] = new_merged

                print('removed cell: ' + str(child))

            else:
                flag = (flag and True)


    if(not flag):
        worklist.add(cur_cell)
    else:
        for c in dep_graph[cur_cell]:
            worklist.add(c)


# for cell in cells:
#     print(cell)
#     print(colors[cell])


# makes a copy of merged after 1st stage of merging
prev_merged = defaultdict(set)

for key in merged:
    value = set()
    for val in merged[key]:
        value.add(val)
    prev_merged[key] = value



def hash_trainings(trainings):
    res = 0

    for train_cell in trainings:
        res += int(train_cell)

    return res


def cmp_merged(x):
    x_i = all_cells.index(x)
    return x_i


print(new_cells_list)



# identifying parallel training processes
parallel_trainings = []
parallel_trainings_set = set()

sources_trainings =[]
for cell in sources:
    if('purple' in colors[cell]):
        sources_trainings.append(cell)

if(len(sources_trainings)>1):
    sources_trainings.sort(key = cmp_merged)
    parallel_trainings.append(sources_trainings)
    parallel_trainings_set.add(hash_trainings(sources_trainings))


sinks_trainings = []
for cell in sinks:
    if('purple' in colors[cell]):
        sinks_trainings.append(cell)

if(len(sinks_trainings)>1):
    sinks_trainings.sort(key = cmp_merged)
    parallel_trainings.append(sinks_trainings)
    parallel_trainings_set.add(hash_trainings(sinks_trainings))


for cell in new_cells_list:

    children = dep_graph[cell]
    trainings = []

    for child in children:
        if('purple' in colors[child]):
            trainings.append(child)

    # if(len(trainings)<=1):
    #     continue

    for training_cell in trainings:
        training_cell_children = dep_graph[training_cell]
        training_cell_parents = parents[training_cell]

        for c in training_cell_children:
            if(c in trainings):
                trainings.remove(c)

        for p in training_cell_parents:
            if(p in trainings):
                trainings.remove(p)

    trainings = list(set(trainings))

    if(len(trainings)<=1):
        continue


    trainings.sort(key = cmp_merged)


    if(not (hash_trainings(trainings) in parallel_trainings_set)):
        parallel_trainings.append(trainings)
        parallel_trainings_set.add(hash_trainings(trainings))



for trainings in parallel_trainings:

    print('detect parallel training processes:')
    print(trainings)

    for train_cell in trainings:

        for cell in new_cells_list:
            if(train_cell in merged[cell]):
                merged[cell].remove(train_cell)
                new_cells_list.append(train_cell)
                break

print()


new_cells_list.sort(key = cmp_merged)


print('merging')
for cell in new_cells_list:
    print(cell)
    print(merged[cell])





all_training_cells = set()
for cell in new_cells_list:
    if('purple' in colors[cell]):
        all_training_cells.add(cell)


for tc in all_training_cells:
    
    for child in dep_graph[tc]:
        flag = True
        for p in parents[child]:
            if(cmp_merged(p) <= cmp_merged(tc)):
                flag = flag and False

        if(flag):
            colors[tc] = (colors[tc].union(colors[child]))

            dep_graph[tc] = dep_graph[tc].union(dep_graph[child])

            for parent in parents[child]:
                dep_graph[parent].remove(child)
                if(parent != tc):
                    dep_graph[parent].add(tc)

            for grandchild in dep_graph[child]:
                parents[grandchild].remove(child)
                parents[grandchild].add(tc)

            dep_graph.pop(child)
            parents.pop(child)
            colors.pop(child)
            cells.remove(child)
            new_cells_list.remove(child)

            new_merged = merged[child].union(merged[tc])
            new_merged.add(child)
            merged.pop(child)
            merged[tc] = new_merged





i = 0
while(i != (len(new_cells_list) - 1)):

    print('cell ' + new_cells_list[i])
    print(colors[new_cells_list[i]])

    print('next cell ' + new_cells_list[i+1])
    print(colors[new_cells_list[i+1]])


    cur_merged_colors = set()

    for c in colors[new_cells_list[i]]:
        cur_merged_colors.add(c)

    for mc in merged[new_cells_list[i]]:
        for c in init_colors[mc]:
            cur_merged_colors.add(c)

    if('lightgrey' in cur_merged_colors):
        cur_merged_colors.remove('lightgrey')

    if('lightblue' in cur_merged_colors):
        cur_merged_colors.remove('lightblue')


    next_merged_colors = set()

    for c in colors[new_cells_list[i+1]]:
        next_merged_colors.add(c)

    for mc in merged[new_cells_list[i+1]]:
        for c in init_colors[mc]:
            next_merged_colors.add(c)

    if('lightgrey' in next_merged_colors):
        next_merged_colors.remove('lightgrey')

    if('lightblue' in next_merged_colors):
        next_merged_colors.remove('lightblue')

    if(next_merged_colors.issubset(cur_merged_colors) and (not('purple' in next_merged_colors))):
        merged[new_cells_list[i]] = merged[new_cells_list[i]].union(merged[new_cells_list[i+1]])
        merged[new_cells_list[i]].add(new_cells_list[i+1])
        
        merged.pop(new_cells_list[i+1])
        new_cells_list.pop(i+1)

    elif(cur_merged_colors.issubset(next_merged_colors) and (not('purple' in cur_merged_colors))):
        merged[new_cells_list[i+1]] = merged[new_cells_list[i]].union(merged[new_cells_list[i+1]])
        merged[new_cells_list[i+1]].add(new_cells_list[i])
        
        merged.pop(new_cells_list[i])
        new_cells_list.pop(i)
    elif(('purple' in cur_merged_colors) and (not('purple' in next_merged_colors))):
        merged[new_cells_list[i+1]] = merged[new_cells_list[i]].union(merged[new_cells_list[i+1]])
        merged[new_cells_list[i+1]].add(new_cells_list[i])
        
        merged.pop(new_cells_list[i])
        new_cells_list.pop(i)
    else:
        i += 1



# first_train_cell = 0

# for i in range(len(new_cells_list)):
#     if('purple' in colors[new_cells_list[i]]):
#         first_train_cell = i
#         break


# # merge consecutive cells
# i = first_train_cell
# while(i != (len(new_cells_list) - 1)):
#     print('cell ' + new_cells_list[i])
#     print(colors[new_cells_list[i]])

#     print('next cell ' + new_cells_list[i+1])
#     print(colors[new_cells_list[i+1]])


#     cur_merged_colors = set()

#     for c in colors[new_cells_list[i]]:
#         cur_merged_colors.add(c)

#     for mc in merged[new_cells_list[i]]:
#         for c in init_colors[mc]:
#             cur_merged_colors.add(c)

#     if('lightgrey' in cur_merged_colors):
#         cur_merged_colors.remove('lightgrey')

#     if('lightblue' in cur_merged_colors):
#         cur_merged_colors.remove('lightblue')


#     next_merged_colors = set()

#     for c in colors[new_cells_list[i+1]]:
#         next_merged_colors.add(c)

#     for mc in merged[new_cells_list[i+1]]:
#         for c in init_colors[mc]:
#             next_merged_colors.add(c)

#     if('lightgrey' in next_merged_colors):
#         next_merged_colors.remove('lightgrey')

#     if('lightblue' in next_merged_colors):
#         next_merged_colors.remove('lightblue')

#     if('purple' in next_merged_colors):
#         i += 1
#         continue
#     else:
#         merged[new_cells_list[i]] = merged[new_cells_list[i]].union(merged[new_cells_list[i+1]])
#         merged[new_cells_list[i]].add(new_cells_list[i+1])
        
#         merged.pop(new_cells_list[i+1])
#         new_cells_list.pop(i+1)













def pp_merged(merged):
    merged_list = list(merged)

    res = sorted(merged_list, key = cmp_merged)

    final_res = "["

    for elem in res:
        final_res += (str(elem) + ", ")

    final_res += "]"

    return final_res


def pp_merged_train(merged):
    merged_list = list(merged)

    res = sorted(merged_list, key = cmp_merged)

    final_res = ""

    for elem in res:
        final_res += (str(elem) + ", ")

    return final_res


# print('\n\nFinal titles for each cell:')
# print(new_cells_list)
# print()

# for i in range(len(new_cells_list)):
#     print('Cell ' + new_cells_list[i] + ':')
#     print(colors[new_cells_list[i]])
#     print(init_colors[new_cells_list[i]])
#     print()



# final_cells_list = []
final_output = ""

training_count = 0

print('\n\nAnalysis:')

for i in range(len(new_cells_list)):

    print('------------------------------------------------------------')


    # ori_merged_colors = init_colors[new_cells_list[i]]
    merged_colors = set()
    for mc in init_colors[new_cells_list[i]]:
        merged_colors.add(mc)

    for cell in merged[new_cells_list[i]]:
        for color in init_colors[cell]:
            merged_colors.add(color)


    if(len(merged_colors) == 1):

        if('purple' in merged_colors):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')
            cur_res += ('          ' + str(training_count) + '-0 : Training')

            training_count += 1
        else:
            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(merged_colors.pop())))


        final_output += (cur_res + '\n')
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])


    elif((len(merged_colors) == 2) and ('lightblue' in merged_colors) and ('lightgrey' in merged_colors)):
        final_output += ('Section ' + str(i) + ' : Plotting\n')

        print('Section ' + str(i) + ' : Plotting')


    elif((len(merged_colors) == 2) and ('lightblue' in merged_colors)):
        merged_colors.remove('lightblue')

        if(sec == 'purple'):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')
            cur_res += ('          ' + str(training_count) + '-0 : Training\n')
            cur_res += ('          ' + str(training_count) + '-1 : Plotting')
            training_count += 1
        else:
            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(merged_colors.pop())) +'\n')
            cur_res += ('     Subsection : Plotting')


        final_output += (cur_res + '\n')
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])

    elif((len(merged_colors) == 2) and ('lightgrey' in merged_colors)):
        merged_colors.remove('lightgrey')
        sec = merged_colors.pop()

        if(sec == 'purple'):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')
            cur_res += ('          ' + str(training_count) + '-0 : Training')
            training_count += 1

        else:
            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(sec)))

        final_output += (cur_res + '\n')
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])

    elif(('lightblue' in merged_colors) and ('lightgrey' in merged_colors)):
        merged_colors.remove('lightgrey')
        merged_colors.remove('lightblue')

        if('purple' in merged_colors):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')

            cur_res += ('          ' + str(training_count) + '-0 : Training\n')
            merged_colors.remove('purple')

            cur_count = 1
            for c in merged_colors:
                cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : ' + (color_to_label(c)) + '\n')
                cur_count += 1

            cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : Plotting' + '\n')

            training_count += 1
        else:
            sec = merged_colors.pop()

            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(sec))+ '\n')
            # final_output += cur_res + '\n')
            # print(cur_res)

            for c in merged_colors:
                cur_res += ('     Subsection : ' + (color_to_label(c)) + '\n')
                # final_output += (cur_res + '\n')
                # print(cur_res)

            cur_res += ('     Subsection : Plotting\n')
            # print('     Subsection : Plotting')


        final_output += cur_res
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])


    elif('lightblue' in merged_colors):
        # merged_colors.remove('lightgrey')
        merged_colors.remove('lightblue')

        if('purple' in merged_colors):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')

            cur_res += ('          ' + str(training_count) + '-0 : Training\n')
            merged_colors.remove('purple')

            cur_count = 1
            for c in merged_colors:
                cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : ' + (color_to_label(c)) + '\n')
                cur_count += 1

            cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : Plotting' + '\n')

            training_count += 1
        else:
            sec = merged_colors.pop()

            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(sec))+ '\n')
            # final_output += cur_res + '\n')
            # print(cur_res)

            for c in merged_colors:
                cur_res += ('     Subsection : ' + (color_to_label(c)) + '\n')
                # final_output += (cur_res + '\n')
                # print(cur_res)

            cur_res += ('     Subsection : Plotting\n')
            # print('     Subsection : Plotting')


        final_output += cur_res
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])

    elif('lightgrey' in merged_colors):
        merged_colors.remove('lightgrey')
        # merged_colors.remove('lightblue')

        if('purple' in merged_colors):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')

            cur_res += ('          ' + str(training_count) + '-0 : Training\n')
            merged_colors.remove('purple')

            cur_count = 1
            for c in merged_colors:
                cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : ' + (color_to_label(c)) + '\n')
                cur_count += 1

            # cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : Plotting' + '\n')

            training_count += 1
        else:
            sec = merged_colors.pop()

            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(sec))+ '\n')
            # final_output += cur_res + '\n')
            # print(cur_res)

            for c in merged_colors:
                cur_res += ('     Subsection : ' + (color_to_label(c)) + '\n')
                # final_output += (cur_res + '\n')
                # print(cur_res)

            # cur_res += ('     Subsection : Plotting\n')
            # print('     Subsection : Plotting')


        final_output += cur_res
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])


    else:
        # merged_colors.remove('lightgrey')
        # merged_colors.remove('lightblue')

        if('purple' in merged_colors):
            cur_res = ('Section ' + str(i) + ':\n')
            cur_res += ('     Experiment ' + str(training_count) + ':\n')

            cur_res += ('          ' + str(training_count) + '-0 : Training\n')
            merged_colors.remove('purple')

            cur_count = 1
            for c in merged_colors:
                cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : ' + (color_to_label(c)) + '\n')
                cur_count += 1

            cur_res += ('          ' + str(training_count) + '-' + str(cur_count) + ' : Plotting' + '\n')

            training_count += 1
        else:
            sec = merged_colors.pop()

            cur_res = ('Section ' + str(i) + ' : ' + (color_to_label(sec))+ '\n')
            # final_output += cur_res + '\n')
            # print(cur_res)

            for c in merged_colors:
                cur_res += ('     Subsection : ' + (color_to_label(c)) + '\n')
                # final_output += (cur_res + '\n')
                # print(cur_res)

            # cur_res += ('     Subsection : Plotting\n')
            # print('     Subsection : Plotting')


        final_output += cur_res
        print(cur_res)

        merged[new_cells_list[i]].add(new_cells_list[i])


    final_output += (pp_merged(merged[new_cells_list[i]]) + '\n')
    print(pp_merged(merged[new_cells_list[i]]))

    print('------------------------------------------------------------')
    print('                               |')
    print('                               |')
    print('                               |')
    print('                              \\/')


# for cell in merged:
#     print('merged to ' + cell + ':\n')
#     for merged_cell in merged[cell]:
#         print(merged_cell)
#     print()



# for cell in cells:
#     print(str(cell) + ' children : ')
#     print(dep_graph[cell])
#     print()



print(final_output)

print('original cells order:')
print(all_cells)

file = open((name.split(".")[1].split('/')[2].split('_deps')[0] + '_analysis.txt'), 'w')
file.write(final_output)
file.close()


new_colors = dict()

for cell in colors:
    new_colors[cell] = list(colors[cell])
    if((len(new_colors[cell]) >= 2) and ('lightblue' in new_colors[cell])):
        new_colors[cell].remove('lightblue')
    if((len(new_colors[cell]) >= 2) and ('lightgrey' in new_colors[cell])):
        new_colors[cell].remove('lightgrey')


for cell in cells:
    if(len(dep_graph[cell]) != 0):
        g.node(cell, style = 'filled', color = new_colors[cell][0])
        for child in dep_graph[cell]:
            g.node(child, style = 'filled', color = new_colors[child][0])
            g.edge(cell, child)
            

g.view()

