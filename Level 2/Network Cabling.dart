import "dart:io" show stdin;

void main() {
  var n = readInt();
  var points = readList(n);

  // Calculates the horizontal min/max coordinates
  // and the vertical average coordinate.
  var xmin, xmax, yavg = 0;

  for (var point in points) {
    if (xmin == null || point[0] < xmin) xmin = point[0];
    if (xmax == null || point[0] > xmax) xmax = point[0];

    yavg += point[1];
  }

  yavg ~/= n;

  // Now calculates the minimum length from each building
  // to the vertical average coordinate.
  var dmin, ycenter;

  for (var point in points) {
    var dist = (point[1] - yavg).abs();

    if (dmin == null || dist < dmin) {
      dmin = dist;

      ycenter = point[1];
    }
  }

  // Length of the shared horizontal cable.
  var solution = xmax - xmin;

  // Length of each dedicated vertical cable.
  for (var point in points) {
    solution += (point[1] - ycenter).abs();
  }

  print(solution);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();

List<List<int>> readList(int n) => new List.generate(n, (_) => readLine());
