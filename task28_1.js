// Mars Lander, Question 3/3
// Recommended time to find a solution: 120:00
// There are two tests to pass in this ultimate level and if you succeed you will make history. As before you can copy/paste your code from the previous question.

// Click here to view the full set of instructions again.

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
