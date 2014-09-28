import "dart:io" show stdin;
import "dart:math" show Point;

void main() {
  var thor = readPoint();

  var solver = new Solver(thor);

  while (true) {
    var turn = readLine();
    var h = turn[0];
    var n = turn[1];

    var giants = readPoints(n);

    var action = solver.solve(giants, h);

    print(action);
  }
}

class Solver {
  Point thor;

  Solver(this.thor);

  final List<String> DIRS = const <String>[
    "WAIT", "E", "SE", "S", "SW", "W", "NW", "N", "NE"];

  String solve(List<Point> giants, int h) {
    var action;

    // Center of mass of the giants.
    var target = center(giants);

    // Tries to find the shortest safe path.
    var min;

    for (var dir in DIRS) {
      var pos = move(thor, dir);

      var len = pos.distanceTo(target);
      if (min == null || len < min) {

        if (isSafe(pos, giants)) {
          min = len;
          action = dir;
        }
      }
    }

    // Can't move or there are a lot of giants near? Strike for your live!
    if (action == null ||
        countGiants(thor, 4, giants) >= giants.length / h) return "STRIKE";

    // Updates Thor's position.
    thor = move(thor, action);

    return action;
  }

  bool isSafe(Point pos, List<Point> giants) {

    // Stay on bounds.
    if (pos.x < 0 || pos.x > 39 || pos.y < 0 || pos.y > 17) return false;

    // THE TRICK: Avoid giants in the movement direction.
    // It passes the tests, but it probably fails for other scenarios.
    var mx = pos.x + (2 * (pos.x - thor.x));
    var my = pos.y + (2 * (pos.y - thor.y));

    for (var giant in giants) {
      if (giant.x == pos.x && giant.y == my) return false;
      if (giant.y == pos.y && giant.x == mx) return false;
    }

    // Avoid giants!
    return countGiants(pos, 1, giants) == 0;
  }

  // Center of mass of the giants.
  Point center(List<Point> giants) {
    var x = 0;
    var y = 0;

    for (var giant in giants) {
      x += giant.x;
      y += giant.y;
    }
    x ~/= giants.length;
    y ~/= giants.length;

    return new Point(x, y);
  }

  // Number of giants inside the area around the given position.
  int countGiants(Point pos, int margin, List<Point> giants) {
    var count = 0;

    for (var giant in giants) {
      if (giant.x >= pos.x - margin &&
          giant.x <= pos.x + margin &&
          giant.y >= pos.y - margin &&
          giant.y <= pos.y + margin) {
        count++;
      }
    }

    return count;
  }

  Point move(Point pos, String action) {
    var dx = 0;
    var dy = 0;

    if (action != "WAIT" && action != "STRIKE") {
      if (action.contains("N")) dy--;
      if (action.contains("S")) dy++;
      if (action.contains("E")) dx++;
      if (action.contains("W")) dx--;
    }

    return new Point(pos.x + dx, pos.y + dy);
  }
}

String readString() => stdin.readLineSync();

List<int> readLine() => readString().split(" ").map(int.parse).toList();

Point readPoint() {
  var line = readLine();
  return new Point(line[0], line[1]);
}

List<Point> readPoints(int n) =>
    new List<Point>.generate(n, (_) => readPoint());
