import 'dart:io';
import 'dart:math';

/**
 * The code below will read all the game information for you.
 * On each game turn, information will be available on the standard input, you will be sent:
 * -> the total number of visible enemies
 * -> for each enemy, its name and distance from you
 * The system will wait for you to write an enemy name on the standard output.
 * Once you have designated a target:
 * -> the cannon will shoot
 * -> the enemies will move
 * -> new info will be available for you to read on the standard input.
 **/
void main() {
    List inputs;

    // game loop
    while (true) {
        int count = int.parse(stdin.readLineSync()); // The number of current enemy ships within range
        var array = [];
        for (int i = 0; i < count; i++) {
            inputs = stdin.readLineSync().split(' ');
            String enemy = inputs[0]; // The name of this enemy
            int dist = int.parse(inputs[1]); // The distance to your cannon of this enemy
            array.add({'enemy': enemy, 'dist': dist});
        }
        array.sort((a,b) => a['dist'] - b['dist']);

        // Write an action using print()
        // To debug: stderr.writeln('Debug messages...');

        print(array[0]['enemy']); // The name of the most threatening enemy (HotDroid is just one example)
    }
}
