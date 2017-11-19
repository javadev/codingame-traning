import sys
import math


class EntityType:
    REAPER = 0
    DESTROYER = 1
    DOOF = 2
    TANKER = 3
    WRECK = 4


class Entity:
    def __init__(self, id, x, y, radius):
        self.id = id
        self.x = x
        self.y = y
        self.radius = radius

    def squared_distance(self, o):
        return (self.x - o.x) ** 2 + (self.y - o.y) ** 2

    def distance(self, o):
        return self.squared_distance(o) ** .5

    def get_nearest(self, entities):
        if len(entities) == 0:
            return None
        entities = map(lambda e: (e, self.squared_distance(e)), entities)
        entities = sorted(entities, key=lambda e: e[1])
        return entities[0][0]


class Vehicle(Entity):
    def __init__(self, id, x, y, radius, player, mass, friction):
        super().__init__(id, x, y, radius)
        self.player = player
        self.mass = mass
        self.friction = friction


class Reaper(Vehicle):
    def __init__(self, id, x, y, player):
        super().__init__(id, x, y, 400, player, 0.5, 0.2)


class Destroyer(Vehicle):
    def __init__(self, id, x, y, player):
        super().__init__(id, x, y, 400, player, 1.5, 0.3)


class Doof(Vehicle):
    def __init__(self, id, x, y, player):
        super().__init__(id, x, y, 400, player, 1, 0.25)


class Tanker(Vehicle):
    def __init__(self, id, x, y, radius, mass, water_quantity):
        super().__init__(id, x, y, radius, -1, mass, 0.4)
        self.water_quantity = water_quantity


class Wreck(Entity):
    def __init__(self, id, x, y, radius, water_quantity):
        super().__init__(id, x, y, radius)
        self.water_quantity = water_quantity


# game loop
while True:
    my_reaper = None
    my_destroyer = None
    tankers = []
    wrecks = []

    my_score = int(input())
    enemy_score_1 = int(input())
    enemy_score_2 = int(input())
    my_rage = int(input())
    enemy_rage_1 = int(input())
    enemy_rage_2 = int(input())
    unit_count = int(input())

    for i in range(unit_count):
        line_input = input()
        # print(line_input, file=sys.stderr)
        unit_id, unit_type, player, mass, radius, x, y, vx, vy, extra, extra_2 = line_input.split()
        unit_id = int(unit_id)
        unit_type = int(unit_type)
        player = int(player)
        mass = float(mass)
        radius = int(radius)
        x = int(x)
        y = int(y)
        vx = int(vx)
        vy = int(vy)
        extra = int(extra)
        extra_2 = int(extra_2)
        if unit_type == EntityType.REAPER and player == 0:
            my_reaper = Reaper(unit_id, x, y, player)
        elif unit_type == EntityType.DESTROYER and player == 0:
            my_destroyer = Destroyer(unit_id, x, y, player)
        elif unit_type == EntityType.TANKER:
            tankers.append(Tanker(unit_id, x, y, radius, mass, extra))
        elif unit_type == EntityType.WRECK:
            wrecks.append(Wreck(unit_id, x, y, radius, extra))

    if len(wrecks) == 0:
        print("WAIT")
    else:
        wreck_to_go = my_reaper.get_nearest(wrecks)
        speed = 300 if my_reaper.distance(wreck_to_go) > wreck_to_go.radius else 0
        print("{} {} {}".format(wreck_to_go.x, wreck_to_go.y, speed))

    if len([t for t in tankers if t.water_quantity > 1]) == 0:
        print('WAIT')
    else:
        tanker_to_attack = sorted(tankers, key=lambda t: t.water_quantity, reverse=True)[0]
        print("{} {} {}".format(tanker_to_attack.x, tanker_to_attack.y, 300))

    print("WAIT")