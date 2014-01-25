// Mars Lander, Question 1/3
// Recommended time to find a solution: 60:00

/*
For a landing to be successful, the ship must:

    land on flat ground
    land in a vertical position (tilt angle = 0°)
    vertical speed must be limited ( ? 40m/s in absolute value)
    horizontal speed must be limited ( ? 20m/s in absolute value)

For each test, there is a unique area of flat ground on the surface of Mars which is at least 1000 meters wide.

The program must first read the initialization data from standard input. Then, within an infinite loop, the program must read the data from the standard input related to Mars Lander's current state and provide to the standard output the instructions to move Mars Lander.

For this first level, Mars Lander will go through a single test.

Tests and validators are only slightly different. A program that passes a given test will pass the corresponding validator without any problem.
 
INITILIZATION INPUT:
Line 1: the number N of points used to draw the surface of Mars.
N following lines: a couple of integers X Y providing the coordinates of a ground point. By linking all the points together in a sequential fashion, you form the surface of Mars which is composed of several segments. For the first point, X = 0 and for the last point, X = 6999
 
INPUT FOR ONE GAME TURN:
A single line with 7 integers: X Y HS VS F R P

    (X, Y) are the coordinates of Mars Lander (in meters).
    HS et VS are the horizontal and vertical speed of Mars Lander (in m/s). These can be negative depending on the direction of Mars Lander.
    F is the remaining quantity of fuel in liters. When there is no more fuel, the power of thrusters falls to zero.
    R is the angle of rotation of Mars Lander expressed in degrees.
    P is the thrust power of the landing ship.

 
OUTPUT FOR ONE GAME TURN:
A single line with 2 integers: R P

    R is the desired rotation angle for Mars Lander. Please note that for each turn the actual value of the angle is limited to the value of the previous turn +/- 15°.
    P is the desired thrust power. 0 = off. 4 = maximum power. Please note that for each turn the value of the actual power is limited to the value of the previous turn +/- 1.
*/

// Read init information from standard input, if any

var n =readline();
var coords = [];
for (i = 0; i < n; i++) {
    coords.push(readline().split(" "));
}
var linear = [];
for (i = 1; i < n; i++) {
    if (coords[i - 1][1] == coords[i][1]) {
        linear.push(coords[i - 1]);
        linear.push(coords[i]);
    }
}
// printErr(linear);
// printErr(linear[0][1]);
var targetY = parseInt(linear[0][1]);
// printErr(linear[0][0]);
var targetX1 = parseInt(linear[0][0]);
// printErr(linear[1][0]);
var targetX2 = parseInt(linear[1][0]);
var targetX = targetX1 + (targetX2 - targetX1) / 2;
// var init = readline().split(" ");
// print(init);
printErr(targetX);
printErr(targetY);
while (1) {
    // Read information from standard input
    var n = readline();

    // Compute logic here

    // printErr("Debug messages...");

    // Write action to standard output
    printErr(n);
    var data = n.split(" ");
    printErr(data);
    if (data[1] < 1500) {
        print('0 4');
    } else {
    print('0 3');
    }
}
