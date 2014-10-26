// Defibrillators
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
var longitude = readLine.replaceAll(",",".").toFloat
var latitude = readLine.replaceAll(",",".").toFloat
var n = readInt
var addresses = Array[String]();
for (i <- 0 to n - 1) {
    addresses = addresses :+ readLine
}

var minDistance = 10000000.toFloat;
var minName = "";
for (i <- 0 to n - 1) {
    var distance = calcDistance(longitude, addresses(i).split(";")(4).replaceAll(",",".").toFloat,
      latitude, addresses(i).split(";")(5).replaceAll(",",".").toFloat); 
    if (distance < minDistance) {
        minDistance = distance;
        minName = addresses(i).split(";")(1);
    }
}
println(minName);


  }
def calcDistance(longA:Float, longB:Float, latiA:Float, latiB:Float): Float = {
    var x = (longB - longA) * Math.cos((latiA+latiB)/2);
    var y = latiB - latiA;
    var result = sqrt(x*x + y*y) * 6371;
    return result.toFloat
}

}
