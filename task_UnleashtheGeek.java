import java.util.*;

class Player {

    enum Entity_Type {
        ALLY_ROBOT, ENEMY_ROBOT, RADAR, TRAP
    }
    enum Item_Type {
        NONE, RADAR, TRAP, ORE
    }

    private static int width, height;

    private static int radarCooldown;
    private static int trapCooldown;
    private static Robot[] robots = new Robot[5];
    private static Robot[] enemyRobots = new Robot[5];

    private static ArrayList<Case> oreRemaining = new ArrayList<>();

    private static Case[][] board;

    private static LinkedList<Case> radarPositions = new LinkedList<>();
    private static ArrayList<Case> trapPositions = new ArrayList<>();

    private static boolean firstTurn = true;

    private static boolean radarRequested = false;
    private static boolean trapRequested = false;

    private static int nbTurn = 0;

    private static Random rand = new Random();

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        width = in.nextInt();
        height = in.nextInt(); // size of the map

        fillRadarPositions();

        board = new Case[height][width];
        for (int i = 0 ; i < height ; i++) {
            for (int j = 0; j < width ; j++) {
                board[i][j] = new Case();
                board[i][j].x = j;
                board[i][j].y = i;
            }
        }

        // game loop
        while (true) {
            nbTurn++;
            int myScore = in.nextInt(); // Amount of ore delivered
            int opponentScore = in.nextInt();
            updateBoard(in);
            updateEntities(in);
            robotTurn();
        }
    }

    private static void updateBoard(Scanner in) {
        oreRemaining = new ArrayList<>();
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                String ore = in.next();
                board[i][j].ore = "?".equals(ore) ? -1 : Integer.parseInt(ore); // amount of ore or "?" if unknown
                if (in.nextInt() == 1 && !board[i][j].hole) {
                    board[i][j].hole = true;
                    board[i][j].turnHoleCreation = nbTurn;
                }
                for (int k = 0 ; k < board[i][j].ore ; k++) {
                    oreRemaining.add(new Case(board[i][j].x, board[i][j].y));
                }
            }
        }
    }

    private static void updateEntities(Scanner in) {
        int entityCount = in.nextInt(); // number of entities visible to you
        radarCooldown = in.nextInt(); // turns left until a new radar can be requested
        trapCooldown = in.nextInt(); // turns left until a new trap can be requested
//        trapPositions = new ArrayList<>();
        for (int i = 0 ; i < entityCount ; i++) {
            int id = in.nextInt(); // unique id of the entity
            int type = in.nextInt(); // 0 for your robot, 1 for other robot, 2 for radar, 3 for trap
            int x = in.nextInt();
            int y = in.nextInt(); // position of the entity
            int item = in.nextInt(); // if this entity is a robot, the item it is carrying (-1 for NONE, 2 for RADAR, 3 for TRAP, 4 for ORE)
            if (firstTurn && type == 0) {
                robots[id % 5] = new Robot(id, x, y);
            }
            if (firstTurn && type == 1) {
                enemyRobots[id % 5] = new Robot(id, x, y);
            }
            if (type == 0) {
                robots[id % 5].item = convertItemType(item);
                robots[id % 5].lastX = robots[id % 5].x;
                robots[id % 5].lastY = robots[id % 5].y;
                robots[id % 5].x = x;
                robots[id % 5].y = y;
                oreRemaining.remove(new Case(robots[id % 5].directionX, robots[id % 5].directionY));
            }
            if (type == 1) {
                enemyRobots[id % 5].lastLastX = enemyRobots[id % 5].lastX;
                enemyRobots[id % 5].lastLastY = enemyRobots[id % 5].lastY;
                enemyRobots[id % 5].lastX = enemyRobots[id % 5].x;
                enemyRobots[id % 5].lastY = enemyRobots[id % 5].y;
                enemyRobots[id % 5].x = x;
                enemyRobots[id % 5].y = y;
            }
            // If an enemy robot just take an item in the headquarters
            if (!firstTurn && type == 1 && enemyRobots[id % 5].x == 0 && enemyRobots[id % 5].lastX == 0) {
                enemyRobots[id % 5].dangerous = true;
            }
            // If an enemy just put an item
            if (!firstTurn && type == 1 && enemyRobots[id % 5].x != 0
                    && enemyRobots[id % 5].lastX == enemyRobots[id % 5].x && enemyRobots[id % 5].lastY == enemyRobots[id % 5].y
                    && enemyRobots[id % 5].dangerous) {
                enemyRobots[id % 5].dangerous = false;
                findEnemyRobotHole(enemyRobots[id % 5]);
            }
            if (type == 3) {
                trapPositions.add(new Case(x, y));
                oreRemaining.removeAll(Collections.singletonList(new Case(x, y)));
            }
        }
        oreRemaining.removeAll(trapPositions);
        firstTurn = false;
    }

    private static void findEnemyRobotHole(Robot enemyRobot) {
        if (enemyRobot.x < 0 || enemyRobot.y < 0) return;
        if (board[enemyRobot.y][enemyRobot.x].hole) {
            trapPositions.add(new Case(enemyRobot.x, enemyRobot.y));
        }
        // If he's from the east
        if (enemyRobot.x - 1 > 0 && enemyRobot.lastX < enemyRobot.lastLastX) {
            if (board[enemyRobot.y][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y));
            }
            if (enemyRobot.y - 1 > 0 && board[enemyRobot.y-1][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y-1));
            }
            if (enemyRobot.y + 1 < height && board[enemyRobot.y+1][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y+1));
            }
            if (enemyRobot.y + 1 < height && board[enemyRobot.y + 1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y+1));
            }
            if (enemyRobot.y - 1 > 0 && board[enemyRobot.y - 1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y-1));
            }
        }
        // If he's from the west
        if (enemyRobot.lastX > enemyRobot.lastLastX && enemyRobot.x + 1 < width) {
            if (board[enemyRobot.y][enemyRobot.x+1].hole) {
                System.err.println("là");
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y));
            }
            if (enemyRobot.y - 1 > 0 && board[enemyRobot.y-1][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y-1));
            }
            if (enemyRobot.y + 1 < height && board[enemyRobot.y+1][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y+1));
            }
            if (enemyRobot.y + 1 < height && board[enemyRobot.y+1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y+1));
            }
            if (enemyRobot.y - 1 > 0 && board[enemyRobot.y-1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y-1));
            }
        }
        // If he's from the south
        if (enemyRobot.y - 1 > 0 && enemyRobot.lastY < enemyRobot.lastLastY) {
            if (board[enemyRobot.y-1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y-1));
            }
            if (enemyRobot.x + 1 < width && board[enemyRobot.y-1][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y-1));
            }
            if (enemyRobot.x - 1 > 0 && board[enemyRobot.y-1][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y-1));
            }
            if (enemyRobot.x - 1 > 0 && board[enemyRobot.y][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y));
            }
            if (enemyRobot.x + 1 < width && board[enemyRobot.y][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y));
            }
        }
        // If he's from the north
        if (enemyRobot.y + 1 < height && enemyRobot.lastY > enemyRobot.lastLastY) {
            if (board[enemyRobot.y+1][enemyRobot.x].hole) {
                trapPositions.add(new Case(enemyRobot.x, enemyRobot.y+1));
            }
            if (enemyRobot.x + 1 < width && board[enemyRobot.y+1][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y+1));
            }
            if (enemyRobot.x - 1 > 0 && board[enemyRobot.y+1][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y+1));
            }
            if (enemyRobot.x - 1 > 0 && board[enemyRobot.y][enemyRobot.x-1].hole) {
                trapPositions.add(new Case(enemyRobot.x-1, enemyRobot.y));
            }
            if (enemyRobot.x + 1 < width && board[enemyRobot.y][enemyRobot.x+1].hole) {
                trapPositions.add(new Case(enemyRobot.x+1, enemyRobot.y));
            }
        }
    }

    private static void robotTurn() {
        radarRequested = false;
        trapRequested = false;
        for (int i = 0 ; i < 5 ; i++) {
            if (robots[i].x != -1 && robots[i].y != -1) {
                // Transporte un radar
                if (robots[i].item == Item_Type.RADAR && !robots[i].isInHeadquarters()) {
                    if (trapPositions.contains(new Case(robots[i].directionX, robots[i].directionY))) {
                        goToNextOre(i);
                    } else {
                        printMove(robots[i]);
                    }
                    // Vient de miner du minerai
                } else if (robots[i].hasDoneAction() && robots[i].item == Item_Type.ORE) {
                    goBackToHeadquarters(i);
                    printMove(robots[i]);
                    if (robots[i].trapInTheBag) {
                        board[robots[i].y][robots[i].x].trapped = true;
                        robots[i].trapInTheBag = false;
                    }
                    // A essayé de miner mais n'a rien trouvé
                } else if (!robots[i].isInHeadquarters() && robots[i].hasDoneAction() && robots[i].item == Item_Type.NONE) {
                    goToNextOre(i);
                    // Est dans les quartiers généraux
                } else if (robots[i].isInHeadquarters()) {
                    if (robots[i].item == Item_Type.RADAR && !robots[i].hasReachDestination()) {
                        printMove(robots[i]);
                    // S'il faut poser un nouveau radar
                    } else if (!radarRequested && radarCooldown <= 0 && !radarPositions.isEmpty() && oreRemaining.size() < 10 && robots[i].item == Item_Type.NONE) {
                        System.out.println("REQUEST RADAR");
                        Case caseRadar = radarPositions.remove();
                        robots[i].directionX = caseRadar.x;
                        robots[i].directionY = caseRadar.y;
                        radarRequested = true;
                        // S'il n'y a plus de radars dispos
                    } else if (!radarRequested && radarCooldown <= 0 && radarPositions.isEmpty() && robots[i].item == Item_Type.NONE) {
                        System.out.println("REQUEST RADAR");
                        radarRequested = true;
                    } else if (robots[i].hasReachDestination() && oreRemaining.isEmpty()) {
                        printRandomMovement(i);
                    } else {
                        if (!trapRequested && trapCooldown <= 0 && robots[i].item == Item_Type.NONE) {
                            System.out.println("REQUEST TRAP");
                            trapRequested = true;
                            robots[i].trapInTheBag = true;
                        } else {
                            goToNextOre(i);
                        }
                    }
                    // Cas par défaut : doit continuer l'action courante
                } else {
                    Case destinationCase = new Case(robots[i].directionX, robots[i].directionY);
                    if (trapPositions.contains(destinationCase)) {
                        goToNextOre(i);
                        // Si on veut miner un filon piégé
                    } else {
                        printMove(robots[i]);
                    }
                }
            } else {
                printRandomMovement(i);
            }
        }
    }

    private static void printRandomMovement(int i) {
        int random = rand.nextInt(4) + 1;
        if (robots[i].x + random < width) {
            robots[i].directionX += random;
        } else if (robots[i].y + random < height) {
            robots[i].directionY += random;
        } else {
            robots[i].directionX -= random;
        }
        System.out.println("DIG " + robots[i].directionX + " " + robots[i].directionY);
    }

    private static void printMove(Robot robot) {
        String action = robot.directionX == 0 ? "MOVE" : "DIG";
        System.out.println(action + " " + robot.directionX + " " + robot.directionY);
    }

    private static void goBackToHeadquarters(int i) {
        robots[i % 5].directionX = 0;
    }

    private static void fillRadarPositions() {
        radarPositions.add(new Case(10, 5));
        radarPositions.add(new Case(11, 10));
        radarPositions.add(new Case(17, 5));
        radarPositions.add(new Case(18, 10));
        radarPositions.add(new Case(23, 4));
        radarPositions.add(new Case(24, 10));
        radarPositions.add(new Case(5, 8));
    }

    private static void goToNextOre(int i) {
        int index = getNearestOre(i % 5);
        if (index == -1) {
            printRandomMovement(i);
        } else {
            Case caseToGo = oreRemaining.remove(index);
            robots[i % 5].directionX = caseToGo.x;
            robots[i % 5].directionY = caseToGo.y;
            System.out.println("DIG " + robots[i % 5].directionX + " " + robots[i % 5].directionY);
        }
    }

    private static int getNearestOre(int i) {
        if (oreRemaining.isEmpty()) return -1;
        int index = 0;
        int manhattanDistance = getManhattanDistance(robots[i].x, oreRemaining.get(0).x, robots[i].y, oreRemaining.get(0).y);
        for (int j = 1; j < oreRemaining.size(); j++) {
            int manhattanDistanceTemp = getManhattanDistance(robots[i].x, oreRemaining.get(j).x, robots[i].y, oreRemaining.get(j).y);
            if (manhattanDistanceTemp < manhattanDistance) {
                manhattanDistance = manhattanDistanceTemp;
                index = j;
            }
        }
        return index;
    }

    private static int getManhattanDistance(int robotX, int oreX, int robotY, int oreY) {
        return Math.abs(oreX-robotX) + Math.abs(oreY-robotY) + oreX;
    }

    private static Entity_Type convertEntityType(int type) {
        switch (type) {
            case 0: return Entity_Type.ALLY_ROBOT;
            case 1: return Entity_Type.ENEMY_ROBOT;
            case 2: return Entity_Type.RADAR;
            default: return Entity_Type.TRAP;
        }
    }

    private static Item_Type convertItemType(int type) {
        switch (type) {
            case 2: return Item_Type.RADAR;
            case 3: return Item_Type.TRAP;
            case 4: return Item_Type.ORE;
            default:return Item_Type.NONE;
        }
    }

    public static class Case {
        int ore;
        boolean hole;
        boolean trapped;
        boolean radar;
        int idRobot;
        int x;
        int y;
        int turnHoleCreation;

        Case() {
        }

        Case(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public String toString() {
            return "Case{" +
                "ore=" + ore +
                ", hole=" + hole +
                ", trapped=" + trapped +
                ", radar=" + radar +
                ", idRobot=" + idRobot +
                ", x=" + x +
                ", y=" + y +
                ", turnHoleCreation=" + turnHoleCreation +
                '}';
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Case aCase = (Case) o;
            return x == aCase.x &&
                    y == aCase.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }

    static class Robot extends Entity {
        int directionX;
        int directionY;
        int lastX;
        int lastY;
        int lastLastX;
        int lastLastY;
        Item_Type item;
        boolean trapInTheBag;
        boolean dangerous;

        Robot(int id, int x, int y) {
            super(id, x, y);
            this.lastX = x;
            this.lastY = y;
            this.directionX = x;
            this.directionY = y;
            this.lastLastX = x;
            this.lastLastY = y;
        }

        boolean hasDoneAction() {
            return super.x != -1 && super.y != -1 && x == lastX && y == lastY;
        }

        boolean hasReachDestination() {
            return super.x == directionX && super.y == directionY;
        }

        @Override
        public String toString() {
            return "Robot{" +
                "directionX=" + directionX +
                ", directionY=" + directionY +
                ", lastX=" + lastX +
                ", lastY=" + lastY +
                ", lastLastX=" + lastLastX +
                ", lastLastY=" + lastLastY +
                ", item=" + item +
                ", trapInTheBag=" + trapInTheBag +
                ", dangerous=" + dangerous +
                ", id=" + id +
                ", type=" + type +
                ", x=" + x +
                ", y=" + y +
                '}';
        }
    }

    static class Entity {
        int id;
        Entity_Type type;
        int x;
        int y;

        Entity() {}

        Entity(int id, int x, int y) {
            this.id = id;
            this.x = x;
            this.y = y;
        }

        boolean isInHeadquarters() {
            return x == 0;
        }

        boolean isInNextRadarPosition() {
            if (radarPositions.isEmpty()) return false;
            return x == radarPositions.getFirst().x && y == radarPositions.getFirst().y;
        }

        @Override
        public String toString() {
            return "Entity{" +
                    "id=" + id +
                    ", type=" + type +
                    ", x=" + x +
                    ", y=" + y +
                    '}';
        }
    }
}
