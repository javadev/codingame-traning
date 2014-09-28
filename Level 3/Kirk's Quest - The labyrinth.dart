import "dart:io" show stdin;
import "dart:math" show Point;

void main() {
  var init = readLine();
  var rows = init[0];
  var cols = init[1];
  var energy = init[2];

  var solver = new Solver(rows, cols);

  while (true) {
    var kirk = readPoint();
    var map = readMap(rows);

    var action = solver.solve(kirk, map, energy);

    print(action);
  }
}

class Solver {
  Point room;
  Point exit;

  List<String> pathRoom;
  List<String> pathExit;

  List<List<bool>> visited;

  Solver(int rows, int cols) {
    visited = new List<List<bool>>.generate(
        rows,
        (_) => new List<bool>.filled(cols, false));
  }

  String solve(Point kirk, List<String> map, int energy) {
    visited[kirk.y][kirk.x] = true;

    // Stores the exit position (Kirk's starting position).
    if (exit == null) exit = kirk;

    // Finds and stores the control room position.
    if (room == null) room = findControlRoom(kirk, map);

    if (room != null && pathRoom == null) {

      // Finds a path from Kirk to the control room.
      var kirkRoom = findPath(map, kirk, room);
      if (kirkRoom != null) {

        // Now finds a valid path from the control room to the exit.
        var roomExit = findPath(map, room, exit);
        if (roomExit != null && roomExit.length <= energy) {

          pathRoom = kirkRoom;
          pathExit = roomExit;
        }
      }
    }

    // Was a path already found? Follow it!
    if (pathRoom != null && pathRoom.isNotEmpty) return pathRoom.removeLast();

    if (pathExit != null) return pathExit.removeLast();

    // Follows exploring the labyrinth.
    return explore(kirk, map);
  }

  List<String> findPath(List<String> map, Point start, Point end) {
    var path;

    // Inspect the map.
    var visits = visit(map, start, end);

    // Build the path, but only if the end point was found.
    var current = visits[end];
    if (current != null) {
      path = new List<String>();

      while (current.pos != start) {
        path.add(current.dir);

        var next = move(current.pos, invert(current.dir));

        current = visits[next];
      }
    }

    return path;
  }

  final List<String> DIRS = const <String>["UP", "DOWN", "LEFT", "RIGHT"];

  Map<Point, Visit> visit(List<String> map, Point start, Point end) {
    var visits = new Map<Point, Visit>();

    // Use a local array to avoid stackoverflow exception.
    var stack = new List<Visit>()..add(new Visit(start, null, 0));

    while (stack.isNotEmpty) {
      var current = stack.removeLast();

      var prev = visits[current.pos];

      // Unvisited cell or cheaper path found?
      if (prev == null || current.cost < prev.cost) {
        visits[current.pos] = current;

        // Still not there?
        if (current.pos != end) {

          // Visit the neighbours.
          for (var dir in DIRS) {
            var next = move(current.pos, dir);

            if (isHollow(next, map)) {
              stack.add(new Visit(next, dir, current.cost + 1));
            }
          }
        }
      }
    }

    return visits;
  }

  final Map<String, String> TURNS = const <String, String>{
    "LEFT": "DOWN",
    "DOWN": "RIGHT",
    "RIGHT": "UP",
    "UP": "LEFT"
  };

  String dir = "LEFT";

  String explore(Point kirk, List<String> map) {
    var pos;

    // Moves Kirk with one of his hands touching the wall.
    while (true) {

      // Tries to turn in another direction.
      var turn = TURNS[dir];

      pos = move(kirk, turn);
      if (isExplorable(pos, map)) {
        dir = turn;
        break;
      }

      // Tries to follow moving in the previous direction.
      pos = move(kirk, dir);
      if (isExplorable(pos, map)) {
        break;
      }

      // No way! Turn again.
      dir = invert(turn);
    }


        // THE TRICK: The labyrinths can't be solved with the used heuristic, so Kirk

        // tries to change his direction when passes through one already visited cell.
    if (visited[pos.y][pos.x]) {

      pos = move(kirk, invert(dir));
      if (isExplorable(pos, map) && !visited[pos.y][pos.x]) {
        dir = invert(dir);
      }
    }

    return dir;
  }

  bool isValid(Point pos, List<String> map) =>
      pos.x >= 0 && pos.x < map[0].length && pos.y >= 0 && pos.y < map.length;

  bool isControlRoom(Point pos, List<String> map) =>
      isValid(pos, map) && map[pos.y][pos.x] == "C";

  bool isHollow(Point pos, List<String> map) =>
      isValid(pos, map) && ".CT".contains(map[pos.y][pos.x]);

  bool isExplorable(Point pos, List<String> map) =>
      isHollow(pos, map) && !(pos == room && pathRoom == null);

  Point findControlRoom(Point kirk, List<String> map) {
    for (var i = -2; i <= 2; ++i) {
      for (var j = -2; j <= 2; ++j) {
        var pos = new Point(kirk.x + i, kirk.y + j);
        if (isControlRoom(pos, map)) {
          return pos;
        }
      }
    }
    return null;
  }

  Point move(Point pos, String dir) {
    switch (dir) {
      case "UP": return new Point(pos.x, pos.y - 1);
      case "DOWN": return new Point(pos.x, pos.y + 1);
      case "LEFT": return new Point(pos.x - 1, pos.y);
      case "RIGHT": return new Point(pos.x + 1, pos.y);
    }
    return null;
  }

  String invert(String dir) {
    switch (dir) {
      case "UP": return "DOWN";
      case "DOWN": return "UP";
      case "LEFT": return "RIGHT";
      case "RIGHT": return "LEFT";
    }
    return null;
  }
}

class Visit {
  final Point pos;
  final String dir;
  final int cost;

  Visit(this.pos, this.dir, this.cost);
}

String readString() => stdin.readLineSync();

List<int> readLine() => readString().split(" ").map(int.parse).toList();

Point readPoint() {
  var line = readLine();

  return new Point(line[1], line[0]);
}

List<String> readMap(int n) =>
    new List<String>.generate(n, (_) => readString());
