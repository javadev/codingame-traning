import "dart:io" show stdin;

void main() {

  while (true) {
    var line = readLine();
    var x = line[0];
    var y = line[1];

    var mountains = readMountains(8);

    // Finds the tallest mountain.
    var max;
    var pos;

    for (var i = 0; i < mountains.length; ++i) {

      if (max == null || mountains[i] > max) {
        max = mountains[i];
        pos = i;
      }
    }

    // Fires if the ship is over the tallest mountain.
    print(x == pos ? "FIRE" : "HOLD");
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();

List<int> readMountains(int n) => new List<int>.generate(n, (_) => readInt());
