import "dart:io" show stdin;

void main() {
  var n = readInt();

  print(n == 0 ? 0 : closestZero());
}

int closestZero() {
  var min = 5526 + 1;

  var temperatures = readTemperatures();
  for (var temperature in temperatures) {

    var dif = temperature.abs() - min.abs();
    if ((dif < 0) || ((dif == 0) && (temperature > 0))) {
      min = temperature;
    }
  }

  return min;
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readTemperatures() => readString().split(" ").map(int.parse).toList();
