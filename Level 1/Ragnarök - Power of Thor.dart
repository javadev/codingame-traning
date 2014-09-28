import "dart:io" show stdin;

void main() {
  var line = readLine();
  var lx = line[0];
  var ly = line[1];
  var tx = line[2];
  var ty = line[3];

  while (true) {
    var energy = readInt();

    var action = "";

    if (ty > ly) { ty --; action += "N"; }
    if (ty < ly) { ty ++; action += "S"; }
    if (tx > lx) { tx --; action += "W"; }
    if (tx < lx) { tx ++; action += "E"; }

    print("$action");
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();
