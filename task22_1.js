// Snakes and ladders
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var n = readline();

var s = -1;
var e = -1;
var str = [];

for (var i = 0; i < n; i++) {
    var a = readline();
    if(a == 'S') {
        s = i;
    }
    if(a == 'E') {
        e = i;
    }
        
    str.push(a);
}


var q = [];
var visit = [];
q.push([s,0]);

var fin = 'impossible';

while(q.length) {
    var z = q[0][0];
    var step = q[0][1];
   
    q.splice(0,1);
    
    if(visit[z]) {
        continue;
    }
    
    //print(z+" "+step);
    visit[z] = true;
    
    if(str[z]=='E') {
        fin = step;
    } else if(str[z]=='R') {
         for(var i=1;i<=6;i++) {
            if(z + i <= str.length) {
                q.push([z+i,step+1]);
            }
        }       
    } else if(str[z]=='S') {
        for(var i=1;i<=6;i++) {
            if(z + i <= str.length) {
                q.push([z+i,step+1]);
            }
        }
    } else {
        var x = parseInt(str[z]);
        q.push([z+x,step+1]);
    }
}

print(fin);
