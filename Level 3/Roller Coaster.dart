import "dart:io" show stdin;
import "dart:typed_data" show Int32List;

void main() {
  var line = readLine();
  var places = line[0];
  var rides = line[1];
  var n = line[2];

  var groups = readGroups(n);

  var solution = solve(places, rides, groups);

  print(solution);
}

int solve(int places, int rides, List<int> groups) {
  var queued = groups.fold(0, (prev, element) => prev + element);

  // Optimization: Happy day? All the people rides it again and again!
  return queued <= places ? rides * queued : analyze(places, rides, groups);
}

int analyze(int places, int rides, List<int> groups) {
  var dirhams = 0;

  var pos = 0;
  var persons = 0;

  while (true) {

    // Welcome aboard!
    persons += groups[pos++];

    if (persons >= places) {

      // Rejects the last group if necessary.
      if (persons > places) persons -= groups[--pos];

      // Takes the money.
      dirhams += persons;

      // Done?
      if (--rides == 0) break;

      // Starts again.
      persons = 0;
    }

    // Avoid going out of bounds.
    if (pos == groups.length) pos = 0;
  }

  return dirhams;
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readLine() => readString().split(" ").map(int.parse).toList();

List<int> readGroups(int n) {
  var list = new Int32List(n); // Optimized list implementation.

  for (var i = 0; i < n; ++i) {
    list[i] = int.parse(stdin.readLineSync());
  }

  return list;
}
