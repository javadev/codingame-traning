import "dart:io" show stdin;

void main() {
  var n = readInt();
  var q = readInt();

  var types = readTypes(n);
  var files = readFiles(q);

  for (var file in files) {
    var type;

    // Extracts the file extension and finds its MIME type.
    var pos = file.lastIndexOf(".");
    if (pos != -1) {
      type = types[file.substring(pos + 1)];
    }

    print(type == null ? "UNKNOWN" : type);
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

Map<String, String> readTypes(int n) {
  var types = new Map<String, String>();

  for (var i = 0; i < n; ++i) {
    var line = readString().split(" ");

    types[line[0].toLowerCase()] = line[1];
  }

  return types;
}

List<String> readFiles(int n)
  => new List<String>.generate(n, (_) => readString().toLowerCase());
