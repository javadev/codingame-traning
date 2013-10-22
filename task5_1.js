// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var longitude = parseFloat(readline().replace(",","."));
var latitude = parseFloat(readline().replace(",","."));
var n = parseInt(readline());
var addresses = [];
for (var i=0;i<n;i++) {
    addresses[i] = readline();
}

var minDistance = 10000000,
  minName = "";
for (var i=0;i<n;i++){
    var distance = calcDistance(longitude, parseFloat(addresses[i].split(";")[4].replace(",",".")),latitude,parseFloat(addresses[i].split(";")[5].replace(",","."))); 
//print(addresses[i].split(";")[1] + " - " + distance);
    if (distance < minDistance) {
        minDistance = distance;
        minName = addresses[i].split(";")[1];
    }
}
print(minName);


function calcDistance(longA, longB, latiA, latiB) {
//print(longA + " " + longB + " " + latiA + " " + latiB);
    x = (longB - longA) * Math.cos((latiA+latiB)/2);
    y = latiB - latiA;
    var result = Math.sqrt(x*x + y*y) * 6371;
    return result;
}
