import "dart:io" show stdin;
import "dart:convert" show ASCII;

void main() {
  var message = readString();

  message = ASCII.encode(message);

  var solution = "";
  var count = 0;
  var old;

  for (var char in message) {

    // Extracts one bit each time.
    for (var i = 6; i >= 0; --i) {
      var bit = (char >> i) & 0x01;

      // Detects bit value changes.
      if (old != null && old != bit) {
        solution = code(solution, old, count);
        count = 0;
      }

      count++;
      old = bit;
    }
  }

  // Takes care of trailing bits.
  solution = code(solution, old, count);

  print(solution);
}

String code(String solution, int bit, int count) {

  if (solution != "") solution += " ";

  solution += bit == 0 ? "00 " : "0 ";

  for (var i = 0; i < count; ++i) {
    solution += "0";
  }

  return solution;
}

String readString() => stdin.readLineSync();
