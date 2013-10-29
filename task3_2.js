// Chuck Norris
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = //"%";
readline();

//print(n);

//print(n.charCodeAt(0));

var binary = "";
for (var i=0; i < n.length; i++) {
  binary += "0000000".substring(0, 7 - n.charCodeAt(i).toString(2).length) + n.charCodeAt(i).toString(2); ;
}    
//print(binary);
var result = "";
var prevChar;
for (var i = 0; i < binary.length; i++) {
    if (binary.substring(i, i+1) == '1') {
        if (prevChar == '1') {
            result += '0';
        } else {
            if (prevChar == '0') {
                result += " ";      
            }
            result += "0 0";
        }
    } else {
        if (prevChar == '0') {
            result += '0';
        } else {
            if (prevChar == '1') {
                result += " ";      
            }
            result += "00 0";

        }
    }
    prevChar = binary.substring(i, i+1);
//    print(prevChar);
}    
print(result);
