import "dart:io" show stdin;
import "dart:math" show PI, cos, sqrt;

void main() {
  var longitude = readRadians();
  var latitude = readRadians();

  var n = readInt();
  var defibrillators = readDefibrillators(n);

  var solution;
  var min;

  for (var defibrillator in defibrillators) {

    var x = (longitude - defibrillator.longitude)
        * cos((defibrillator.latitude + latitude) / 2);
    var y = latitude - defibrillator.latitude;
    var d = sqrt(x * x + y * y) * 6371;

    if (min == null || d < min) {
      min = d;

      solution = defibrillator.name;
    }
  }

  print(solution);
}

class Defibrillator {
  final String name;
  final double longitude;
  final double latitude;

  const Defibrillator(this.name, this.longitude, this.latitude);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

double readRadians() => toRadians(readString());

List<Defibrillator> readDefibrillators(int n)
  => new List<Defibrillator>.generate(n, (_) => readDefibrillator());

Defibrillator readDefibrillator() {
  var line = readString().split(";");

  return new Defibrillator(line[1], toRadians(line[4]), toRadians(line[5]));
}

double toRadians(String value)
  => double.parse(value.replaceFirst(",", ".")) * (PI / 180.0);
