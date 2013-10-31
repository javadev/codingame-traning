// Chuck Norris
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
    val n = readLine

var binary = "";
for (i <- 0 to n.length - 1) {
  binary += "0000000".substring(0, 7 - n.charAt(i).toInt.toBinaryString.length) + n.charAt(i).toInt.toBinaryString;
}    
var result = "";
var prevChar = '?';
for (i <- 0 to binary.length - 1) {
    if (binary.charAt(i) == '1') {
        if (prevChar == '1') {
            result += '0';
        } else {
            if (prevChar == '0') {
                result += " ";      
            }
            result += "0 0";
        }
    } else {
        if (prevChar == '0') {
            result += '0';
        } else {
            if (prevChar == '1') {
                result += " ";      
            }
            result += "00 0";

        }
    }
    prevChar = binary.charAt(i);
}    
println(result);
  }
}
