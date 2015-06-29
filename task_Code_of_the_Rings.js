// Code of the Rings
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var magicPhrase = readline();

// Write an action using print()
// To debug: printErr('Debug messages...');
printErr(magicPhrase);
var field = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var i1 = 0;
var i2 = 0;
var result = '';
var direction = '>';
for (var index in magicPhrase) {
    var char = magicPhrase[index];
printErr('!' + char + '! |' + field[i1 == 0 ? field.length - 1: i1 - 1] + '| |' + field[i2 == field.length - 1?0:i2+1] + '|');
    if (countLeft(i1) < countRight(i2)) {
        if (direction != '<') {
            result += '<';
            direction = '<';
        }
        while (field[i1] != char) {
// printErr('=' + i1 + '=');
            result += '-';
            if (i1 == 0) {
                i1 = field.length;
            }
            i1 -= 1;
        }
    } else {
        if (direction != '>') {
            result += '>';
            direction = '>';
        }
        while (field[i2] != char) {
// printErr('=' + i2 + '=');
            result += '+';
            if (i2 == field.length - 1) {
                i2 = -1;
            }
            i2 += 1;
        }
    }
    result += '.';
}
print(result);
function countLeft(i1) {
        var count = 0;
        while (field[i1] != char) {
// printErr('=' + i1 + '=');
            if (i1 == 0) {
                i1 = field.length;
            }
            i1 -= 1;
            count += 1;
        }
        // printErr('left - ' + count);
        return count;
}
function countRight(i2) {
        var count = 0;
        while (field[i2] != char) {
// printErr('=' + i2 + '=');
            if (i2 == field.length - 1) {
                i2 = -1;
            }
            i2 += 1;
            count += 1;
        }
        return count;
}
