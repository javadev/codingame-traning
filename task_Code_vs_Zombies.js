/**
 * Save humans, destroy zombies!
 **/

var humanFound = false;
// game loop
while (true) {
    var inputs = readline().split(' ');
    var x = parseInt(inputs[0]);
    var y = parseInt(inputs[1]);
    var humanCount = parseInt(readline());
    var humans = [];
    for (var i = 0; i < humanCount; i++) {
        var inputs = readline().split(' ');
        var humanId = parseInt(inputs[0]);
        var humanX = parseInt(inputs[1]);
        var humanY = parseInt(inputs[2]);
        var newX = humanX;
        var newY = humanY;
        var newD = Math.sqrt((x - humanX) * (x - humanX) + (y - humanY) * (y - humanY)) * 6371;
       humans.push({
            humanId: humanId,
            humanX: humanX,
            humanY: humanY,
            newX: newX,
            newY: newY,
            newD: newD
        });
    }
    humans.sort(function(a, b) {
       return a.newD - b.newD; 
    });
    var zombieCount = parseInt(readline());
    var zombies = [];
    for (var i = 0; i < zombieCount; i++) {
        var inputs = readline().split(' ');
        var zombieId = parseInt(inputs[0]);
        var zombieX = parseInt(inputs[1]);
        var zombieY = parseInt(inputs[2]);
        var zombieXNext = parseInt(inputs[3]);
        var zombieYNext = parseInt(inputs[4]);
        // var newX = (manX - zombieXNext)
        //     * Math.cos((zombieYNext + manY) / 2);
        // var newY = (manY - zombieYNext)
        //     * Math.cos((zombieXNext + manX) / 2);
        var newX = zombieXNext;
        var newY = zombieYNext;
        var newD = Math.sqrt((x - zombieXNext) * (x - zombieXNext) + (y - zombieYNext) * (y - zombieYNext)) * 6371;

        zombies.push({
            zombieId: zombieId,
            zombieX: zombieX,
            zombieY: zombieY,
            zombieXNext: zombieXNext,
            zombieYNext: zombieYNext,
            newX: newX,
            newY: newY,
            newD: newD
        });
    }
    zombies.sort(function(a, b) {
       return a.newD - b.newD; 
    });
    for (var human of humans) {
        for (zombie of zombies) {
            // printErr('1 - ' + Math.abs(human.humanX - zombie.zombieXNext));
            // printErr('2 - ' + Math.abs(human.humanY - zombie.zombieYNext));
            if (Math.abs(human.humanX - zombie.zombieXNext) <= 100
            && Math.abs(human.humanY - zombie.zombieYNext) <= 100) {
                human.newD = 38226000 * 6371;
                continue;
            }
        }
    }
    humans.sort(function(a, b) {
       return a.newD - b.newD; 
    });

    // Write an action using print()
    // To debug: printErr('Debug messages...');
    // printErr('x y - ' + x +' ' + y);
    // printErr('zombieCount - ' + zombieCount);
    // printErr('zombies - ' + JSON.stringify(zombies));
    // printErr('humanCount - ' + humanCount);
    // printErr('humans - ' + JSON.stringify(humans));
    
    if (Math.abs(humans[0].newX - x) <= 100
        && Math.abs(humans[0].newY - y) <= 100) {
        humanFound = true;
    }
     if (humanFound && Math.abs(humans[0].newX - x) <= 500
        && Math.abs(humans[0].newY - y) <= 500) {
         //  && zombies[0].newD < humans[0].newD
         print(zombies[0].newX + ' ' + zombies[0].newY); // Your destination coordinates
     } else {
        print(humans[0].newX + ' ' + humans[0].newY); // Your destination coordinates
     }
}
