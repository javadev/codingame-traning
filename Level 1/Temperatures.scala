// Temperatures
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

import math._
import scala.util._
import scala.math._
import scala.util.control.Breaks._

object Solution {
  def main(args: Array[String]) {
var n = readInt

if (n == 0) {
  println("0");
} else {

var values = readLine.split(" ");
var valuesNums = Array[Int]();
for (i <- 0 to n - 1) {
    valuesNums = valuesNums :+ values(i).toInt;
}
var valuesZerroSize = Array[Int]();
for (i <- 0 to n - 1) {
    valuesZerroSize = valuesZerroSize :+ abs(values(i).toInt);
}
var minValue = valuesZerroSize(0);
for (i <- 0 to n - 1) {
  if (valuesZerroSize(i) < minValue) {
      minValue = valuesZerroSize(i);
  }
}
var valueFound = false;
breakable { for (i <- 0 to n - 1) {
    if (valuesNums(i) == minValue) {
        println(minValue);
        valueFound = true;
        break;
    }
} }
if (!valueFound) {
    println(-minValue);
}
}
}
}
