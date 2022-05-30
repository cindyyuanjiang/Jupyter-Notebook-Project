import sys

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


if __name__ == "__main__":
    test_edit_distance()
    test_pq()

    file_1 = sys.argv[1]
    file_2 = sys.argv[2]
    threshold = float(sys.argv[3])

    file_1 = open(file_1, "r")
    file_2 = open(file_2, "r")
    content_1 = file_1.read()
    content_2 = file_2.read()

    map_1 = construct_map(content_1)
    map_2 = construct_map(content_2)

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
            print("id 1 = {}, id 2 = {}, dist = {}".format(node.id1, node.id2, node.distance))
            set_1.remove(node.id1)
            set_2.remove(node.id2)
            connection[node.id1] = node.id2

    print("set 1 left with = {}".format(set_1))
    print("set 2 left with = {}".format(set_2))

