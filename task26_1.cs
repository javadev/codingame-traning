// Mars Lander, Question 1/3
// Recommended time to find a solution: 60:00

/*
For a landing to be successful, the ship must:

    land on flat ground
    land in a vertical position (tilt angle = 0°)
    vertical speed must be limited ( ? 40m/s in absolute value)
    horizontal speed must be limited ( ? 20m/s in absolute value)

For each test, there is a unique area of flat ground on the surface of Mars which is at least 1000 meters wide.

The program must first read the initialization data from standard input. Then, within an infinite loop, the program must read the data from the standard input related to Mars Lander's current state and provide to the standard output the instructions to move Mars Lander.

For this first level, Mars Lander will go through a single test.

Tests and validators are only slightly different. A program that passes a given test will pass the corresponding validator without any problem.
 
INITILIZATION INPUT:
Line 1: the number N of points used to draw the surface of Mars.
N following lines: a couple of integers X Y providing the coordinates of a ground point. By linking all the points together in a sequential fashion, you form the surface of Mars which is composed of several segments. For the first point, X = 0 and for the last point, X = 6999
 
INPUT FOR ONE GAME TURN:
A single line with 7 integers: X Y HS VS F R P

    (X, Y) are the coordinates of Mars Lander (in meters).
    HS et VS are the horizontal and vertical speed of Mars Lander (in m/s). These can be negative depending on the direction of Mars Lander.
    F is the remaining quantity of fuel in liters. When there is no more fuel, the power of thrusters falls to zero.
    R is the angle of rotation of Mars Lander expressed in degrees.
    P is the thrust power of the landing ship.

 
OUTPUT FOR ONE GAME TURN:
A single line with 2 integers: R P

    R is the desired rotation angle for Mars Lander. Please note that for each turn the actual value of the angle is limited to the value of the previous turn +/- 15°.
    P is the desired thrust power. 0 = off. 4 = maximum power. Please note that for each turn the value of the actual power is limited to the value of the previous turn +/- 1.
*/

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
        
        int foundPt = -1;
        for (int i = 0; i < numberOfpoints - 1; i++)
        {
            int Y = ptList[i].Y;
            int nextY = ptList[i+1].Y;
            int length = ptList[i + 1].X - ptList[i + 1].Y;
            if (length < 1000)
                continue;
            if (Y == nextY)
            {
                foundPt = i;
                break;
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
            Console.Error.WriteLine("DstToGround : " + vDist.ToString());
            
            if (VS < -20)
                outP = 4;
            else
                outP = 3;
            
            Console.WriteLine(outR.ToString() + " " + outP.ToString());
        }
        
        
        return;

	}
}
