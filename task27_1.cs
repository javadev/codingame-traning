// Mars Lander, Question 2/3
// Recommended time to find a solution: 120:00
// A new set of five more complex tests awaits you.
// Do not hesitate to click on "Previous question" to copy your code and paste it back in the editor of this new level.

// Warning: this time there is more than one test. So before submitting your final code use the "Test script" window on the bottom right hand corner of the screen to switch between tests by changing the value of the "test" variable (1, 2, 3, 4, or 5).

// The input/output/constraints are the same as for the previous question. Click here to view the full set of instructions again.

// Read init information from standard input, if any

using System;
using System.IO;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;

class Player
{
    class Point
    {
        public int X;
        public int Y;
    }
    static void Main(String[] args) {
        // Read init information from standard input, if any
        
        int numberOfpoints = int.Parse(Console.ReadLine());
        var ptList = new List<Point>();
        
        for (int i = 0; i < numberOfpoints; i++)
        {
            string input = Console.ReadLine();
            string[] parts = input.Split(' ');
            Point p = new Point();
            p.X = int.Parse(parts[0]);
            p.Y = int.Parse(parts[1]);
            ptList.Add(p);
        }
        

        Console.Error.WriteLine("nb of points : " + ptList.Count.ToString());
        
        // compute landing zone :
        
        int highestY = 0;
        
        int foundPt = -1;
        for (int i = 0; i < numberOfpoints - 1; i++)
        {
            int Y = ptList[i].Y;
            int nextY = ptList[i+1].Y;
            int length = ptList[i + 1].X - ptList[i + 1].Y;
//            if (length < 1000)
//                continue;
            if (Y == nextY)
            {
                foundPt = i;
            }
            if (Y > highestY)
            {
                highestY = Y;
            }
        }
        
        if (foundPt < 0)
            throw new Exception("not found");
            
        Point LZ = new Point();
        LZ.X = ptList[foundPt].X + ptList[foundPt + 1].X;
        LZ.X /= 2;
        LZ.Y = ptList[foundPt].Y + ptList[foundPt + 1].Y;
        LZ.Y /= 2;
        

        int outR = 0;
        int outP = 3;
        
        while (true) {
            string[] parts = Console.ReadLine().Split(' ');
            int X = int.Parse(parts[0]);
            int Y = int.Parse(parts[1]);
            int HS = int.Parse(parts[2]);
            int VS = int.Parse(parts[3]);
            int F = int.Parse(parts[4]);
            int R = int.Parse(parts[5]);
            int P = int.Parse(parts[6]);
            
            Console.Error.WriteLine("Fuel : " + F.ToString());
            Console.Error.WriteLine("CurPos : " + X.ToString() + " " + Y.ToString());
            Console.Error.WriteLine("Landing zone : " + LZ.X.ToString() + " " + LZ.Y.ToString());
            
            double dstToGround = Math.Sqrt((LZ.X - X) * (LZ.X - X) + (LZ.Y - Y) * (LZ.Y - Y));
            double vDist = Y - LZ.Y;
            double hDist = X - LZ.X;
            
            bool isReadyToLand = false;
                        
            if (Y < highestY - 100)
            {
                if (Math.Abs(hDist) > 1000)
                {
                    isReadyToLand = false;
                }
                else
                {
                    isReadyToLand = true;
                }
            }
            
            int hOptimalSpeed = 20;
            if (highestY > 2000)
                hOptimalSpeed = 15;
            
            int desiredHSpeed = 0;
            if (hDist > 10)
                desiredHSpeed = -hOptimalSpeed;
            else if (hDist < -10)
                desiredHSpeed = hOptimalSpeed;
            else
                desiredHSpeed = 0;
            
            if (HS < desiredHSpeed - 1)
                outR = HS - desiredHSpeed;
            else if (HS > desiredHSpeed + 1)
                outR = HS - desiredHSpeed;
            else
                outR = 0;
            outR *= 1;
            
            int maxAngle = 45;
            if (!isReadyToLand)
            {
                maxAngle = 30;
            }
            outR = (int)Math.Min(outR, maxAngle);
            outR = (int)Math.Max(outR, -maxAngle);
            
            if (vDist < 50)
                outR = 0;

            Console.Error.WriteLine("hDist : " + hDist.ToString());    
            Console.Error.WriteLine("vDist : " + vDist.ToString());    
            Console.Error.WriteLine("HS : " + HS.ToString());    
            Console.Error.WriteLine("desiredHSpeed : " + desiredHSpeed.ToString());    
                
            Console.Error.WriteLine("DstToGround : " + vDist.ToString());

            if (vDist < 100 && Math.Abs(hDist) > 1000)
            {
                outP = 4;
            }
            else if (VS < -20)
            {
                outP = 4;
            }
            else
            {
                outP = 3;
            }

            
            Console.WriteLine(outR.ToString() + " " + outP.ToString());
        }
        
        
        return;

	}
}
