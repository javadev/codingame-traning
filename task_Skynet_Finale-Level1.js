// SKYNET FINALE - LEVEL 1

var l = readline().split(" ");
var nbN = parseInt(l[0]);
var nbL = parseInt(l[1]);
var nbP = parseInt(l[2]);
//var links = [];
var noeuds = [];
var pass = [];

for(var i=0; i<nbN; i++){
    noeuds.push([]);
}


for(var i=0; i<nbL; i++){
    var l = readline().split(" ");
    noeuds[parseInt(l[0])].push(parseInt(l[1]))
    noeuds[parseInt(l[1])].push(parseInt(l[0]))
}

for(var i=0; i<nbP; i++){
    var l = parseInt(readline());
    pass.push(l)
}

//printErr(noeuds.join(";"));

while (1) {
    var skynet = parseInt(readline());
    var pn = passNear(skynet)
    printErr("pn:"+pn)
    if(pn !== false) cutL(skynet, pn)
    else cutPass();
}

function passNear(n){
    var links = noeuds[n]
    printErr(n, links)
    for(i in links){
        
        if(pass.indexOf(links[i]) != -1) return links[i];
    }
    return false;
}

function cutPass(){
    for(var i in pass){
        if(noeuds[pass[i]].length > 0){
            cutL(pass[i], noeuds[pass[i]][0]);
            return;
        } 
    }
}

function cutL(a, b){
    remove(noeuds[a], b);
    remove(noeuds[b], a);
    printErr('print:'+Math.min(a, b)+' '+Math.max(a, b));
    print(Math.min(a, b)+' '+Math.max(a, b));
}

function remove(tab, elt){ tab.splice(tab.indexOf(elt), 1) }

