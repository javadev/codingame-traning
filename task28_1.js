// Mars Lander, Question 3/3
// Recommended time to find a solution: 120:00
// There are two tests to pass in this ultimate level and if you succeed you will make history. As before you can copy/paste your code from the previous question.

// Click here to view the full set of instructions again.

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
    if (data[0] < targetX - 450) {
        angle = -10;
    } else if (data[0] > targetX + 450) {
        angle = 10;
    } else {
        angle = data[2] > 90 ? 90 : (data[2] < -90 ? -90 : parseInt(data[2] * 1.2));
    }
    if (data[2] > 40) {
        angle = 15;
    } else if (data[2] < -40) {
        angle = -15;
    }
    if (data[2] > 60) {
        angle = 30;
    } else if (data[2] < -60) {
        angle = -30;
    }
    if (data[2] < -15 && targetX - data[0] > 200) {
        angle = -75
    } else if (data[2] > 15 && targetX - data[0] < -200) {
        angle = 75
    }

     if (data[1] < targetY + 350) {
        print('0 4');
    } else if (data[3] < -22 || data[2] < -50) { // data[1] < 2300 || 
        print(angle + ' 4');
    } else {
    print(angle + ' 3');
    }
}
