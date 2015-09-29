#!/usr/bin/env python3
# Written by Ivan Anishchuk (anishchuk.ia@gmail.com) in 2015
"""
Solution for APU: Improvement Phase game on codingame.

It was presented on There Is No Spoon contest but I finished it only after.
The game is essentially a Hashiwokakero (Bridges) puzzle.
My solution is similar brute-force search with some improvements. Search is
done iteratively and skips a lot of "invalid" possible solutions. Direction of
the connections is always from left to the right and than down, this way we can
avoid a few long-to-implement checks (for the same reason I decided against
connecting "simple" parts before everything else).
Well, actually it's much better than brute-force search (I tried that during the
contest and it just time-outed on the longer tests) but certainly still not
optimal in many ways, but works OK for the given task so I stopped optimizing
it further after I received 100% score.
NOTE: the test attached is the "Expert" test used after you submit the code (not
the one used why you still write it). I needed it to profile my code because the
first "Expert" test the earlier version of my program solved much faster than it.
"""
import sys
from collections import OrderedDict, deque


class Node():
    """
    Basic structure for nodes/islands.

    Contains the information about position and neighbors
    and very few logic.
    """
    right = None
    left = None
    down = None
    up = None

    def __init__(self, pos, amount, number):
        self.pos = pos
        self.amount = amount
        self.x = pos[0]
        self.y = pos[1]
        self.number = number

    def after(self):
        return(int(self.right is not None) + int(self.down is not None))

    def before(self):
        return(int(self.left is not None) + int(self.up is not None))

    def __str__(self):
        return('Node at {1.pos}'.format(self))


def check_connectivity(case, nodes):
    """
    Check whether solution is a single connected group.

    Using breadth-first search algorithm.
    """
    print('check connectivity', case, file=sys.stderr)
    queue = deque()
    discovered = []
    # Reversed position/node number dictionary. We need it to quickly find a
    # corresponding code in `case` for a node we're checking.
    numbers = dict((pos, i) for i, pos in enumerate(nodes))
    # Start with the first node.
    queue.append(list(nodes)[0])
    while queue:
        current_pos = queue.pop()
        down, right = divmod(case[numbers[current_pos]], 3)
        down = down and nodes[current_pos].down is not None
        right = right and nodes[current_pos].right is not None
        up = (
            nodes[current_pos].up is not None
            and divmod(case[numbers[nodes[current_pos].up.pos]], 3)[0]
        )
        left = (
            nodes[current_pos].left is not None
            and divmod(case[numbers[nodes[current_pos].left.pos]], 3)[1]
        )
        # right and down neighbors are usually not in `discovered`. `up` and
        # `left` most usually are. But we should check anyway.
        if down:
            queue.append(nodes[current_pos].down.pos)
        if right:
            queue.append(nodes[current_pos].right.pos)
        if up and nodes[current_pos].up.pos not in discovered:
            queue.append(nodes[current_pos].up.pos)
        if left and nodes[current_pos].left.pos not in discovered:
            queue.append(nodes[current_pos].left.pos)

        if current_pos not in discovered:
            discovered.append(current_pos)

    last_node = max(numbers[pos] for pos in discovered)
    return(len(discovered) == len(nodes), last_node)


# The machines are gaining ground. Time to show them what we're really made of...
# Read the input.
data = []
width = int(input())  # the number of cells on the X axis
height = int(input())  # the number of cells on the Y axis
for i in range(height):
    line = input()  # width characters, each either a number or a '.'
    data.append(list(line))

nodes = OrderedDict()
nodenum = 0
# Generate `Node` object for the nodes.
for y in range(height):
    for x in range(width):
        if data[y][x].isnumeric():
            nodes[(x, y)] = Node((x, y), int(data[y][x]), nodenum)
            nodenum += 1

# The total number of the nodes.
N = len(nodes)

# Find all the neighbors for each node.
for (x, y), node in nodes.items():
    for xx in range(x+1, width):
        if (xx, y) in nodes:
            node.right = nodes[(xx, y)]
            nodes[(xx, y)].left = node
            break
    for yy in range(y+1, height):
        if (x, yy) in nodes:
            node.down = nodes[(x, yy)]
            nodes[(x, yy)].up = node
            break

# list of amounts of connections for each nodes. Very useful for some checks.
nodeslist = [node.amount for node in nodes.values()]
# Case is a sequence of ternary codes for connections we draw from each node
# (down and right). Code = (connections down)*3 + (connections right)
# i.e. 0 for zero connections, 8 for two connections in each direction.
# The first number can never be zero, of course, since it's the upper-most
# and left-most node.
case = [1] + [0]*(N - 1)
# Iterations counter.
casenum = 0
# The node we're gonna increase the code for in the next iteration.
current_node = 0
# Structures we use to check for collisions.
vert = {}
horz = {}
# Just optimisations.
nd = list(nodeslist)
nodes_items = list(nodes.items())

while case[0] < 9:

    ok = True
    # If nothing comes, we increment code for the last node (last code is always
    # 0 but we have it there anyway so everything has the same length).
    failed_node = N - 2
    # We set it after some special checks.
    node_number = None
    # Node for incrementing after the next iteration.
    next_current = current_node

    if nodeslist[0] != sum(divmod(case[0], 3)):
        # We can easily check if we have enough connections in the first node.
        ok = False
        failed_node = 0

    if ok:
        # The main check: whether there are enough connections and no
        # collisions when we actually connect everything.
        for j, ((x, y), node) in enumerate(nodes_items[current_node:]):
            i = current_node + j
            down, right = divmod(case[i], 3)

            # Not enough or too much connections.
            if nd[i] != down + right:
                ok = False

            if ok and down:
                if node.down is None:
                    ok = False
                    down = False
                else:
                    down_node = node.down.number
                    if nd[down_node] < down:
                        # Too much connections down.
                        ok = False
                    down_y = node.down.y

            if ok and right:
                if node.right is None:
                    ok = False
                    right = False
                else:
                    right_node = node.right.number
                    if nd[right_node] < right:
                        # Too much connections right.
                        ok = False
                    right_x = node.right.x

            if not ok:
                failed_node = i
                next_current = i
                break

            if right:
                # Collision check.
                for xx in range(x+1, right_x):
                    if xx in vert:
                        for y1, y2 in vert[xx]:
                            if y1 < y < y2:
                                ok = False
                                failed_node = i
                                break
                        if not ok:
                            break
                else:
                    if right_x - x > 1:
                        horz.setdefault(y, [])
                        horz[y].append((x, right_x))
                    nd[right_node] -= right

            if not ok:
                failed_node = i
                next_current = i
                break

            if down:
                # No collision checks because we can't ever have down-collisions
                # going from left to the right and down.
                if down_y - y > 1:
                    vert.setdefault(x, [])
                    vert[x].append((y, down_y))
                nd[down_node] -= down
            # We subtract everything and add connections to the lists in the
            # end of the iteration so we can re-use the structures easily next
            # iteration.
            nd[i] -= down + right

    if ok:
        # Check connectivity.
        checked, node_number = check_connectivity(case, nodes)
        if not checked:
            ok = False
            failed_node = node_number

    if not ok:
        # Wrong solution. Let's iterate.
        case[failed_node] += 1
        case[failed_node + 1:] = [0] * (N - failed_node - 1)
        for i in range(failed_node, -1, -1):
            if case[i] > 8 and i != 0:
                case[i] = 0
                case[i-1] += 1
                node_number = i - 1
        if (
            node_number is not None
            or failed_node == 0
            or failed_node < current_node
        ):
            # We can't re-use the structures easily so we have to start over.
            next_current = 0
            horz = {}
            vert = {}
            nd = list(nodeslist)
        current_node = next_current
        casenum += 1
        continue
    else:
        break

if ok:
    print('Found a solution', case, file=sys.stderr)
    for i, ((x, y), node) in enumerate(nodes.items()):
        down, right = divmod(case[i], 3)
        if down:
            print(x, y, node.down.x, node.down.y, down)
        if right:
            print(x, y, node.right.x, node.right.y, right)
