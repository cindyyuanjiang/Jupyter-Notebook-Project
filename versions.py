import sys
from graph_prop_labels import *
from collections import defaultdict

# min heap implementation adopted from 15780 course work
from heapq import heappush, heappop

class PQNode:
    def __init__(self, id1, id2, len1, len2, distance):
        self.id1 = id1
        self.id2 = id2
        self.len1 = len1
        self.len2 = len2
        self.distance = distance

    def __gt__(self, other_node):
        return self.distance > other_node.distance

class PriorityQueue:
    def __init__(self):
        self.elements = []

    def size(self):
        return len(self.elements)

    def push(self, element, priority):
        '''
        Adds an element along with its priority.
        '''
        heappush(self.elements, (priority, element))

    def pop(self):
        '''
        Retrieves the element with lowest priority.
        '''
        return heappop(self.elements)[1]


# Levenshtein distance
def edit_distance(s1, s2):
    n = len(s1)
    m = len(s2)
    result = [[0 for j in range(m+1)]  for i in range(n+1)]
    for i in range(m):
        result[0][i+1] = i + 1

    for i in range(n):
        result[i+1][0] = i + 1

    for i in range(n):
        for j in range(m):
            if s1[i] == s2[j]:
                result[i+1][j+1] = result[i][j]
            else:
                result[i+1][j+1] = min(result[i][j], min(result[i][j+1], result[i+1][j])) + 1

    return result[n][m]


def construct_map(content):
    content = content.split("##")
    result = dict()
    for item in content[1:]:
        splitted = item.split("@@")
        result[int(splitted[0])] = splitted[1]
    return result


def construct_labeling_map(content):
    content = content.split("\n")
    result = dict()
    for item in content[:-1]:
        splitted = item.split(" : ")
        result[int(splitted[0])] = splitted[1]
    return result


# test function for Levenshtein distance
def test_edit_distance():
    assert(edit_distance("", "a") == 1)
    assert(edit_distance("a", "a") == 0)
    assert(edit_distance("a", "b") == 1)
    assert(edit_distance("a", "ab") == 1)
    assert(edit_distance("ab", "ab") == 0)
    assert(edit_distance("kitten", "sitting") == 3)
    assert(edit_distance("Sunday", "Saturday") == 3)


# test function for priority queue
def test_pq():
    pq = PriorityQueue()
    pq.push(PQNode(1, 2, 0, 0, 1), 1)
    pq.push(PQNode(1, 4, 0, 0, 5), 5)
    pq.push(PQNode(2, 2, 0, 0, 2), 2)
    pq.push(PQNode(2, 4, 0, 0, 0), 0)
    pq.push(PQNode(3, 2, 0, 0, 2), 2)
    pq.push(PQNode(3, 4, 0, 0, 3), 3)
    assert(pq.pop().distance == 0)
    assert(pq.pop().distance == 1)
    assert(pq.pop().distance == 2)
    assert(pq.pop().distance == 2)
    assert(pq.pop().distance == 3)
    assert(pq.pop().distance == 5)


def greedy_approach(content_1, content_2, labels_1, labels_2, threshold):
    # int to string
    map_1 = construct_map(content_1)
    map_2 = construct_map(content_2)
    labelings_1 = construct_labeling_map(labels_1)
    labelings_2 = construct_labeling_map(labels_2)

    pq = PriorityQueue()
    for k1 in map_1:
        for k2 in map_2:
            l1 = len(map_1[k1])
            l2 = len(map_2[k2])
            dist = edit_distance(map_1[k1], map_2[k2])
            pq.push(PQNode(k1, k2, l1, l2, dist), dist)

    set_1 = set(map_1.keys())
    set_2 = set(map_2.keys())
    connection = dict()
    while len(set_1) != 0 and len(set_2) != 0 and pq.size() > 0:
        node = pq.pop()
        # remove if distance is not too large compared to the lengths of the two strings
        # avoid issues like: 
        # len 1 = len 2 = 10, distance = 8
        # len 1 = len 2 = 100, distance = 10
        # which pair should be removed first?
        if (node.id1 in set_1) and (node.id2 in set_2) and node.distance < threshold * min(node.len1, node.len2):
            set_1.remove(node.id1)
            set_2.remove(node.id2)
            connection[node.id1] = (node.id2, node.distance)

    print("Cell that have NOT been changed:")
    for k in connection:
        if connection[k][1] == 0:
            if labelings_1[k] == labelings_2[connection[k][0]]:
                print("{} -> {} : {}".format(k, connection[k][0], labelings_1[k]))
            else:
                print("{} -> {} : {} -> {}".format(k, connection[k], labelings_1[k], labelings_2[connection[k][0]]))

    print("\nCell that have been changed:")
    for k in connection:
        if connection[k][1] > 0:
            if labelings_1[k] == labelings_2[connection[k][0]]:
                print("{} -> {} : {}, distance = {}".format(k, connection[k][0], labelings_1[k], connection[k][1]))
            else:
                print("{} -> {} : {} -> {}, distance = {}".format(k, connection[k][0], labelings_1[k], labelings_2[connection[k][0]], connection[k][1]))

    print("\nCells that have been removed: {}".format(set_1))
    print("\nCells that have been added: {}".format(set_2))
    return


def construct_list(content):
    content = content.split("##")
    result = []
    for item in content[1:]:
        splitted = item.split("@@")
        result.append([int(splitted[0]), splitted[1]])
    return result


def alignment_total_number_of_matches(content_list_1, content_list_2, threshold):
    n = len(content_list_1)
    m = len(content_list_2)
    distances = [[0 for i in range(m)] for j in range(n)]
    for i in range(n):
        for j in range(m):
            s1 = content_list_1[i][1]
            s2 = content_list_2[j][1]
            distances[i][j] = edit_distance(s1, s2)
    dp = [[0 for i in range(m + 1)] for j in range(n + 1)]
    back_track = [[0 for i in range(m + 1)] for j in range(n + 1)]
    connection = dict()
    for i in range(1, n+1):
        for j in range(1, m+1):
            s1 = content_list_1[i-1][1]
            s2 = content_list_2[j-1][1]
            # dist = edit_distance(s1, s2)
            # if dist < threshold * min(len(s1), len(s2)):
            if distances[i-1][j-1] < threshold * min(len(s1), len(s2)):
                # found a match
                v1 = dp[i-1][j-1] + 1
            else:
                v1 = dp[i-1][j-1]
            v2 = dp[i-1][j]
            v3 = dp[i][j-1]
            cur_max = max(max(v1, v2), v3)
            if v1 == cur_max:
                back_track[i][j] = 0
            elif v2 == cur_max:
                back_track[i][j] = 1
            else:
                back_track[i][j] = 2
            dp[i][j] = cur_max
    i = n
    j = m
    while i > 0 and j > 0:
        if back_track[i][j] == 0:
            if dp[i][j] == dp[i-1][j-1] + 1:
                # s1 = content_list_1[i-1][1]
                # s2 = content_list_2[j-1][1]
                # dist = edit_distance(s1, s2)
                # connection[content_list_1[i-1][0]] = [content_list_2[j-1][0], dist]
                connection[content_list_1[i-1][0]] = [content_list_2[j-1][0], distances[i-1][j-1]]
            i -= 1
            j -= 1
        elif back_track[i][j] == 1:
            i -= 1
        else:
            j -= 1

    return dp, back_track, connection


def alignment_sum_of_distance(content_list_1, content_list_2, threshold):
    n = len(content_list_1)
    m = len(content_list_2)
    distances = [[0 for i in range(m)] for j in range(n)]
    for i in range(n):
        for j in range(m):
            s1 = content_list_1[i][1]
            s2 = content_list_2[j][1]
            distances[i][j] = edit_distance(s1, s2)
    dp = [[0 for i in range(m + 1)] for j in range(n + 1)]
    back_track = [[0 for i in range(m + 1)] for j in range(n + 1)]
    connection = dict()
    for i in range(1, n+1):
        for j in range(1, m+1):
            s1 = content_list_1[i-1][1]
            s2 = content_list_2[j-1][1]
            # dist = edit_distance(s1, s2)
            if distances[i-1][j-1] < threshold * min(len(s1), len(s2)):
                # found a match
                v1 = dp[i-1][j-1] + distances[i-1][j-1]
            else:
                v1 = dp[i-1][j-1] + max(len(s1), len(s2))
            v2 = dp[i-1][j] + len(s1)
            v3 = dp[i][j-1] + len(s2)
            cur_max = min(min(v1, v2), v3)
            if v1 == cur_max:
                back_track[i][j] = 0
            elif v2 == cur_max:
                back_track[i][j] = 1
            else:
                back_track[i][j] = 2
            dp[i][j] = cur_max
    i = n
    j = m
    while i > 0 and j > 0:
        if back_track[i][j] == 0:
            # s1 = content_list_1[i-1][1]
            # s2 = content_list_2[j-1][1]
            # dist = edit_distance(s1, s2)
            if dp[i][j] == dp[i-1][j-1] + distances[i-1][j-1]:
                # connection[content_list_1[i-1][0]] = [content_list_2[j-1][0], dist]
                connection[content_list_1[i-1][0]] = [content_list_2[j-1][0], distances[i-1][j-1]]
            i -= 1
            j -= 1
        elif back_track[i][j] == 1:
            i -= 1
        else:
            j -= 1

    return dp, back_track, connection


def alignment_approach(content_1, content_2, labels_1, labels_2, threshold):
    content_list_1 = construct_list(content_1)
    content_list_2 = construct_list(content_2)
    labelings_1 = construct_labeling_map(labels_1)
    labelings_2 = construct_labeling_map(labels_2)
    analysis = ""

    # Approach 1
    # dp, back_track, connection = alignment_total_number_of_matches(content_list_1, content_list_2, threshold)

    # Approach 2
    dp, back_track, connection = alignment_sum_of_distance(content_list_1, content_list_2, threshold)
    # for k in list(connection.keys())[::-1]:
    #     print("cell {} : cell {}, distance = {}".format(k, connection[k][0],connection[k][1]))

    set_1 = set(labelings_1.keys())
    set_2 = set(labelings_2.keys())

    unchanged = defaultdict(list)
    changed = defaultdict(list)

    for k in connection:
        set_1.remove(k)
        set_2.remove(connection[k][0])
        # unchaged
        if connection[k][1] == 0:
            unchanged[labelings_1[k]].append(k)
        else:
            changed[labelings_1[k]].append(k)

    analysis += "\nCells that have NOT been changed (distance = 0):\n"
    for label in unchanged:
        analysis += "[{}] {} cells:\n".format(len(unchanged[label]), label)
        for k in unchanged[label]:
            if labelings_1[k] == labelings_2[connection[k][0]]:
                analysis += "{} -> {} : {}\n".format(k, connection[k][0], labelings_1[k])
            else:
                analysis += "{} -> {} : {} -> {}\n".format(k, connection[k], labelings_1[k], labelings_2[connection[k][0]])
        analysis += "\n"

    analysis += "\nCell that have been changed:\n"
    for label in changed:
        analysis += "[{}] {} cells:\n".format(len(changed[label]), label)
        for k in changed[label]:
            if labelings_1[k] == labelings_2[connection[k][0]]:
                analysis += "{} -> {} : {}, distance = {}\n".format(k, connection[k][0], labelings_1[k], connection[k][1])

            else:
                analysis += "{} -> {} : {} -> {}, distance = {}\n".format(k, connection[k][0], labelings_1[k], labelings_2[connection[k][0]], connection[k][1])
        analysis += "\n"

    added = defaultdict(list)
    for cell in set_2:
        added[labelings_2[cell]].append(cell)

    analysis += "\nCells that have been added:\n"
    for label in added:
        analysis += "[{}] {} cells:\n".format(len(added[label]), label)
        analysis += "{}\n".format(added[label])

    removed = defaultdict(list)
    for cell in set_1:
        removed[labelings_1[cell]].append(cell)

    analysis += "\nCells that have been removed:\n"
    for label in removed:
        analysis += "[{}] {} cells:\n".format(len(removed[label]), label)
        analysis += "{}\n".format(removed[label])

    # print("\nCell that have NOT been changed:")
    # for k in connection:
    #     set_1.remove(k)
    #     set_2.remove(connection[k][0])
    #     if connection[k][1] == 0:
    #         if labelings_1[k] == labelings_2[connection[k][0]]:
    #             print("{} -> {} : {}".format(k, connection[k][0], labelings_1[k]))
    #         else:
    #             print("{} -> {} : {} -> {}".format(k, connection[k], labelings_1[k], labelings_2[connection[k][0]]))

    # print("\nCell that have been changed:")
    # changed = set()
    # for k in connection:
    #     if connection[k][1] > 0:
    #         changed.add(connection[k][0])
    #         if labelings_1[k] == labelings_2[connection[k][0]]:
    #             print("{} -> {} : {}, distance = {}".format(k, connection[k][0], labelings_1[k], connection[k][1]))

    #         else:
    #             print("{} -> {} : {} -> {}, distance = {}".format(k, connection[k][0], labelings_1[k], labelings_2[connection[k][0]], connection[k][1]))

    # print("\nCells that have been added: {}".format(set_2))
    # print("\nCells that have been removed: {}".format(set_1))

    changed_cells = set()
    for k in changed:
        for cell in changed[k]:
            changed_cells.add(cell)

    return changed_cells, set_2, labelings_2, analysis, connection


def analyze(file_1_name, file_2_name, file_1_labelings, file_2_labelings, threshold):
    file_1 = open(file_1_name, "r")
    file_2 = open(file_2_name, "r")
    file_1_labelings = open(file_1_labelings, "r")
    file_2_labelings = open(file_2_labelings, "r")
    content_1 = file_1.read()
    content_2 = file_2.read()
    labels_1 = file_1_labelings.read()
    labels_2 = file_2_labelings.read()

    changed, added, final_labels, analysis, connection = alignment_approach(content_1, content_2, labels_1, labels_2, threshold)

    file_2_name = str(file_2_name)
    # print(file_2_name + "\n\n")
    labels_filename = file_2_name[:file_2_name.rfind(".")][:-12] + "_new_labels.txt"
    # print(changed)
    # print(added)
    cell_deps = graph_versions(labels_filename, changed, added, final_labels)

    return analysis, connection, final_labels, cell_deps


if __name__ == "__main__":
    test_edit_distance()
    test_pq()

    file_1_name = sys.argv[1]
    file_2_name = sys.argv[2]
    file_1_labelings = sys.argv[3]
    file_2_labelings = sys.argv[4]
    threshold = float(sys.argv[5])
    # threshold = 0.5

    file_1 = open(file_1_name, "r")
    file_2 = open(file_2_name, "r")
    file_1_labelings = open(file_1_labelings, "r")
    file_2_labelings = open(file_2_labelings, "r")
    content_1 = file_1.read()
    content_2 = file_2.read()
    labels_1 = file_1_labelings.read()
    labels_2 = file_2_labelings.read()

    # greedy_approach(content_1, content_2, labels_1, labels_2, threshold)
    changed, added, final_labels = alignment_approach(content_1, content_2, labels_1, labels_2, threshold)

    file_2_name = str(file_2_name)
    print(file_2_name + "\n\n")
    labels_filename = file_2_name[:file_2_name.rfind(".")][:-12] + "_new_labels.txt"
    print("before graph")
    print(changed)
    print(added)
    graph_versions(labels_filename, changed, added, final_labels)
    print("after graph")

