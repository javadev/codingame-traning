import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

class Player {

    private static final String WAIT_ACTION = "WAIT";
    private static final String BLOCK_ACTION = "BLOCK";
    
    private static final String LEFT_DIRECTION = "LEFT";
    private static final String RIGHT_DIRECTION = "RIGHT";
    private static final String NONE_DIRECTION = "NONE";
    
    public static void main(String args[]) {
        
        Scanner in = new Scanner(System.in);
        int nbFloors = in.nextInt(); // number of floors
        int width = in.nextInt(); // width of the area
        int nbRounds = in.nextInt(); // maximum number of rounds
        int exitFloor = in.nextInt(); // floor on which the exit is found
        int exitPos = in.nextInt(); // position of the exit on its floor
        int nbTotalClones = in.nextInt(); // number of generated clones
        int nbAdditionalElevators = in.nextInt(); // ignore (always zero)
        int nbElevators = in.nextInt(); // number of elevators
        
        Map<Integer, Integer> floorToElevator = new HashMap<>();
        floorToElevator.put(exitFloor, exitPos);
        
        for (int i = 0; i < nbElevators; i++) {
            int elevatorFloor = in.nextInt(); // floor on which this elevator is found
            int elevatorPos = in.nextInt(); // position of the elevator on its floor
            floorToElevator.put(elevatorFloor, elevatorPos);
        }

        // game loop
        while (true) {
            
            int cloneFloor = in.nextInt(); // floor of the leading clone
            int clonePos = in.nextInt(); // position of the leading clone on its floor
            String direction = in.next(); // direction of the leading clone: LEFT or RIGHT

            if (isLeadingClone(cloneFloor, clonePos, direction)) {
                String directionToElevator = findDirectionToElevator(clonePos, floorToElevator.get(cloneFloor));
                String nextAction = determineNextAction(direction, directionToElevator);
                System.out.println(nextAction);
            } else {
                System.out.println(WAIT_ACTION);
            }
            
        }
        
    }

    private static boolean isLeadingClone(int cloneFloor, int clonePosition, String cloneDirection) {
        return (cloneFloor != -1) && (clonePosition != -1) && (!cloneDirection.equals(NONE_DIRECTION));
    }
    
    private static String findDirectionToElevator(int clonePosition, int elevatorPosition) {
        if (clonePosition - elevatorPosition > 0) {
            return LEFT_DIRECTION;
        } else if (clonePosition - elevatorPosition < 0) {
            return RIGHT_DIRECTION;
        } else {
            return NONE_DIRECTION;
        }
    }
    
    private static String determineNextAction(String cloneDirection, String directionToElevator) {
        if (cloneDirection.equals(directionToElevator) || directionToElevator.equals(NONE_DIRECTION)) {
            return WAIT_ACTION;
        } else {
            return BLOCK_ACTION;
        }
    }
    
}
