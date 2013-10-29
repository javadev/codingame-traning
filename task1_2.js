// Temperatures
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = readline();

if (n == undefined || n == 0) {
  print("0");
} else {

var values = readline().split(" ");
var valuesNums = [];
for (var i = 0; i < n; i++) {
    valuesNums[i] = parseInt(values[i]);
}
var valuesZerroSize = [];
for (var i = 0; i < n; i++) {
    valuesZerroSize[i] = Math.abs(parseInt(values[i]));
}
var minValue = valuesZerroSize[0];
for (var i = 1; i < n; i++) {
  if (valuesZerroSize[i] < minValue) {
      minValue = valuesZerroSize[i];
  }
}
var valueFound = false;
for (var i = 0; i < n; i++) {
    if (valuesNums[i] == minValue) {
        print(minValue);
        valueFound = true;
        break;
    }
}
if (!valueFound) {
    print(-minValue);
}
}