import java.util.Scanner;

class Player {

    private static final String UP = "U";
    private static final String DOWN = "D";
    private static final String LEFT = "L";
    private static final String RIGHT = "R";
    
    private static class PotentialWindowsArea {
        
        private int topLeftX;
        private int topLeftY;
        private int width;
        private int height;
        
        private PotentialWindowsArea(int topLeftX, int topLeftY, int width, int height) {
            this.topLeftX = topLeftX;
            this.topLeftY = topLeftY;
            this.width = width;
            this.height = height;
        }
        
    }

    public static void main(String args[]) {
        
        Scanner in = new Scanner(System.in);
        int W = in.nextInt(); // width of the building.
        int H = in.nextInt(); // height of the building.
        int N = in.nextInt(); // maximum number of turns before game over.
        int X0 = in.nextInt();
        int Y0 = in.nextInt();

        PotentialWindowsArea potentialWindowsArea = new PotentialWindowsArea(0, 0, W, H);
        
        // game loop
        while (true) {
            
            String BOMB_DIR = in.next(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)

            updatePotentialWindowsArea(potentialWindowsArea, X0, Y0, BOMB_DIR);
            X0 = getNextWindowX(potentialWindowsArea, X0, BOMB_DIR);
            Y0 = getNextWindowY(potentialWindowsArea, Y0, BOMB_DIR);
            System.out.println(X0 + " " + Y0);
        }
    }
    
    private static void updatePotentialWindowsArea(PotentialWindowsArea potentialWindowsArea, int batmanX, int batmanY, String bombDirection) {
        
        if (bombDirection.contains(UP)) {
            potentialWindowsArea.height = batmanY - potentialWindowsArea.topLeftY;
        } else if (bombDirection.contains(DOWN)) {
            potentialWindowsArea.height = potentialWindowsArea.topLeftY + (potentialWindowsArea.height - 1) - batmanY;
            potentialWindowsArea.topLeftY = batmanY + 1;
        } else {
            potentialWindowsArea.height = 1;
        }
        
        if (bombDirection.contains(LEFT)) {
            potentialWindowsArea.width = batmanX - potentialWindowsArea.topLeftX;
        } else if (bombDirection.contains(RIGHT)) {
            potentialWindowsArea.width = potentialWindowsArea.topLeftX + (potentialWindowsArea.width - 1) - batmanX;
            potentialWindowsArea.topLeftX = batmanX + 1;
        } else {
            potentialWindowsArea.width = 1;
        }
        
    }
    
    private static int getNextWindowX(PotentialWindowsArea currentlyInterestingArea, int batmanX, String bombDirection) {
        
        if (bombDirection.contains(LEFT)) {
            return batmanX - (int) Math.ceil(currentlyInterestingArea.width / 2.0);
        }
        
        if (bombDirection.contains(RIGHT)) {
            return batmanX + (int) Math.ceil(currentlyInterestingArea.width / 2.0);
        }
        
        return batmanX;
    }

    private static int getNextWindowY(PotentialWindowsArea currentlyInterestingArea, int batmanY, String bombDirection) {
        
        if (bombDirection.contains(UP)) {
            return batmanY - (int) Math.ceil(currentlyInterestingArea.height / 2.0);
        } 
        
        if (bombDirection.contains(DOWN)) {
            return batmanY + (int) Math.ceil(currentlyInterestingArea.height / 2.0);
        }
        
        return batmanY;
    }
    
}
