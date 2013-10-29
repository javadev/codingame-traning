// Bender complexity
import math._
import scala.collection.mutable.{MutableList => List}
 
object Solution {
 
  def main(args: Array[String]) {
 
    val complexity = Array[String]("O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(n^2 log n)", "O(n^3)", "O(2^n)")
 
    // Initialisation
    val n = readLine.toInt
    val data = new Array[List[Double]](complexity.length)
    for (i <- 0 until data.length) data(i) = new List[Double]
 
    // Recuperation des donnees et calcul de la complexite
    for (i <- 0 until n) {
      val v = readLine.split(" ").map((e) => e.toDouble)
      for (j <- 0 until complexity.length) data(j) += computeComplexity(v(0), v(1), complexity(j))
    }
 
    // Afin d'eviter les valeurs abberantes, on supprime 10% des valeurs extremes
    val n10 = n / 20
    for (i <- 0 until data.length) data(i) = data(i).sorted.drop(n10).dropRight(n10)
 
    // calcul des moyennes
    val means = new Array[Double](data.length)
    for (i <- 0 until means.length) means(i) = data(i)./:(0.0)((acc, v) => acc + v / data(i).length)
 
    // calcul des variances
    val variances = new Array[Double](data.length)
    for (i <- 0 until variances.length) variances(i) = data(i)./:(0.0)((acc, v) => acc + computeVariance(v, means(i)))
 
    // recherche de la valeur la plus faible
    var (idx, min) = (0, variances(0))
    for (i <- 1 until variances.length) {
      if (variances(i) < min) {
        idx = i
        min = variances(i)
      }
    }
 
    // Sortie
    println(complexity(idx))
 
  }
 
  def computeComplexity(n: Double, t: Double, cplx: String): Double = {
    val complexity = Array[String]("O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(n^2 log n)", "O(n^3)", "O(2^n)")
    cplx match {
      case "O(1)"         => t
      case "O(log n)"     => t / log(n)
      case "O(n)"         => t / n
      case "O(n log n)"   => t / (n * log(n))
      case "O(n^2)"       => t / (n * n)
      case "O(n^2 log n)" => t / (n * n * log(n))
      case "O(n^3)"       => t / (n * n * n)
      case "O(2^n)"       => t / pow(2, n)
      case _              => 0
    }
  }
 
  def computeVariance(n: Double, mean: Double): Double = {
    val d = n - mean
    d * d / (mean * mean)
  }
 
}

