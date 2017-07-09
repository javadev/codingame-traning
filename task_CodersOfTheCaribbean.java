import java.util.*;
import java.io.*;
import java.math.*;
import java.lang.*;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Point {
    int x;
    int y;
    
    public Point() {
        this.x = 0;
        this.y = 0;
    }
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public String toString() {
        return "pos: ( " + x + ", " + y + " )";
    }
    public double distance(Point p) {
        double dist = Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
        return Math.abs(dist);
    }
    public static Point futurePos(Point pos, int dir, int speed) {
        Point p = new Point();
        switch(dir) {
            case 0:
                p.x = pos.x;
                p.y = pos.y + speed;
                break;
            case 1:
                p.x = pos.x + speed;
                p.y = pos.y - speed;
                break;
            case 2:
                p.x = pos.x - speed;
                p.y = pos.y - speed;
                break;
            case 3:
                p.x = pos.x - speed;
                p.y = pos.y;
                break;
            case 4:
                p.x = pos.x - speed;
                p.y = pos.y + speed;
                break;
            case 5:
                p.x = pos.x + speed;
                p.y = pos.y + speed;
                break;
            default:
                break;
        }
        return p;
    }
}

abstract class Entity {
    int id;
    Point pos;
     
    public Entity() {
        this.id = 0;
        this.pos = new Point();
    }
    public Entity(int id, int x, int y) {
        this.id = id;
        this.pos = new Point(x, y);
    }
     
    public String toString() {
        return "ENTITY [ id: " + id + ", " + pos.toString() + " ]";
    }
    public double distance(Entity e) {
        return this.pos.distance(e.pos);
    }
}
class Ship extends Entity {
    int rotation;
    int speed;
    int rumStock;
    int target;
     
    public Ship() {
        super();
        this.rotation = 0;
        this.speed = 0;
        this.rumStock = 0;
        this.target = -1;
    }
    public Ship(int id, int x, int y, int arg1, int arg2, int arg3) {
        super(id, x, y);
        this.rotation = arg1;
        this.speed = arg2;
        this.rumStock = arg3;
        this.target = -1;
    }
     
    public String toString() {
        return "SHIP [ id: " + id + ", " + pos.toString() +
            ", rot: " + rotation + ", speed: " + speed +
            ", rumStock: " + rumStock + " ]";
    }
    public Entity closest(ArrayList<? extends Entity> arr) {
        Entity e = null;
        double minDist = 100;
        for (int i = 0; i < arr.size(); i++) {
            double temp = this.distance(arr.get(i));
            if (temp < minDist) {
                e = arr.get(i);
            }
        }
        return e;
    }
    public Ship closestShip(ArrayList<Ship> arr) {
        Ship e = null;
        double minDist = 100;
        for (int i = 0; i < arr.size(); i++) {
            double temp = this.distance(arr.get(i));
            if (temp < minDist) {
                e = arr.get(i);
            }
        }
        return e;
    }
    public Barrel closestBarrel(ArrayList<Barrel> arr) {
        Barrel e = null;
        double minDist = 100;
        for (int i = 0; i < arr.size(); i++) {
            double temp = this.distance(arr.get(i));
            if (temp < minDist) {
                e = arr.get(i);
            }
        }
        return e;
    }
    
    public String moveToBarrel(ArrayList<Barrel> arr, ArrayList<Ship> ships) {
        String ret = null;
        if (arr.size() > 0) {
            Barrel barrel = closestBarrel(arr);
            boolean targetted = false;
            for(int i = 0; i < ships.size(); i++) {
                if (ships.get(i).id != id && ships.get(i).target == barrel.id)
                    targetted = true;
            }
            if (barrel != null && targetted == false) {
                target = barrel.id;
                ret = move(barrel.pos.x, barrel.pos.y);
            } else {
                ArrayList<Barrel> l = arr;
                l.remove(barrel);
                ret = moveToBarrel(l, ships);
            }
        }
        return ret;
    }
    public String avoid(ArrayList<? extends Entity> arr) {
        String ret = null;
        if (arr.size() > 0) {
            Entity c = closest(arr);
            if (c != null) {
                double dist = distance(c);
                if (dist <= 2) {
                    if (pos.x >= 15) {
                        switch(rotation) {
                            case 0:
                                ret = move(pos.x - 2, pos.y);
                                break;
                            case 1:
                                ret = move(pos.x - 2, pos.y + 2);
                                break;
                            case 2:
                                ret = move(pos.x - 2, pos.y + 2);
                                break;
                            case 3:
                                ret = move(pos.x - 2, pos.y);
                                break;
                            case 4:
                                ret = move(pos.x - 2, pos.y - 2);
                                break;
                            case 5:
                                ret = move(pos.x + 2, pos.y - 2);
                                break;
                            default:
                                break;
                        }
                    }else if (pos.y <= 5) {
                        switch(rotation) {
                            case 0:
                                ret = move(pos.x + 2, pos.y + 2);
                                break;
                            case 1:
                                ret = move(pos.x + 2, pos.y + 2);
                                break;
                            case 2:
                                ret = move(pos.x - 2,pos.y + 2);
                                break;
                            case 3:
                                ret = move(pos.x - 2, pos.y);
                                break;
                            case 4:
                                ret = move(pos.x - 2, pos.y + 2);
                                break;
                            case 5:
                                ret = move(pos.x + 2, pos.y + 2);
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch(rotation) {
                            case 0:
                                ret = move(pos.x + 2, pos.y);
                                break;
                            case 1:
                                ret = move(pos.x + 2, pos.y + 1);
                                break;
                            case 2:
                                ret = move(pos.x - 2, pos.y + 1);
                                break;
                            case 3:
                                ret = move(pos.x - 2, pos.y);
                                break;
                            case 4:
                                ret = move(pos.x - 2, pos.y - 1);
                                break;
                            case 5:
                                ret = move(pos.x + 2, pos.y - 1);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        return ret;
    }
    public String move(int x, int y) {
        return "MOVE " + x + " " + y;
    }
    public String fire(Point p) {
        return "FIRE " + p.x + " " + p.y;
    }
    
    public String fireCannonball(ArrayList<Ship> arr) {
        String ret = null;
        if (arr.size() > 0) {
            Ship foe = closestShip(arr);
            if (foe != null) {
            double dist = distance(foe);
                if (dist < 6 && foe.rumStock < rumStock) {
                    ret = fire(Point.futurePos(foe.pos, foe.rotation, foe.speed));
                }
            }
        }
        return ret;
    }
    public String dropMine(int cd) {
        String ret = null;
        if (cd == 0) {
            ret = "MINE";
        }
        return ret;
    }
}

class Barrel extends Entity {
    int amount;
     
    public Barrel() {
        super();
        this.amount = 0;
    }
    public Barrel(int id, int x, int y, int arg1) {
        super(id, x, y);
        this.amount = arg1;
    }
     
    public String toString() {
        return "BARREL [ id: " + id + ", " + pos.toString() + 
            ", amount: " + amount + " ]";
    }
}

class Mine extends Entity {
    public Mine() {
        super();
    }
    public Mine(int id, int x, int y) {
        super(id, x, y);
    }
    
    public String toString() {
        return "MINE [ id: " + id + ", pos: " + pos.toString() + " ]";
    }
}

class Cannonball extends Entity {
    int fromShip;
    int turns;
    
    public Cannonball() {
        super();
        this.fromShip = 0;
        this.turns = 0;
    }
    public Cannonball(int id, int x, int y, int entId, int t) {
        super(id, x, y);
        this.fromShip = entId;
        this.turns = t;
    }
    
    public String toString() {
        return "CANNONBALL [ id: " + id + ", pos: " + pos.toString() + 
            ", shot from:" + fromShip + ", turns left: " + turns + " ]";
    }
}
 
class Player {
    static ArrayList<Ship> myShips;
    static ArrayList<Ship> enemyShips;
    static ArrayList<Barrel> barrels;
    static ArrayList<Mine> mines;
    static ArrayList<Cannonball> cannonballs;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        
        int fireCooldown = 0;
        int mineCooldown = 0;
        
        // game loop
        while (true) {
            fireCooldown--;
            if (fireCooldown < 0) fireCooldown = 0;
            mineCooldown--;
            if (mineCooldown < 0) mineCooldown = 0;
            
            myShips = new ArrayList<Ship>();
            enemyShips = new ArrayList<Ship>();
            barrels = new ArrayList<Barrel>();
            mines = new ArrayList<Mine>();
            cannonballs = new ArrayList<Cannonball>();
            
            int myShipCount = in.nextInt(); // the number of remaining ships
            int entityCount = in.nextInt(); // the number of entities (e.g. ships, mines or cannonballs)
            for (int i = 0; i < entityCount; i++) {
                int entityId = in.nextInt();
                String entityType = in.next();
                int x = in.nextInt();
                int y = in.nextInt();
                int arg1 = in.nextInt();
                int arg2 = in.nextInt();
                int arg3 = in.nextInt();
                int arg4 = in.nextInt();
                
                switch(entityType) {
                    case "SHIP":
                        if (arg4 == 1)
                            myShips.add(new Ship(entityId, x, y, arg1, arg2, arg3));
                        else
                            enemyShips.add(new Ship(entityId, x, y, arg1, arg2, arg3));
                        break;
                    case "BARREL":
                        barrels.add(new Barrel(entityId, x, y, arg1));
                        break;
                    case "MINE":
                        mines.add(new Mine(entityId, x, y));
                        break;
                    case "CANNONBALL":
                        cannonballs.add(new Cannonball(entityId, x, y, arg1, arg2));
                }
            }
            
            for (int i = 0; i < myShipCount; i++) {
                Ship s = myShips.get(i);
                String move;
                String avoidmines = s.avoid(mines);
                String avoidcannon = s.avoid(cannonballs);
                String shoot = s.fireCannonball(enemyShips);
                String fetchBarrel = s.moveToBarrel(barrels, myShips);
                String mine = s.dropMine(mineCooldown);
                String errOut = "";
                
                if (shoot != null && fireCooldown == 0) {
                    move = shoot;
                    fireCooldown = 1;
                    errOut = "Shoot";
                } else if (avoidmines != null) {
                    move = avoidmines;
                    errOut = "Avoid mine";
                } else if (avoidcannon != null) {
                    move = avoidcannon;
                    errOut = "Avoid cannonball";
                } else if (fetchBarrel != null) {
                    move = fetchBarrel;
                    errOut = "Fetch barrel";
                } else if (mine != null) {
                    move = mine;
                    errOut = "Dropping a mine";
                }else {
                    if(s.speed > 0) {
                        move = s.move(s.pos.x, s.pos.y);
                    } else {
                        move = "WAIT";
                    }
                }
            
                System.err.println(errOut);
                System.out.println(move);
            }
        }
    }
    
    public static void printArr(ArrayList<? extends Entity> arr) {
        for(int i = 0; i < arr.size(); i++) {
            System.err.println(arr.get(i).toString());
        }
    }
}