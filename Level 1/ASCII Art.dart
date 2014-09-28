import "dart:io" show stdin;
import "dart:convert" show ASCII;

const int A = 65;
const int Z = 90;
const int QUESTION_MARK = 91;

void main() {
  var width = readInt();
  var height = readInt();
  var text = readString();
  var ascii = readAscii(height);

  text = ASCII.encode(text.toUpperCase());

  // Rows.
  for (var i = 0; i < height; ++i) {
    var output = "";

    // Characters
    for (var char in text) {

      if (char < A || char > Z) {
        char = QUESTION_MARK;
      }

      var pos = (char - A) * width;

      // Columns.
      for (var j = 0; j < width; ++j) {
        output += ascii[i][pos + j];
      }
    }

    print(output);
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<String> readAscii(int n)
  => new List<String>.generate(n, (_) => readString());
