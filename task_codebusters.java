import java.util.*;
import java.io.*;
import java.math.*;

/**
 * Send your busters out into the fog to trap ghosts and bring them home!
 **/
class Player {
    
    public static int MAP_WIDTH = 16001;
    public static int MAP_HEIGHT = 9001;
    public static int MAX_BUST_RANGE = 1760;
    public static int MIN_BUST_RANGE = 900;
    public static int MAX_RELEASE_RANGE = 1600;

    private static Entity base;
    
    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int bustersPerPlayer = in.nextInt(); // the amount of busters you control
        int ghostCount = in.nextInt(); // the amount of ghosts on the map
        int myTeamId = in.nextInt(); // if this is 0, your base is on the top left of the map, if it is one, on the bottom right
        
        base = new Entity(myTeamId);
        
        System.err.println("bustersPerPlayer : " + bustersPerPlayer);
        System.err.println("ghostCount : " + ghostCount);
        System.err.println("myTeamId : " + myTeamId);
        
        // game loop
        while (true) {
            int entities = in.nextInt(); // the number of busters and ghosts visible to you
            System.err.println("I can see " + entities + " entities");
            List<Entity> myBuster = new ArrayList<>();
            List<Entity> enBuster = new ArrayList<>();
            List<Entity> ghosts = new ArrayList<>();
            for (int i = 0; i < entities; i++) {
                int entityId = in.nextInt(); // buster id or ghost id
                int x = in.nextInt();
                int y = in.nextInt(); // position of this buster / ghost
                int entityType = in.nextInt(); // the team id if it is a buster, -1 if it is a ghost.
                int state = in.nextInt(); // For busters: 0=idle, 1=carrying a ghost.
                int value = in.nextInt(); // For busters: Ghost id being carried. For ghosts: number of busters attempting to trap this ghost.
                Entity e = new Entity(entityId, x, y, entityType, state, value);
                if (entityType != -1) {
                    if (entityType == myTeamId) myBuster.add(e);
                    else enBuster.add(e);                   
                } else ghosts.add(e);
            }
            System.err.println("myBuster size : " + myBuster.size());
            System.err.println("ennBuster size : " + enBuster.size());
            System.err.println("ghosts size : " + ghosts.size());
            for (int i = 0; i < bustersPerPlayer; i++) {
                Entity currentBuster = myBuster.get(i);
                Action action = getAction(currentBuster, ghosts);
                action.print();
            }
        }
    }

    private static Action getAction(Entity currentBuster, List<Entity> ghosts) {
        if (currentBuster.state == 0) {
            if (!ghosts.isEmpty()) {
                Entity closestGhost = getClosestGhost(currentBuster, ghosts);
                System.err.println("Closest ghost for buster : "
                        + currentBuster.id + " is ghost : " + closestGhost.id);
                Boolean isBustingPossible = isBustingPossible(currentBuster,
                        closestGhost);
                System.err.println("isBustPossible : " + isBustingPossible);
                if (isBustingPossible) {
                    return new Action("BUST", closestGhost.id);
                } else {
                    return new Action("MOVE", closestGhost.x, closestGhost.y);
                }
            } else {
                return discoverBase();
            }
        } else {
            // Buster with ghost need to return to base
            Boolean isReleasePossible = isRealeasePossible(currentBuster, base);
            if (isReleasePossible) {
                return new Action("RELEASE");
            } else {
                return new Action("MOVE", base.x, base.y);
            }
        }
    }

    private static Action discoverBase() {
        //Random direction for testing
        Random r = new Random();
        int x = r.nextInt(MAP_WIDTH - 0 + 1) + 0;
        int y = r.nextInt(MAP_HEIGHT - 0 + 1) + 0;
    
        return new Action("MOVE", x, y);
    }

    private static Entity getClosestGhost(Entity currentBuster, List<Entity> ghosts) {
        double minDist = Double.MAX_VALUE;
        Entity closestGhost = null; 
        for (Entity ghost : ghosts) {
            double distance = getDistance(currentBuster, ghost);
            System.err.println("Distance for buster : " + currentBuster.id + " and ghost : " + ghost.id);
            System.err.println("Distance ====> " + distance);
            if (distance < minDist) {
                closestGhost = ghost;
                minDist = distance;
            }
        }
        return closestGhost;
    }

    private static double getDistance(Entity a, Entity b) {
        double d = Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2);
        return Math.sqrt(d);
    }

    private static Boolean isBustingPossible(Entity currentBuster,
            Entity closestGhost) {
        double dist = getDistance(currentBuster, closestGhost);
        return (dist < MAX_BUST_RANGE && dist > MIN_BUST_RANGE);
    }
    
    private static Boolean isRealeasePossible(Entity currentBuster, Entity base) {
        double dist = getDistance(currentBuster, base);
        return dist < MAX_RELEASE_RANGE;
    }
    
}

class Entity {
    
    public int id;
    public int x;
    public int y;
    public int type;
    public int state;
    public int value;
    
    public Entity(int entityId, int x, int y, int entityType, int state,
            int value) {
        this.id = entityId;
        this.x = x;
        this.y = y;
        this.type = entityType;
        this.state = state;
        this.value = value;
    }

    public Entity(int id) {
        if (id == 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = 16000;
            this.y = 9000;          
        }
    }
}

class Action {
    
    public String name;
    public List<Integer> params = new ArrayList<>();
    
    public Action(String name) {
        this.name = name;
    }

    public Action(String name, int... params) {
        this.name = name;
        for (int param : params) {
            this.params.add(param);
        }
    }

    public void print() {
        System.out.print(this.name);
        for (int param : this.params) {
            System.out.print(" " + param);
        }
        System.out.print(System.getProperty("line.separator"));
    }
}
