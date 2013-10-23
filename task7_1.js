// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = parseInt(readline());
var data = readline().split(/\s+/);

var maxi = parseInt(data[0]);
var perte = 0;
for (var x = 1; x < n; x++) {
  if (maxi - parseInt(data[x]) > perte) {
    perte = maxi - parseInt(data[x]);
  }
  if (parseInt(data[x]) > maxi) {
    maxi = parseInt(data[x]);
  }
}
print(-perte);
