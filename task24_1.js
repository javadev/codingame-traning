/*
In this episode, the TARDIS (Time And Relative Dimension In Space), which is Doctor Who's time machine and spacecraft, materializes in the year 4798 on Ood-Sphere, a planet inhabited by the Oods, a strange but highly advanced civilization.

The Oods aren't exactly eye-pleasing creatures: they have tentacles hanging from the lower part of their faces. Despite being ugly, they are very sensitive creatures who have no sense of individualism; they believe they "are one" and communicate through telepathy.

As a matter of fact, the Doctor lands in the middle of an Ood celebration. Having reached adulthood, one of the Oods is about to receive a very nice present from the rest of the community. The thing is, they all have different budgets to invest in this present. Of course, their unique wish is to find the fairest method that will determine the maximum budget that each Ood can afford. The Oods have been discussing this issue for days, and up until now, they have not managed to find a totally satisfactory solution.

So the Doctor decides to give a helping hand by creating a program. His idea is to check if the Oods have enough money to buy the present, and if so, to calculate how much each Ood should pay, according to their respective budget limit. Moreover, to facilitate the calculations, the Doctor wants each financial participation to be an integer of the local currency (nobody should give any cents). 

The Doctor has in hand the list of maximum budgets for each Ood.

The Doctor's aim is to share the cost very precisely. To respect the Oods democratic values and to select the best solution, the Doctor decides that:

    no Ood can pay more than his maximum budget
    the optimal solution is the one for which the highest contribution is minimal
    if there are several optimal solutions, then the best solution is the one for which the highest second contribution is minimal, and so on and so forth...

For example, the Oods wish to buy a gift that cost 100. The first Ood has a budget of 3, the second has a budget of 45 and the third has a budget of 100.
In that case:
Budget 	Solution
3 	3
45 	45
100 	52

Second example: they still wish to buy a gift that costs 100 but the second Ood has a budget of 100 this time.
In that case:
Budget 	Solution
3 	3
100 	48
100 	49
 

INPUT:
Line 1: the number N of participants
Line 2: the price C of the gift
N following lines: the list of budgets B of participants.

OUTPUT:

    If it is indeed possible to buy the present: N lines, each containing the contribution of a participant. The list is sorted in ascending order.
    Otherwise the word IMPOSSIBLE.

CONSTRAINTS:
0 < N ≤ 2000
0 ≤ C ≤ 1000000000
0 ≤ B ≤ 1000000000

EXAMPLES:
Input
3
100
20
20
40
Output
IMPOSSIBLE
 
 
Input
3
100
40
40
40
Output
33
33
34
 
 
Input
3
100
100
1
60
Output
1
49
50
 
Available RAM : 512MB
Timeout: 6 seconds

    The program has to read inputs from standard input
    The program has to write the solution to standard output
    The program must run in the test environment

Download the files provided in the test script:
Example 1: in1.txt out1.txt
Example 2: in2.txt out2.txt
Example 3: in3.txt out3.txt
Impossible: in4.txt out4.txt
Sort: in5.txt out5.txt
Budget Limit: in6.txt out6.txt
Several solutions budget: in7.txt out7.txt
Several solution fast: in8.txt out8.txt
Big random: in9.txt out9.txt
*/
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = parseInt(readline());
var c = parseInt(readline());
var b = [];

var sum = 0;
for (var i = 0; i < n; i++) {
    var v = parseInt(readline());
    b.push(v);
    sum += v;
}
if (sum < c) {
    print('IMPOSSIBLE');
} else {
    var sorted = b.sort(function(a,b){return a-b});
    var koef = c / sum;
    var sum2 = 0;
    var solution = [];
    var max = 0;
    for (var i = 0; i < n; i++) {
      var v = parseInt(sorted[i] * koef);
    //   print("v " + v);
    //   if (v == 0) {
    //       v = 1;
    //   }
      if (i == n - 1) {
          v = c - sum2;
      }
      solution.push(v);
      if (v > max) {
          max = v;
      }    
      sum2 += v;
    }
    for (var i = 0; i < n; i++) {
        print(solution[i]);
    }
}
