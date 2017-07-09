import java.util.*;
import java.io.*;
import java.math.*;

class Player {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        
        /*two variables, one to set the highest mountain (maxHeight)
        the other one to set the index of such mountain*/
        int mountainT = 0; 
        int imax = 0;
    
        
        // game loop
        while (true) {
            for (int i = 0; i < 8; i++) {
                int mountainH = in.nextInt(); // represents the height of one mountain, from 9 to 0.
                
                /*if a mountain is higher than mountainT,
                it becomes the highest mountain and we get
                it's index (imax)*/
                if (mountainH > mountainT){
                    mountainT = mountainH;
                    imax = i;
                    
                }
               
            }
            System.out.println(imax); // The number of the mountain to fire on.
            
            //return mountainT to 0 in case another pass is neeeded
            mountainT = 0;

        }
        
    }
}
