// Read inputs from Standard Input
// Write outputs to Standard Output

//    int n = int.parse(stdin.readLineSync());
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var $length = parseInt(readline());
var $height = parseInt(readline());
var $char = //"MANHATTAN";
readline();
var $table = [];
for (var i = 0; i < $height; i+= 1) {
  $table[i] = readline();
  //print($table[i]);
}

var tableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";

var lines = [];
for (var j=0;j<$char.length;j++) {
for (var i = 0; i < $height; i+= 1) {
    var tableIndex = tableChars.indexOf($char.substring(j, j+1).toUpperCase());
    if (tableIndex == -1) {
        tableIndex = tableChars.length - 1;
    };
    if (lines[i] == undefined) {
        lines[i] = "";
    }
    lines[i] += $table[i].substring(tableIndex * $length, tableIndex * $length + $length);
}
}
for (var i = 0; i < $height; i+= 1) {
print(lines[i]);
}
