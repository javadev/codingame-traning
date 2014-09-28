import "dart:io" show stdin;

void main() {
  var init = readIntLine();
  var width = init[0];
  var height = init[1];
  var grid = readGrid(height);
  var exit = readInt();

  while (true) {
    var turn = readLine();
    var x = int.parse(turn[0]);
    var y = int.parse(turn[1]);
    var entry = turn[2];

    switch (grid[y][x]) {
      case 0: break;
      case 1: y++; break;
      case 2: if (entry == "LEFT") x++; else x--; break;
      case 3: y++; break;
      case 4: if (entry == "TOP") x--; else y++; break;
      case 5: if (entry == "TOP") x++; else y++; break;
      case 6: if (entry == "LEFT") x++; else x--; break;
      case 7: y++; break;
      case 8: y++; break;
      case 9: y++; break;
      case 10: x--; break;
      case 11: x++; break;
      case 12: y++; break;
      case 13: y++; break;
    }

    print("$x $y");
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());

List readLine() => readString().split(" ");

List<int> readIntLine() => readString().split(" ").map(int.parse).toList();

List<List<int>> readGrid(int h)
  => new List<List<int>>.generate(h, (_) => readIntLine());
