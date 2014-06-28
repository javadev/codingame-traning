// Ragnarök - Power of Thor
import java.util.*;
import java.io.*;
import java.math.*;

class Player
{
    private enum Direction
    {
        N(0,-1), 
        NE(1,-1), 
        E(1,0), 
        SE(1,1), 
        S(0,1), 
        SW(-1,1), 
        W(-1,0), 
        NW(-1,-1);
        
        static Direction chooseBest(int dx, int dy)
        {
            int sx = signum(dx);
            int sy = signum(dy);
            
            for(Direction dir : values())
            {
                if(dir.dx==sx && dir.dy==sy)
                {
                    return dir;
                }
            }
            throw new IllegalArgumentException("Pas de déplacement nécessaire");
        }
        
        private final int dx,dy;
        
        Direction(int dx, int dy)
        {
            this.dx=dx;
            this.dy=dy;
        }
    }
    
    private static final int MAP_WIDTH = 40;
    private static final int MAP_HEIGHT = 18;
    
    private static int lx,ly,tx,ty;
    
    private static int signum(int i)
    {
        return (i<0) ? -1 : (i>0) ? 1 : 0;
    }
    
    public static void main(String args[])
    {
        Scanner in = new Scanner(System.in);

       lx = in.nextInt();
       ly = in.nextInt();
       
       tx = in.nextInt();
       ty = in.nextInt();
       
       System.err.printf("Initial: L(%d,%d), T(%d,%d)\n",lx,ly,tx,ty);

        while (true)
        {
            int e = in.nextInt();

            int dx = lx-tx;
            int dy = ly-ty;
            
            Direction dir = Direction.chooseBest(dx,dy);

            tx +=dir.dx;
            ty +=dir.dy;

            System.out.println(dir);
        }
    }
}
