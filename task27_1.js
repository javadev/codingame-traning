// Mars Lander, Question 2/3
// Recommended time to find a solution: 120:00
// A new set of five more complex tests awaits you.
// Do not hesitate to click on "Previous question" to copy your code and paste it back in the editor of this new level.

// Warning: this time there is more than one test. So before submitting your final code use the "Test script" window on the bottom right hand corner of the screen to switch between tests by changing the value of the "test" variable (1, 2, 3, 4, or 5).

// The input/output/constraints are the same as for the previous question. Click here to view the full set of instructions again.

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
    //printErr(n);
    var data = n.split(" ");
    printErr(data);
    printErr(targetX - data[0]);
    var angle = 0;
    if (data[0] < targetX - 500) {
        angle = -20;
    } else if (data[0] > targetX + 500) {
        angle = 20;
    } else {
        angle = data[2] > 90 ? 90 : (data[2] < -90 ? -90 : data[2]);
    }
    if (data[2] > 40) {
        angle = 10;
    } else if (data[2] < -40) {
        angle = -10;
    }
    if (data[2] > 60) {
        angle = 30;
    } else if (data[2] < -60) {
        angle = -30;
    }
    if (data[2] < -15 && targetX - data[0] > 200) {
        angle = -80
    } else if (data[2] > 15 && targetX - data[0] < -200) {
        angle = 80
    }

     if (data[1] < targetY + 500) {
        print('0 4');
    } else if (data[3] < -22 || data[2] < -50) { // data[1] < 2300 || 
        print(angle + ' 4');
    } else {
    print(angle + ' 3');
    }
}
