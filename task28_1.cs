// Mars Lander, Question 3/3
// Recommended time to find a solution: 120:00
// There are two tests to pass in this ultimate level and if you succeed you will make history. As before you can copy/paste your code from the previous question.

// Click here to view the full set of instructions again.

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
        public double X;
        public double Y;
    }

	// Given three colinear points p, q, r, the function checks if
	// point q lies on line segment 'pr'
	static bool onSegment(Point p, Point q, Point r)
	{
		if (q.X <= Math.Max(p.X, r.X) && q.X >= Math.Min(p.X, r.X) &&
			q.Y <= Math.Max(p.Y, r.Y) && q.Y >= Math.Min(p.Y, r.Y))
		   return true;
 
		return false;
	}
	
	// The main function that returns true if line segment 'p1q1'
    // and 'p2q2' intersect.
    static bool doIntersect(Point p1, Point q1, Point p2, Point q2)
    {
        // Find the four orientations needed for general and
        // special cases
        int o1 = orientation(p1, q1, p2);
        int o2 = orientation(p1, q1, q2);
        int o3 = orientation(p2, q2, p1);
        int o4 = orientation(p2, q2, q1);
     
        // General case
        if (o1 != o2 && o3 != o4)
            return true;
     
        // Special Cases
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1
        if (o1 == 0 && onSegment(p1, p2, q1)) return true;
     
        // p1, q1 and p2 are colinear and q2 lies on segment p1q1
        if (o2 == 0 && onSegment(p1, q2, q1)) return true;
     
        // p2, q2 and p1 are colinear and p1 lies on segment p2q2
        if (o3 == 0 && onSegment(p2, p1, q2)) return true;
     
         // p2, q2 and q1 are colinear and q1 lies on segment p2q2
        if (o4 == 0 && onSegment(p2, q1, q2)) return true;
     
        return false; // Doesn't fall in any of the above cases
    }
 
	// To find orientation of ordered triplet (p, q, r).
	// The function returns following values
	// 0 --> p, q and r are colinear
	// 1 --> Clockwise
	// 2 --> Counterclockwise
	static int orientation(Point p, Point q, Point r)
	{
		// See 10th slides from following link for derivation of the formula
		// http://www.dcs.gla.ac.uk/~pat/52233/slides/Geometry1x1.pdf
		double val = (q.Y - p.Y) * (r.X - q.X) -
				  (q.X - p.X) * (r.Y - q.Y);
 
		if (val == 0) return 0;  // colinear
 
		return (val > 0)? 1: 2; // clock or counterclock wise
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
        
        double highestY = 0;
        
        int foundPt = -1;
        for (int i = 0; i < numberOfpoints - 1; i++)
        {
            double Y = ptList[i].Y;
            double nextY = ptList[i+1].Y;
            double length = ptList[i + 1].X - ptList[i + 1].Y;
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
        
        double groundApproachingSpeed = -1;
        double previousDist = -1;
        
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
            
            int pX = int.Parse(parts[0]);
            int pY = int.Parse(parts[1]);

            
            Point p1 = new Point(){X = pX,Y = pY};
            Point q1 = LZ;
            
            bool bCollisionFound = false;
            int nbCollision = 0;
            for (int i = 0; i < numberOfpoints - 1; i++)
            {
                Point p2 = ptList[i];
                Point q2 = ptList[i + 1];
                if (doIntersect(p1, q1, p2, q2))
                {
                    nbCollision++;
                }
            }
            bCollisionFound = nbCollision > 1;
            
            
            int closestPointIndex = 0;
            double closestDist = double.MaxValue;
            for (int i = 0; i < numberOfpoints; i++)
            {
                Point Pipi = ptList[i];
                double dist = Math.Sqrt((Pipi.X - X) * (Pipi.X - X) + (Pipi.Y - Y) * (Pipi.Y - Y));
                if (dist < closestDist)
                {
                    closestDist = dist;
                    closestPointIndex = i;
                }
            }
            
            if (previousDist > 0)
            {
                groundApproachingSpeed = previousDist - closestDist;
            }
            
            previousDist = closestDist;
            Console.Error.WriteLine("groundApproachingSpeed : " + closestDist.ToString());
            
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
            Console.Error.WriteLine("isReadyToLand : " + isReadyToLand.ToString());

            
            int hOptimalSpeed = 20;
            if (highestY > 2000)
                hOptimalSpeed = 15;
            if (bCollisionFound)
                hOptimalSpeed = 20;
            
            int desiredHSpeed = 0;
            if (hDist > 10 || bCollisionFound)
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
            Console.Error.WriteLine("closestDist : " + closestDist.ToString());    
                
            Console.Error.WriteLine("DstToGround : " + vDist.ToString());

            //if (vDist < 100 && Math.Abs(hDist) > 1000)
            if (!isReadyToLand && (VS < 0 || Y < highestY + 100) && bCollisionFound)
            {
                outP = 4;
            }
            else if (!isReadyToLand && (closestDist < 300 || VS < -10) )
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
