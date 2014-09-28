import "dart:io" show stdin;

void main() {
  var n = readInt();
  var values = readLine();

  var solution = 0;

  var max = n == 0 ? 0 : values.first;

  for (var value in values.skip(1)) {
    var dif = value - max;

    if (dif < solution) solution = dif;

    if (value > max) max = value;
  }

  print(solution);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();
