import "dart:io" show stdin;
import "dart:math" show Point;

void main() {
  var n = readInt();
  var mars = readPoints(n);

  while (true) {
    var ship = readShip();

    var rotation = 0;
    var power = ship.p;

    // Just stop the ship.
    if (ship.vs < -30) power = 4;

    print("$rotation $power");
  }
}

class Ship {
  final int x;
  final int y;
  final int hs;
  final int vs;
  final int f;
  final int r;
  final int p;

  const Ship(this.x, this.y, this.hs, this.vs, this.f, this.r, this.p);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();

Ship readShip() {
  var line = readLine();

  return new Ship(line[0], line[1], line[2], line[3], line[4], line[5], line[6]);
}

List<Point> readPoints(int n)
  => new List<Point>.generate(n, (_) => readPoint());

Point readPoint() {
  var line = readLine();

  return new Point(line[0], line[1]);
}
