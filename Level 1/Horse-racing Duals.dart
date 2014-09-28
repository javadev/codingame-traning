import "dart:io" show stdin;

void main() {
  var n = readInt();
  var horses = readHorses(n);

  // THE TRICK: Sort the list!
  horses.sort();

  var old = horses[1];
  var min = old - horses[0];

  for (var horse in horses.skip(2)) {

    var dis = horse - old;

    if (dis < min) {
      min = dis;
    }

    old = horse;
  }

  print(min);
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List<int> readHorses(int n) => new List<int>.generate(n, (_) => readInt());
