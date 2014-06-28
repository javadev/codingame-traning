// Kirk's Quest - The descent
import java.util.*;
import java.io.*;
import java.math.*;

class Player
{
    private static enum Action
    {
        FIRE,HOLD;
    }
    
    private static final int MAX_X = 7;
    private static final int MAX_Y = 10;
    private static final int MAX_H = 9;
    
    private static int sx;
    private static int sy;
    private static final int[] mh = new int[8];

    public static void main(String args[])
    {
        Scanner in = new Scanner(System.in);
        
        while (true)
        {
            // Lecture des parametres de jeu
            sx = in.nextInt();
            sy = in.nextInt();
            int targetX = -1, maxH = 0;
            for(int i=0;i<8;i++)
            {
                int h = in.nextInt();
                mh[i] = h;
                if(h > maxH)
                {
                    targetX = i;
                    maxH = h;
                }
            }
            
            System.out.println((sx==targetX) ? Action.FIRE : Action.HOLD);
        }
    }
}
