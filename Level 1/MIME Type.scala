// MIME Type
// Read inputs from System.in, Write outputs to use print.
// Your class name has to be Solution
import math._
import scala.util._

object Solution {
  def main(args: Array[String]) {
var n = readInt
var q = readInt
var mimes = Array[String]()
var mimeMap = Map[String, String]();
for (i <- 0 to n - 1) {
    mimes = mimes :+ readLine
    mimeMap += (mimes(i).replaceAll("(.*)\\s(.*)$", "$1").toLowerCase() -> mimes(i).replaceAll(".*\\s(.*)$", "$1"))
}
var files = Array[String]();
for (i <- 0 to q - 1) {
    files = files :+ readLine
}
for (i <- 0 to files.length - 1) {
    var extention = "";
    if (files(i).indexOf(".") != -1) {
        extention = files(i).replaceAll(".*\\.([0-9a-zA-Z]+)$", "$1")
    }
    if (mimeMap.get(extention.toLowerCase()) != None) {
        println(mimeMap(extention.toLowerCase()));
    } else {
        println("UNKNOWN");
    }
}
  }
}
