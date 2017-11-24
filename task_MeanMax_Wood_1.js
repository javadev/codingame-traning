function log(item){
    printErr(JSON.stringify(item, null, ' '));
}

function sort(arr,item, asc = true){
    return arr.slice().sort(function(a, b) {
              var compareA = a[item];
              var compareB = b[item];   
              if(asc){
                if (compareA < compareB) {
                    return -1;
                }
                if (compareA > compareB) {
                    return 1;
                } 
              } else {
                if (compareA > compareB) {
                    return -1;
                }
                if (compareA < compareB) {
                    return 1;
                } 
              }
                             
              return 0;
    });     
}

function getVectorLength(x,y,xx,yy){
        var dx = x-xx;
        var dy = y-yy;
        return Math.sqrt((dx*dx)+(dy*dy));
    }   
    
function checkCircleCollision(x1,y1,r1,x2,y2,r2){
    let distanceBetween = getVectorLength(x1,y1,x2,y2);
    let combinedRadius = r1+r2;    
    if(distanceBetween<=combinedRadius){
        return true;
    }
    return false;    
}

function getPlayer() {
    var player = {};
    player.x = null;
    player.y= null;
    player.px = null;
    player.py = null;  
    player.useSkill = false;
    player.getMove=function(){            
        if((player.x === null || player.y===null) && !player.useSkill){
            print('WAIT');
        } else if((player.x !== null || player.y!==null) && player.useSkill){
            print("SKILL"+ " "+player.x + " " + player.y + " "+ "SKILL");           
        }
        else {     
           print(player.x + " " + player.y+ " " + "300"); 
        }
    };
    player.reset =function(){
        player.x = null;
        player.y = null;
        player.useSkill = false;
    };
    return player;
}

var game = {
    myScore: 0,
    enemyScore1:0,
    enemyScore2:0,
    myRage:0,
    enemyRage1:0,
    enemyRage2: 0,
    unitCount: 0,
    units: [],
    wrecks: [],
    reapers:[],
    destroyers: [],
    tankers:[],
    doofers:[],
    tarPools:[],
    oilPools:[],
    playerDestroyer:{},
    playerReaper:{},  
    playerDoofer:{},  
    updateInput : function(){
        this.myScore = parseInt(readline());       
        this.enemyScore1 = parseInt(readline());
        this.enemyScore2 = parseInt(readline());
        this.myRage = parseInt(readline());
        this.enemyRage1 = parseInt(readline());
        this.enemyRage2 = parseInt(readline());
        this.unitCount = parseInt(readline());
        this.updateCollections();
        this.playerDoofer.reset();
        this.playerReaper.reset();
        this.playerDestroyer.reset();
        for (var i = 0; i < this.unitCount; i++) {
            var inputs = readline().split(' ');
            var unit = {};
            unit.unitId = parseInt(inputs[0]);          
            unit.unitType = parseInt(inputs[1]);
            unit.playerId = parseInt(inputs[2]);
            unit.mass = parseFloat(inputs[3]);
            unit.radius = parseInt(inputs[4]);
            unit.x = parseInt(inputs[5]);
            unit.y = parseInt(inputs[6]);
            unit.vx = parseInt(inputs[7]);
            unit.vy = parseInt(inputs[8]);
            unit.extra = parseInt(inputs[9]);
            unit.extra2 = parseInt(inputs[10]);
            this.units.push(unit);
            this.updateUnits(unit);           
        }
    },
    assignReaper:function(){
        let playerReaper = this.reapers.find(reaper=>{return reaper.playerId ===0});
        this.playerReaper.px = playerReaper.x;
        this.playerReaper.py = playerReaper.y;
        
        let wrecks = sort(this.wrecks.map(wreck=>{
            return {
                wreck:wreck,
                distance:getVectorLength(playerReaper.x,playerReaper.y,wreck.x,wreck.y)
                };
            }),"distance");          
        if(wrecks.length>0){
            let wreck = wrecks.find(wreck=>{
                    let unit = this.units.filter(unit=>{
                        return (
                        unit.playerId !== 0 && (unit.unitType === 6));
                        }).find(units=>{                          
                           return  checkCircleCollision(
                               wreck.wreck.x,wreck.wreck.y,wreck.wreck.radius,
                               units.x,units.y,units.radius);
                        });                       
                    if(unit!==undefined){
                        return false;
                    }                    
                    return true;
                });           
            if(wreck!==undefined){
                this.playerReaper.x = wreck.wreck.x-playerReaper.vx;
                this.playerReaper.y = wreck.wreck.y-playerReaper.vy;
            }            
        }
        
    },
    assignDestroyer:function(){
        let playerDestroyer = this.destroyers.find(destroyer=>{return destroyer.playerId ===0}); 
        let playerReaper = this.reapers.find(reaper=>{return reaper.playerId ===0});
        let tankers = sort(this.tankers.map(tanker=>{
            return {
                tanker:tanker,
                water:tanker.extra
                };
        }),"water",false);        
        let wrecks = sort(this.wrecks.map(wreck=>{
            return {
                wreck:wreck,
                distance:getVectorLength(playerDestroyer.x,playerDestroyer.y,wreck.x,wreck.y)
                };
            }),"distance").filter(wreck =>{return wreck.distance<2000});
       
        if(this.myRage > 60 && wrecks.length>0){
            let wreck = wrecks.find(wreck=>{
                    if(checkCircleCollision(wreck.wreck.x,wreck.wreck.y,1000,
                        playerReaper.x,playerReaper.y,playerReaper.radius)){
                        return false;
                    }
                    let unit = this.units.filter(unit=>{
                        return (unit.playerId !== 0 && (unit.unitType === 0));
                        }).find(units=>{                          
                           return  checkCircleCollision(
                               wreck.wreck.x,wreck.wreck.y,1000,
                               units.x,units.y,units.radius);
                        });                       
                    if(unit!==undefined){
                        return true;
                    }                    
                    return false;
                });           
            if(wreck!==undefined){
                this.playerDestroyer.x =  wreck.wreck.x;
                this.playerDestroyer.y = wreck.wreck.y;
                this.playerDestroyer.useSkill = true;
                this.myRage-=60;
            } else {
                this.playerDestroyer.x = tankers[0].tanker.x-playerDestroyer.vx;
                this.playerDestroyer.y = tankers[0].tanker.y-playerDestroyer.vy;
            }
        } else if(tankers.length>0){
            this.playerDestroyer.x = tankers[0].tanker.x-playerDestroyer.vx;
            this.playerDestroyer.y = tankers[0].tanker.y-playerDestroyer.vy;
        }
    },
    assignDoofer: function(){
        let playerDoofer = this.doofers.find(doofer=>{return doofer.playerId ===0});
        let playerReaper = this.reapers.find(reaper=>{return reaper.playerId ===0});
        let enemyReapers = sort(this.reapers.filter(reaper=>{return reaper.playerId !==0}).map(reaper=>{
            return {
                reaper:reaper,
                distance:getVectorLength(playerDoofer.x,playerDoofer.y,reaper.x,reaper.y)
                };
        }),"distance");    
        
        let wrecks = sort(this.wrecks.map(wreck=>{
            return {
                wreck:wreck,
                distance:getVectorLength(playerDoofer.x,playerDoofer.y,wreck.x,wreck.y)
                };
            }),"distance").filter(wreck =>{return wreck.distance<2000});
            
         if(this.myRage > 30 && wrecks.length>0){
            let wreck = wrecks.find(wreck=>{
                    if(checkCircleCollision(wreck.wreck.x,wreck.wreck.y,1000,
                        playerReaper.x,playerReaper.y,playerReaper.radius)){
                        return false;
                    }
                    let unit = this.units.filter(unit=>{
                        return (unit.playerId !== 0 && (unit.unitType === 0));
                        }).find(units=>{                          
                           return  checkCircleCollision(
                               wreck.wreck.x,wreck.wreck.y,wreck.wreck.radius,
                               units.x,units.y,units.radius);
                        });                       
                    if(unit!==undefined){
                        return true;
                    }                    
                    return false;
                });           
            if(wreck!==undefined){
                this.playerDoofer.x =  wreck.wreck.x;
                this.playerDoofer.y = wreck.wreck.y;
                this.playerDoofer.useSkill = true;
                this.myRage-=30;
            } else {
                this.playerDoofer.x = enemyReapers[0].reaper.x-playerDoofer.vx;
                this.playerDoofer.y = enemyReapers[0].reaper.y-playerDoofer.vy;
            }
        } else {
            this.playerDoofer.x = enemyReapers[0].reaper.x-playerDoofer.vx;
            this.playerDoofer.y = enemyReapers[0].reaper.y-playerDoofer.vy;
        } 
    },
    assignMoves:function(){      
       this.assignReaper();    
       this.assignDestroyer(); 
       this.assignDoofer();
    },
    makeMoves:function(){
        this.playerReaper.getMove();      
        this.playerDestroyer.getMove();         
        this.playerDoofer.getMove();    
    },
    updateUnits:function(unit){
        switch(unit.unitType){
            case 4:{ this.wrecks.push(unit);break;}
            case 1:{ this.destroyers.push(unit); break;}
            case 3:{ this.tankers.push(unit);break;}
            case 0:{ this.reapers.push(unit);break;}
            case 2:{ this.doofers.push(unit);break;}
            case 5:{ this.tarPools.push(unit);break;}
            case 6:{ this.oilPools.push(unit);break;}
        }
    },
    updateCollections:function(){
        this.wrecks = [];
        this.reapers = [];
        this.tankers = [];
        this.destroyers = [];
        this.doofers = [];
        this.tarPools = [];
        this.oilPools = [];
        this.units = [];
    }    
};

game.playerDestroyer = getPlayer();
game.playerReaper = getPlayer();
game.playerDoofer = getPlayer();

// game loop
while (true) { 
    game.updateInput();
    game.assignMoves();
    game.makeMoves();
}
