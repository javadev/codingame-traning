import "dart:io" show stdin;

void main() {
  var n = readInt();
  var phones = readPhones(n);

  var solution = 0;

  // Brute force approach: Compares each telephone with the rest.
  for (var i = 0; i < n; ++i) {
    var min = phones[i].length;

    for (var j = 0; j < i; ++j) {
      var count = compare(phones[i], phones[j]);

      if (count < min) {
        min = count;
      }
    }

    solution += min;
  }

  print(solution);
}

int compare(String a, String b) {
  var count = 0;

  var len = a.length < b.length ? a.length : b.length;

  while (count < len && a[count] == b[count]) {
    count++;
  }

  return a.length - count;
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<String> readPhones(int n)
  => new List<String>.generate(n, (_) => readString());
