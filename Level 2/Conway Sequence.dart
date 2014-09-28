import "dart:io" show stdin;

void main() {
  var root = readInt();
  var lines = readInt();

  var solution = [root];

  for (var i = 1; i < lines; ++i) {
    solution = next(solution);
  }

  print(solution.join(" "));
}

List<int> next(List<int> sequence) {
  var result = new List<int>();

  var count = 1;
  var old = sequence[0];

  for (var symbol in sequence.skip(1)) {

    // Counts symbols.
    if (symbol == old) {
      count++;

      // Adds the counter to the result and restarts it.
    } else {
      result..add(count)..add(old);

      count = 1;
      old = symbol;
    }
  }

  // Takes care of trailing symbols.
  if (count != 0) result..add(count)..add(old);

  return result;
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());
