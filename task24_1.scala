// Docteur Who - The Gift
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
val N = readInt
val C = readInt
var B = Array[Int]()

var sum = 0
for (i <- 0 until N) {
    val b:Int = readInt
    B +:= b
    sum += b
}
if (C > sum) {
    print("IMPOSSIBLE");
} else {
        B = B.sortWith(_ < _)

    var res = Array[Int]()    
    var remaining = C;

    for (i <- 0 until B.length) {
        var current = B(i);
        if (remaining / (B.length - i) > current) {
            remaining -= current;
            res +:= current
        } else {
            var v = floor(remaining / (B.length -i)).toInt
            res +:= v
            remaining -= v
        }
    }
    res = res.sortWith(_ < _)
    print(res.mkString("\n"));
}

  }
}
