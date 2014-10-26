// Horse-racing Duals
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
var n = readInt

var data = Array[Int]()
for (i <- 0 to n - 1) {
    data +:= readInt
}

data = data.sortWith(_ > _)
var diffData = Array[Int]()
for (i <- 1 to n - 1) {
  diffData +:= data(i-1) - data(i)
}
println(diffData.min)
  }
}
