// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = readline();

var data = [];
for (var i = 0; i < n; i++) {
    data[i] = parseInt(readline());
}
data.sort(function(a,b){return b-a});
var diffData = []
for (var i = 1; i < n; i++) {
  diffData.push(data[i-1] - data[i]);
}
diffData.sort(function(a,b){return a-b});
//print(data)
print(diffData[0])
//print(Math.abs(data[0] - data[1]));
