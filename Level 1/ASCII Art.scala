// ASCII Art
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
var $length = readInt
var $height = readInt
var $char = readLine
var $table = Array[String]();
for (i <- 0 to $height - 1) {
  $table = $table :+ readLine
}

var tableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";

var lines = Array[String]();
for (j <- 0 to $char.length - 1) {
for (i <- 0 to $height - 1) {
    var tableIndex = tableChars.indexOf($char.substring(j, j+1).toUpperCase());
    if (tableIndex == -1) {
        tableIndex = tableChars.length - 1;
    }
    if (i == lines.length) {
        lines = lines :+ "";
    }
    lines(i) += $table(i).substring(tableIndex * $length, tableIndex * $length + $length);
}
}
for (i <- 0 to $height - 1) {
println(lines(i));
}
  }
}
