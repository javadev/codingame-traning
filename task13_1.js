// Scrabble
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = readline();
var words = [];
for(var i=0; i<n; i++) {
    var word = readline();
    words[i] = word;
}

var score = { 'e' : 1, 'a':1, 'i' : 1, 'o' : 1, 'n':1, 'r':1, 't':1, 'l':1, 's':1, 'u':1,
      'd' : 2, 'g' : 2,
      'b':3, 'c':3, 'm' :3, 'p' : 3,
      'f':4, 'h':4, 'v':4, 'w':4, 'y': 4,
      'k': 5,
      'j':8, 'x': 8,
      'q' : 10, 'z':10};

var abc = readline();
var max = 0, maxi = -1;
for (var i = 0; i < n; i++) {
    var valid = true;
    var sc = 0;
    
    var a = [];
    for(var j=0; j<abc.length; j++) {
        var t = abc.charCodeAt(j);
        a[t] = a[t] ? a[t] + 1 : 1;
    }
    
    for(var j=0; j < words[i].length; j++) {
        sc += score[words[i][j]];
        if (!a[words[i].charCodeAt(j)]) {
            valid = false;
            break;
        } else {
            a[words[i].charCodeAt(j)]--;
        }
    }
    if(valid && max < sc) {
        max = sc;
        maxi = i;
    }
}
print(words[maxi]);
