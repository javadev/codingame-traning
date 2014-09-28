import "dart:io" show stdin;

void main() {
  var road = readInt();
  var gap = readInt();
  var landing = readInt();

  while (true) {
    var speed = readInt();
    var x = readInt();

    var command;

    // Jumps to avoid falling down.
    if (x == road - 1) command = "JUMP";

    // Decelerates to get the correct speed or stop the moto after jumping.
    else if (speed > gap + 1 || x >= road + gap) command = "SLOW";

    // Accelerates to reach the minimum speed to jump the gap.
    else if (speed < gap + 1) command = "SPEED";

    // Default command.
    else command = "WAIT";

    print(command);
  }
}

String readString() => stdin.readLineSync();

int readInt() => int.parse(readString());
