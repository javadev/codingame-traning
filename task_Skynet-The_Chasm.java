// Skynet - The Chasm
import java.util.Scanner;

class Player {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);

        // Read init information from standard input, if any
//        int[] ints = readInts(in);
        int longPont = Integer.parseInt(in.nextLine());
        int longGoufre = Integer.parseInt(in.nextLine());
        int longPlatf = Integer.parseInt(in.nextLine());

        int vCible = longGoufre+1;
        
        while (true) {
            // Read information from standard input
            int vitesse = Integer.parseInt(in.nextLine());
            int position= Integer.parseInt(in.nextLine());

            if (position+vitesse>longPont && position<longPont)
            	System.out.println("JUMP");
            else if (position<longPont)
            {
                if (vCible>vitesse)
                	System.out.println("SPEED");
                else if (vCible<vitesse)
                	System.out.println("SLOW");
                else
                	System.out.println("WAIT");
            	
            }
            else
            	System.out.println("SLOW");
            
        }
    }
    
    private static int[] readInts(Scanner in) {
		String[] split = in.nextLine().split(" ");
		int[] res=new int[split.length];
		for (int i=0;i<split.length;i++) {
			res[i] = Integer.parseInt(split[i]);
		}
		return res;
	}
}
