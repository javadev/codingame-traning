// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = parseInt(readline());

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var numbers = [];
for (var i = 0; i < n; i++) {
    numbers.push(readline());
}
var hash = {};
for (var i=0;i<n;i++) {
    var number = numbers[i];
    for (var j=1;j<=number.length;j++) {
        hash[number.substring(0, j)] = 1;
    }
}
// print(numbers);
// print(JSON.stringify(hash));
print(Object.size(hash));
