import "dart:io" show stdin;
import "dart:math" show Point;

void main() {
  var init = readLine();
  var w = init[0];
  var h = init[1];
  var map = readMap(h);
  var ex = readInt();

  var solver = new Solver(w, h, map, ex);

  while (true) {
    var pos = readPosition();
    var r = readInt();
    var rocks = readRocks(r);

    var command = solver.solve(pos, rocks);

    print(command);
  }
}

class Solver {
  int w;
  int h;
  List<List<int>> map;
  int ex;

  List<Command> solution;

  Solver(this.w, this.h, this.map, this.ex);

  String solve(Position pos, List<Position> rocks) {
    var command;

    // First time here? Solve the puzzle!
    if (solution == null) {
      solution = new List<Command>();

      solveFrom(pos);
    }

    // Move!
    var next = move(pos);

    // Is Indy ok? Try to break some rocks.
    if (canEnter(next)) {
      command = breakRocks(rocks, pos);
    }

    // No rocks? Follow the found solution.
    if (command == null && solution.isNotEmpty) {
      command = solution.removeLast();
    }

    // Updates the map.
    if (command != null) {
      rotate(command.x, command.y, command.dir);
    }

    return command == null ?
        "WAIT" :
        "${command.x} ${command.y} ${command.dir}";
  }

  bool solveFrom(Position pos) {

    // Done?
    if (pos.y == h - 1 && pos.x == ex) return true;

    // Move!
    var next = move(pos);

    // Out of bounds?
    if (next.y < 0 || next.y >= h) return false;
    if (next.x < 0 || next.x >= w) return false;

    // Can enter and solve from there?
    if (canEnter(next) && solveFrom(next)) return true;

    // Can rotate?
    if (map[next.y][next.x] <= 1) return false;

    // Rotates to the left.
    if (solveRotate(next, ["LEFT"])) return true;

    // Rotates to the right.
    if (solveRotate(next, ["RIGHT"])) return true;

    // THE TRICK: Rotates to the left (or right) two times!
    if (solveRotate(next, ["LEFT", "LEFT"])) return true;

    return false;
  }

  bool solveRotate(Position pos, List<String> dirs) {

    // Rotates.
    dirs.forEach((dir) => rotate(pos.x, pos.y, dir));

    // Can enter and solve from there?
    var solved = canEnter(pos) && solveFrom(pos);

    if (solved) {
      dirs.forEach((dir) => solution.add(new Command(pos.x, pos.y, dir)));
    }

    // Poor man's undo.
    dirs.forEach(
        (dir) => rotate(pos.x, pos.y, dir == "LEFT" ? "RIGHT" : "LEFT"));

    return solved;
  }

  Command breakRocks(List<Position> rocks, Position indy) {
    var command;

    var min;

    for (var rock in rocks) {

      // Move!
      var next = move(rock);

      var breaker;

      var len = 0;

      while (true) {

        // Out of bounds?
        if (next.y < 0 || next.y >= h) break;
        if (next.x < 0 || next.x >= w) break;

        // Indy is here!
        if (next.y == indy.y && next.x == indy.x) break;

        // Broken?
        if (!canEnter(next)) break;

        // Can rotate?
        if (map[next.y][next.x] > 1) {

          // Rotates.
          breaker = new Command(next.x, next.y, "RIGHT");
          break;
        }

        len++;

        next = move(next);
      }

      // Rotate?
      if (breaker != null && (min == null || len < min)) {
        min = len;
        command = breaker;
      }
    }

    return command;
  }


  Position move(Position pos) {
    var entry = pos.entry;

    switch (map[pos.y][pos.x].abs()) {
      case 0: break;
      case 1: entry = "TOP"; break;
      case 2: break;
      case 3: break;
      case 4: entry = entry == "TOP" ? "RIGHT" : "TOP"; break;
      case 5: entry = entry == "TOP" ? "LEFT" : "TOP"; break;
      case 6: break;
      case 7: entry = "TOP"; break;
      case 8: entry = "TOP"; break;
      case 9: entry = "TOP"; break;
      case 10: entry = "RIGHT"; break;
      case 11: entry = "LEFT"; break;
      case 12: entry = "TOP"; break;
      case 13: entry = "TOP"; break;
    }

    var x = pos.x;
    var y = pos.y;

    if (entry == "TOP") y++;
    if (entry == "LEFT") x++;
    if (entry == "RIGHT") x--;

    return new Position(x, y, entry);
  }

  bool canEnter(Position pos) {
    var entry = pos.entry;

    switch (map[pos.y][pos.x].abs()) {
      case 0: return false;
      case 1: return true;
      case 2: return entry == "LEFT" || entry == "RIGHT";
      case 3: return entry == "TOP";
      case 4: return entry == "TOP" || entry == "RIGHT";
      case 5: return entry == "TOP" || entry == "LEFT";
      case 6: return entry == "LEFT" || entry == "RIGHT";
      case 7: return entry == "TOP" || entry == "RIGHT";
      case 8: return entry == "LEFT" || entry == "RIGHT";
      case 9: return entry == "TOP" || entry == "LEFT";
      case 10: return entry == "TOP";
      case 11: return entry == "TOP";
      case 12: return entry == "RIGHT";
      case 13: return entry == "LEFT";
    }
    return false;
  }

  void rotate(int x, int y, String dir) {
    var type = map[y][x];

    switch (type) {
      case 0: break;
      case 1: break;
      case 2: type = 3; break;
      case 3: type = 2; break;
      case 4: type = 5; break;
      case 5: type = 4; break;
      case 6: type = dir == "LEFT" ? 9 : 7; break;
      case 7: type = dir == "LEFT" ? 6 : 8; break;
      case 8: type = dir == "LEFT" ? 7 : 9; break;
      case 9: type = dir == "LEFT" ? 8 : 6; break;
      case 10: type = dir == "LEFT" ? 13 : 11; break;
      case 11: type = dir == "LEFT" ? 10 : 12; break;
      case 12: type = dir == "LEFT" ? 11 : 13; break;
      case 13: type = dir == "LEFT" ? 12 : 10; break;
    }

    map[y][x] = type;
  }
}

class Position extends Point<int> {
  String entry;

  Position(int x, int y, this.entry) : super(x, y);
}

class Command extends Point<int> {
  String dir;

  Command(int x, int y, this.dir) : super(x, y);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();

List<List<int>> readMap(int n) =>
    new List<List<int>>.generate(n, (_) => readLine());

List<Position> readRocks(int n) =>
    new List<Position>.generate(n, (_) => readPosition());

Position readPosition() {
  var line = readString().split(" ");
  return new Position(int.parse(line[0]), int.parse(line[1]), line[2]);
}
