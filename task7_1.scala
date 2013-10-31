// Stock Exchange Losses
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
    val n = readInt
    val data = readLine.split("\\s+");
    var maxi = data(0).toInt;
    var perte = 0;
    for(i <- 1 to n - 1) {
      if (maxi - data(i).toInt > perte) {
        perte = maxi - data(i).toInt;
      }
      if (data(i).toInt > maxi) {
        maxi = data(i).toInt;
      }
    }
    println(-perte);
  }
}
