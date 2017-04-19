class Map {

    constructor() {
        this.barrels = [];
        this.mines = [];
        this.canonballs = [];
        this.ourShips = [];
        this.enemiesShips = [];
    }

    addShip(ship,enemy) {
        ship.print('addShip');
        if(enemy == 0) {
            this.enemiesShips.push(ship);
        }
        else {
            this.ourShips.push(ship);
        }
    }

    addBarrel(barrel) {
        this.barrels.push(barrel);
    }

    addMine(mine) {
        //mine.print(' mine ');
        this.mines.push(mine);
    }

    isMine(point) {
        let isMine = false;
        for(let i = 0; i < this.mines.length ; i++){
            //this.mines[i].print(' mine ');
            if((point.x == this.mines[i].x) && (point.y == this.mines[i].y)) {
                isMine = true;
            }
        }
        //point.print(' isMine ' + isMine);
        return isMine;
    }

    isBarrel(point) {
        let isBarrel = false
        for(let i = 0; i < this.barrels.length ; i++){
            if((point.x == this.barrels[i].position.x) && (point.y == this.barrels[i].position.y)) {
                isBarrel = true;
            }
        }
        return isBarrel;
    }
}

class Cube {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    directions() {
        let dir0 = new Cube(+1, -1,  0);
        let dir1 = new Cube(+1,  0, -1);
        let dir2 = new Cube( 0, +1, -1);
        let dir3 = new Cube(-1, +1,  0);
        let dir4 = new Cube(-1,  0, +1);
        let dir5 = new Cube( 0, -1, +1);
        return [dir0,dir1,dir2,dir3,dir4,dir5];
    }
    distance(cube) {
        return(Math.max(Math.abs(this.x - cube.x),Math.abs(this.y - cube.y),Math.abs(this.z - cube.z)));
    }

    rotateLeft(center){
        let vector = new Cube(this.x - center.x,this.y - center.y,this.z - center.z);
        let rotatedVector = new Cube(-vector.y,-vector.z,-vector.x);
        let rotatedPoint = new Cube(center.x + rotatedVector.x,center.y + rotatedVector.y,center.z + rotatedVector.z);
        return rotatedPoint;
    }

    rotateRight(center){
        let vector = new Cube(this.x - center.x,this.y - center.y,this.z - center.z);
        let rotatedVector = new Cube(-vector.z,-vector.x,-vector.y);
        let rotatedPoint = new Cube(center.x + rotatedVector.x,center.y + rotatedVector.y,center.z + rotatedVector.z);
        return rotatedPoint;
    }

    cubeToOffset() {
        let x = this.x + (this.z - this.z%2)/2;
        let y = this.z;
        let point = new Point(x,y);
        return point;
    }

    cube_direction(direction) {
        return this.directions[direction];
    }

    cube_neighbor(point, direction) {
        return new Cube(point.x, point.y, this.cube_direction(direction));
    }
}

class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.evenLine = (y%2 == 0);
    }

    neighbor(direction) {
        let dir = (this.evenLine) ? this.directions(this.evenLine)[direction] : this.directions(this.evenLine)[direction];
        let neighbor = new Point(this.x + dir.x, this.y + dir.y);
        return neighbor;
    }

    neighbors(){
        let neighbors = [];
        for(let dir = 0; dir < 6; dir++) {
            this.neighbor(dir).print(' neighbor ' + dir);
            neighbors.push(this.neighbor(dir));
        }
        return neighbors;
    }

    directions(evenLine){
        if(evenLine) {
            let dir0 = new Point(1,0);
            let dir1 = new Point(0,-1);
            let dir2 = new Point(-1,-1);
            let dir3 = new Point(-1,0);
            let dir4 = new Point(-1,1);
            let dir5 = new Point(0,1);
            return [dir0,dir1,dir2,dir3,dir4,dir5];
        }
        else {
            let dir0 = new Point(1,0);
            let dir1 = new Point(1,-1);
            let dir2 = new Point(0,-1);
            let dir3 = new Point(-1,0);
            let dir4 = new Point(0,1);
            let dir5 = new Point(1,1);
            return [dir0,dir1,dir2,dir3,dir4,dir5];
        }
    }
    distance(point) {
        let thisCube = this.offsetToCube();
        let otherCube = point.offsetToCube();
        return thisCube.distance(otherCube);
    }

    offsetToCube() {
        let x = this.x - (this.y -this.y%2)/2;
        let z = this.y;
        let y = -x-z;
        let cube = new Cube(x,y,z);
        return cube;
    }

    rotateLeft(center){
        let thisCube = this.offsetToCube();
        let centerCube = center.offsetToCube();
        let rotatedCube = thisCube.rotateLeft(centerCube);
        return rotatedCube.cubeToOffset();
    }

    rotateRight(center){
        let thisCube = this.offsetToCube();
        let centerCube = center.offsetToCube();
        let rotatedCube = thisCube.rotateRight(centerCube);
        return rotatedCube.cubeToOffset();
    }

    nextPoint(orientation,speed) {
        let newPoint = new Point(0,0);
        switch (orientation) {
            case 0:
                newPoint.x = Math.min(22,this.x + speed);
                newPoint.y = this.y;
                break;
            case 1:
                newPoint.x = (this.evenLine) ? this.x : Math.min(22,this.x + speed);
                newPoint.y = Math.max(0,this.y - speed);
                break;
            case 2:
                newPoint.x = (this.evenLine) ? Math.max(0,this.x - speed) : this.x;
                newPoint.y = Math.max(0,this.y - speed);
                break;
            case 3:
                newPoint.x = Math.max(0,this.x - speed);
                newPoint.y = this.y;
                break;
            case 4:
                newPoint.x = (this.evenLine) ? Math.max(0,this.x - speed) : this.x;
                newPoint.y = Math.min(26,this.y + speed);
                break;
            case 5:
                newPoint.x = (this.evenLine) ? this.x : Math.min(22,this.x + speed);
                newPoint.y = Math.min(26,this.y + speed);
                break;
        }
        //newPoint.print('nextPoint : ');
        return newPoint;
    }

    print(name) {
        printErr('Point ' + name + '(' + this.x + ',' + this.y + ')');
    }
}

class Line {
    constructor(firstPoint,lastPoint) {
        //firstPoint.print('firstPoint : ');
        //lastPoint.print('lastPoint : ');
        this.firstPoint = firstPoint;
        this.lastPoint = lastPoint;
        this.orientation = 0;
        this.setOrientation();
        this.length = 0;
        this.setLength();
    }

    setOrientation() {
        //printErr('orientation' + this.orientation);
        if(this.firstPoint.evenLine) {
            if ((this.lastPoint.x > this.firstPoint.x) && (this.lastPoint.y == this.firstPoint.y)) { this.orientation = 0; }
            if ((this.lastPoint.x == this.firstPoint.x) && (this.lastPoint.y < this.firstPoint.y)) { this.orientation = 1; }
            if ((this.lastPoint.x < this.firstPoint.x) && (this.lastPoint.y < this.firstPoint.y)) { this.orientation = 2; }
            if ((this.lastPoint.x < this.firstPoint.x) && (this.lastPoint.y == this.firstPoint.y)) { this.orientation = 3; }
            if ((this.lastPoint.x < this.firstPoint.x) && (this.lastPoint.y > this.firstPoint.y)) { this.orientation = 4; }
            if ((this.lastPoint.x == this.firstPoint.x) && (this.lastPoint.y > this.firstPoint.y)) { this.orientation = 5; }
        }
        else {
            if ((this.lastPoint.x > this.firstPoint.x) && (this.lastPoint.y == this.firstPoint.y)) { this.orientation = 0; }
            if ((this.lastPoint.x > this.firstPoint.x) && (this.lastPoint.y < this.firstPoint.y)) { this.orientation = 1; }
            if ((this.lastPoint.x == this.firstPoint.x) && (this.lastPoint.y < this.firstPoint.y)) { this.orientation = 2; }
            if ((this.lastPoint.x < this.firstPoint.x) && (this.lastPoint.y == this.firstPoint.y)) { this.orientation = 3; }
            if ((this.lastPoint.x == this.firstPoint.x) && (this.lastPoint.y > this.firstPoint.y)) { this.orientation = 4; }
            if ((this.lastPoint.x > this.firstPoint.x) && (this.lastPoint.y > this.firstPoint.y)) { this.orientation = 5; }
        }
        //printErr('orientation' + this.orientation);
    }

    setLength(){
        this.length = Math.abs(this.firstPoint.x- this.lastPoint.x) + Math.abs(this.firstPoint.y- this.lastPoint.y) + 1;
    }

    print(name){
        printErr(' Line ' + name + ' : (' + this.firstPoint.x + ',' + this.firstPoint.y + ') => ' +
            '(' + this.lastPoint.x + ',' + this.lastPoint.y + ') orientation ' + this.orientation + ' length ' + this.length);
    }
}

class Barrel {
    constructor(position, units) {
        this.position = position;
        this.units = units;
        this.closest = null;
    }

    print(title) {
        printErr('Barrel ' + title + ' : (' + this.position.x + ',' + this.position.y + ') ' + this.units + ' units');
    }
}

class Ship {
    constructor(position,orientation,speed,stock,is_enemy) {
        this.position = position;
        this.orientation = orientation;
        this.speed = speed;
        this.stock = stock;
        this.is_enemy = (is_enemy == 0);
        this.prow = this.position.neighbor(orientation);
        this.stern = this.position.neighbor((orientation + 3)%6);
        this.area = [this.stern,this.position,this.prow];
    }

    target(map) {
        let enemyActualPosition = this.closest(map.enemiesShips).position;
        let orientation = this.closest(map.enemiesShips).orientation;
        let speed = this.closest(map.enemiesShips).speed;
        let enemyFuturePosition = enemyActualPosition.nextPoint(orientation,speed);
        enemyFuturePosition = enemyFuturePosition.nextPoint(orientation,speed);
        enemyFuturePosition = enemyFuturePosition.nextPoint(orientation,speed);
        //let distEnemy = dist(this.position,enemyActualPosition);
        return enemyFuturePosition;
    }

    nextEnableAreas() {

    }

    turnLeft() {

    }

    turnRight() {

    }

    moveToClosestBarrel(map) {
        let neighborsCenterBoat = this.position.neighbors();
        this.prow.print(' prow ');
        this.prow.rotateLeft(this.position).print(' prow.rotateLeft ');
        if(map.barrels.length > 0) {
            let closestBarrel = this.closest(map.barrels);
            closestBarrel.print(' closestBarrel ');
            this.doTravel(this.nextLine(closestBarrel),map);
        }
    }

    fire(map) {
        print('FIRE ' + this.target(map).x + ' ' + this.target(map).y);
    }

    avoidMine(goal) {
        goal.print(' goal ');
        let newOrientation = 0;
        if(this.position.x < goal.x && this.position.y <= goal.y) { newOrientation = (this.orientation + 5)%6 }
        if(this.position.x < goal.x && this.position.y > goal.y) { newOrientation = (this.orientation + 1)%6 }
        if(this.position.x > goal.x && this.position.y <= goal.y) { newOrientation = (this.orientation + 1)%6 }
        if(this.position.x > goal.x && this.position.y > goal.y) { newOrientation = (this.orientation + 5)%6 }
        printErr('newOrientation : ' + newOrientation);
        let newPoint = this.prow.nextPoint(newOrientation,1);
        this.move(newPoint);
    }

    doTravel(line,map) {

        line.print(' our line ');
        let move = line.lastPoint;
        let closestEnemy = this.closest(map.enemiesShips);
        //printErr('distance closestEnemy :' + this.position.distance(closestEnemy.position));
        if(this.position.distance(closestEnemy.position) < 3) {
            printErr('TOO CLOSE ! FIRE :' + this.orientation);
            this.fire(map);
        }
        if(this.speed >0){
            this.prow.print(' prow ');
            let nextPointProw = this.prow.nextPoint(this.orientation,2);
            nextPointProw.print('nextPoint prow : ');
            if(map.isMine(nextPointProw)) {
                printErr('MINE !!!');
                this.avoidMine(this.closest(map.barrels).position);
            }
            else {
                this.closest(map.barrels).position.print(' closest barrel ');
                let distClosestBarrel = dist(this.prow,this.closest(map.barrels).position);
                printErr('distClosestBarrel ' + distClosestBarrel);
                if (line.length <= 2) {// the ship will arrive to destination with his actual speed, we need to turn
                    printErr('change orientation');

                    this.closest(map.barrels).position.print(' pos next barrel : ');
                    if (line.lastPoint.x == this.closest(map.barrels).position.x && line.lastPoint.y == this.closest(map.barrels).position.y) { //we are on the barrel
                        map.barrels.splice(0, 1); // the barrel disappears
                    }
                    if(map.barrels.length > 0) {
                        this.closest(map.barrels).position.print(' pos next barrel : ');
                        this.move(this.closest(map.barrels).position);
                    }
                }
                else {
                    printErr('fire orientation this :' + this.orientation + ' line ' + line.orientation);
                    //this.fire(map);
                    if (this.orientation == line.orientation) { // we have enough time to fire
                        printErr('fire :' + this.orientation);
                        this.fire(map);
                    }
                    else {
                        printErr('not enough time to fire :');
                        this.move(this.closest(map.barrels).position);
                    }
                }
            }
        }
        else {
            printErr('speed 0 : move to closest barrel ');
            this.move(this.closest(map.barrels).position);
        }
    }

    move(point) {
        print('MOVE ' + point.x + ' ' + point.y);
    }

    nextLine(barrel) {
        let distX = Math.abs(barrel.position.x - this.position.x);
        let distY = Math.abs(barrel.position.y - this.position.y);
        //printErr('distX : ' + distX);
        //printErr('distY : ' + distY);
        let line = new Line(this.position,this.position);
        if(distX > distY) { // we begin by the shortest line
            line.lastPoint = new Point(barrel.position.x,this.position.y);
        }
        else {
            line.lastPoint = new Point(barrel.position.x,this.position.y);
        }
        line.lastPoint.print(' last point ');
        line.setOrientation();
        line.setLength();
        //line.print(' line ');
        return line;
    }

    closest(arrayEntities) {
        var minDist = 100;
        var closest = false;
        //printErr('closest arrayEntities length : ' + arrayEntities.length);
        for(var i = 0; i< arrayEntities.length; i++) {
            let distBarrel = dist(this.position,arrayEntities[i].position);
            if(distBarrel < minDist) {
                closest = arrayEntities[i];
                minDist = distBarrel;
            }
            //printErr('closest distBarrel : ' + distBarrel + ' / minDist : ' + minDist);
        }
        //closest.print('closest');
        return closest;
    }

    print(title){
        printErr('Ship ' + title + ' : (' + this.position.x + ',' + this.position.y + ') Enemy :' + this.is_enemy + ' Speed ' + this.speed + ' orientation ' + this.orientation + ' stock ' + this.stock);
    }
}

// game loop
while (true) {
    var myShipCount = parseInt(readline()); // the number of remaining ships
    var entityCount = parseInt(readline()); // the number of entities (e.g. ships, mines or cannonballs)
    var map = new Map();
    for (var i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        var entityId = parseInt(inputs[0]);
        var entityType = inputs[1];
        var x = parseInt(inputs[2]);
        var y = parseInt(inputs[3]);
        var arg1 = parseInt(inputs[4]);
        var arg2 = parseInt(inputs[5]);
        var arg3 = parseInt(inputs[6]);
        var arg4 = parseInt(inputs[7]);
        let position = new Point(x,y);
        switch (entityType) {
            case "SHIP":
                let boat = new Ship(position,arg1,arg2,arg3,arg4);
                map.addShip(boat,arg4);
                break;
            case "BARREL":
                let barrel = new Barrel(position,arg1);
                map.addBarrel(barrel);
                break;
            case "MINE":
                let mine = new Point(x,y);
                map.addMine(mine);
                break;
        }
    }
    //printErr('mines.length' + map.mines.length);
    for (let i = 0; i < map.ourShips.length; i++) {
        let ship = map.ourShips[i];
        ship.moveToClosestBarrel(map);
    }
}

function dist(a,b) {
    let distX = Math.abs(a.x - b.x);
    let distY = Math.abs(a.y - b.y);
    let dist = distX + distY;
    //printErr('dist : ' + dist);
    return dist;
}
