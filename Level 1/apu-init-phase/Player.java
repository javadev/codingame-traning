import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Don't let the machines win. You are humanity's last hope...
 **/
class Player {

    private static final char POWER_NODE = '0';
    private static final Node NO_NEIGHBOR = new Node(-1, -1);
    
    private static class Node {
        
        private final int row;
        private final int column;
        
        private Node(int row, int column) {
            this.row = row;
            this.column = column;
        }

        public int getRow() {
            return row;
        }

        public int getColumn() {
            return column;
        }

        @Override
        public String toString() {
            return column + " " + row;
        }
        
    }
    
    public static void main(String args[]) {
        
        Scanner in = new Scanner(System.in);
        
        int width = in.nextInt(); // the number of cells on the X axis
        in.nextLine();
        
        int height = in.nextInt(); // the number of cells on the Y axis
        in.nextLine();
        
        char[][] grid = new char[height][width];
        for (int i = 0; i < height; i++) {
            String line = in.nextLine(); // width characters, each either 0 or .
            grid[i] = line.toCharArray();
        }

        List<Node> powerNodes = findPowerNodes(grid, width, height);
        for (Node powerNode : powerNodes) {
            Node rightNeighbor = findRightNeighbor(grid, width, powerNode).orElse(NO_NEIGHBOR);
            Node bottomNeighbor = findBottomNeighbor(grid, height, powerNode).orElse(NO_NEIGHBOR);
            System.out.println(powerNode.toString() + " " + rightNeighbor.toString() + " " + bottomNeighbor.toString()); // Three coordinates: a node, its right neighbor, its bottom neighbor
        }
        
    }
    
    private static List<Node> findPowerNodes(char[][] grid, int width, int height) {
        List<Node> powerNodes = new LinkedList<>();
        for (int row = 0; row < height; row++) {
            for (int column = 0; column < width; column++) {
                if (grid[row][column] == POWER_NODE) {
                    powerNodes.add(new Node(row, column));
                }
            }
        }
        return powerNodes;
    }

    private static Optional<Node> findRightNeighbor(char[][] grid, int width, Node node) {
        for (int i = node.getColumn() + 1; i < width; i++) {
            if (grid[node.getRow()][i] == POWER_NODE) {
                return Optional.of(new Node(node.getRow(), i));
            }
        }
        return Optional.empty();
    }
    
    private static Optional<Node> findBottomNeighbor(char[][] grid, int height, Node node) {
        for (int i = node.getRow() + 1; i < height; i++) {
            if (grid[i][node.getColumn()] == POWER_NODE) {
                return Optional.of(new Node(i, node.getColumn()));
            }
        }
        return Optional.empty();
    }
    
}
