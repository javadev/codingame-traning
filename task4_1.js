// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = parseInt(readline());
var q = parseInt(readline());
var mimes = [];
var mimeMap = {};
for (var i=0;i<n;i++) {
    mimes[i] = readline();
    mimeMap[mimes[i].replace(/(.*)\s(.*)$/i, "$1").toLowerCase()] = mimes[i].replace(/.*\s(.*)$/i, "$1")
}
var files = [];
for (var i=0;i<q;i++) {
    files[i] = readline();
}

for (var file in files) {
    var extention = files[file].indexOf(".") != -1 ? files[file].replace(/.*\.([0-9a-z]+)$/i, "$1") : "";
    if (mimeMap[extention.toLowerCase()] != null) {
        print(mimeMap[extention.toLowerCase()]);
    } else {
        print("UNKNOWN");
    }
}
