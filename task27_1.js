// Mars Lander, Question 2/3
// Recommended time to find a solution: 120:00
// A new set of five more complex tests awaits you.
// Do not hesitate to click on "Previous question" to copy your code and paste it back in the editor of this new level.

// Warning: this time there is more than one test. So before submitting your final code use the "Test script" window on the bottom right hand corner of the screen to switch between tests by changing the value of the "test" variable (1, 2, 3, 4, or 5).

// The input/output/constraints are the same as for the previous question. Click here to view the full set of instructions again.

// Read init information from standard input, if any

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
