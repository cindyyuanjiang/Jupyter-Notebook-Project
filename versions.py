# min heap implementation adopted from 15780 course work
from heapq import heappush, heappop

class PQNode:
    def __init__(self, id1, id2, distance):
        self.id1 = id1
        self.id2 = id2
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

if __name__ == "__main__":
    # print(edit_distance("kitten", "sitting"))
    # print(edit_distance("Sunday", "Saturday"))
    ids_one = {1, 2, 3}
    ids_two = {2, 4}
    pq = PriorityQueue()
    pq.push(PQNode(1,2,1), 1)
    pq.push(PQNode(1,4,5), 5)
    pq.push(PQNode(2,2,2), 2)
    pq.push(PQNode(2,4,0), 0)
    pq.push(PQNode(3,2,2), 2)
    pq.push(PQNode(3,4,3), 3)
    while pq.size() > 0:
        node = pq.pop()
        print("id 1 = {}, id 2 = {}, dist = {}".format(node.id1, node.id2, node.distance))