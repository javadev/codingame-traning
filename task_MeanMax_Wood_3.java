import java.util.List;
import java.util.*;
import java.util.stream.Stream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.ArrayList;
import java.io.*;
import java.math.*;
import java.util.Random;
class Player {
	private static class Reaper extends Point {
	    private int id;
	    private int player;
	    private int vx;
	    private int vy;
	    private float mass;
	    private int radius;
	    public Reaper(int id, int player,
	                  double x, double y,
	                  int vx, int vy,
	                  float mass, int radius) {
	        super(x, y);
	        this.id = id;
	        this.player = player;
	        this.mass = mass;
	        this.radius = radius;
	        this.vx = vx;
	        this.vy = vy;
	    }
	    public int getId() {
	        return id;
	    }
	    public int getPlayer() {
	        return player;
	    }
	    public int getVx() {
	        return vx;
	    }
	    public int getVy() {
	        return vy;
	    }
	    public float getMass() {
	        return mass;
	    }
	    public int getRadius() {
	        return radius;
	    }
	}
	private static class Population {
	    private Individual population[];
	    private double populationFitness = -1;
	    public Population(int populationSize) {
	        this.population = new Individual[populationSize];
	    }
	    public Population(int populationSize, int chromosomeLength) {
	        this.population = new Individual[populationSize];
	        for (int individualCount = 0; individualCount < populationSize; individualCount++) {
	            Individual individual = new Individual(chromosomeLength);
	            this.population[individualCount] = individual;
	        }
	    }
	    public Individual[] getIndividuals() {
	        return this.population;
	    }
	    public Individual getFittest(int offset) {
	        Arrays.sort(this.population, new Comparator<Individual>() {
	            @Override
	            public int compare(Individual o1, Individual o2) {
	                if (o1.getFitness() > o2.getFitness()) {
	                    return -1;
	                } else if (o1.getFitness() < o2.getFitness()) {
	                    return 1;
	                }
	                return 0;
	            }
	        });
	        return this.population[offset];
	    }
	    public void setPopulationFitness(double fitness) {
	        this.populationFitness = fitness;
	    }
	    public double getPopulationFitness() {
	        return this.populationFitness;
	    }
	    public int size() {
	        return this.population.length;
	    }
	    public Individual setIndividual(int offset, Individual individual) {
	        return population[offset] = individual;
	    }
	    public Individual getIndividual(int offset) {
	        return population[offset];
	    }
	    public void shuffle() {
	        Random rnd = new Random();
	        for (int i = population.length - 1; i > 0; i--) {
	            int index = rnd.nextInt(i + 1);
	            Individual a = population[index];
	            population[index] = population[i];
	            population[i] = a;
	        }
	    }
	}
	private static class Point {
	    private static final double EPSILON = 0.00001;
	    protected double x;
	    protected double y;
	    Point(double x, double y) {
	        this.x = x;
	        this.y = y;
	    }
	    double distance(Point p) {
	        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
	    }
	    void move(double x, double y) {
	        this.x = x;
	        this.y = y;
	    }
	    void moveTo(Point p, double distance) {
	        double d = distance(p);
	        if (d < EPSILON) {
	            return;
	        }
	        double dx = p.x - x;
	        double dy = p.y - y;
	        double coef = distance / d;
	        this.x += dx * coef;
	        this.y += dy * coef;
	    }
	    boolean isInRange(Point p, double range) {
	        return p != this && distance(p) <= range;
	    }
	    @Override
	    public int hashCode() {
	        final int prime = 31;
	        int result = 1;
	        long temp;
	        temp = Double.doubleToLongBits(x);
	        result = prime * result + (int) (temp ^ (temp >>> 32));
	        temp = Double.doubleToLongBits(y);
	        result = prime * result + (int) (temp ^ (temp >>> 32));
	        return result;
	    }
	    @Override
	    public boolean equals(Object obj) {
	        if (this == obj) return true;
	        if (obj == null) return false;
	        if (getClass() != obj.getClass()) return false;
	        Point other = (Point) obj;
	        if (Double.doubleToLongBits(x) != Double.doubleToLongBits(other.x)) return false;
	        if (Double.doubleToLongBits(y) != Double.doubleToLongBits(other.y)) return false;
	        return true;
	    }
	    public double getX() {
	        return x;
	    }
	    public double getY() {
	        return y;
	    }
	}
	private static class IA {
	    private List<Wreck> wrecks;
	    private List<Reaper> reapers;
	    public IA() {
	        this.wrecks = new ArrayList<>();
	        this.reapers = new ArrayList<>();
	    }
	    public void playGA(){
	        GeneticAlgorithm ga = new GeneticAlgorithm(100, 0.001, 0.95, 2);
	        Population population = ga.initPopulation(50);
	        ga.evalPopulation(population);
	        int generation = 1;
	        while (ga.isTerminationConditionMet(population) == false) {
	            System.out.println("Best solution: " + population.getFittest(0).toString());
	            population = ga.crossoverPopulation(population);
	            population = ga.mutatePopulation(population);
	            ga.evalPopulation(population);
	            generation++;
	        }
	        System.out.println("Found solution in " + generation + " generations");
	        System.out.println("Best solution: " + population.getFittest(0).toString());
	    }
	    public void play(){
	        Reaper reaper = reapers.stream()
	                .filter(r -> r.getPlayer() == 0)
	                .findFirst().get();
	        Wreck nearest = wrecks.stream()
	                .sorted(Comparator.comparing(wreck -> wreck.distance(reaper)))
	                .findFirst().get();
	        System.out.println((int) nearest.getX() + " " + (int) nearest.getY() + " " + 150);
	        System.out.println("WAIT");
	        System.out.println("WAIT");
	    }
	    public List<Wreck> getWrecks() {
	        return wrecks;
	    }
	    public List<Reaper> getReapers() {
	        return reapers;
	    }
	}
	private static class GeneticAlgorithm {
	    private int populationSize;
	    private double mutationRate;
	    private double crossoverRate;
	    private int elitismCount;
	    public GeneticAlgorithm(int populationSize, double mutationRate, double crossoverRate, int elitismCount) {
	        this.populationSize = populationSize;
	        this.mutationRate = mutationRate;
	        this.crossoverRate = crossoverRate;
	        this.elitismCount = elitismCount;
	    }
	    public Population initPopulation(int chromosomeLength) {
	        Population population = new Population(this.populationSize, chromosomeLength);
	        return population;
	    }
	    public double calcFitness(Individual individual) {
	        int correctGenes = 0;
	        for (int geneIndex = 0; geneIndex < individual.getChromosomeLength(); geneIndex++) {
	            if (individual.getGene(geneIndex) == 1) {
	                correctGenes += 1;
	            }
	        }
	        double fitness = (double) correctGenes / individual.getChromosomeLength();
	        individual.setFitness(fitness);
	        return fitness;
	    }
	    public void evalPopulation(Population population) {
	        double populationFitness = 0;
	        for (Individual individual : population.getIndividuals()) {
	            populationFitness += calcFitness(individual);
	        }
	        population.setPopulationFitness(populationFitness);
	    }
	    public boolean isTerminationConditionMet(Population population) {
	        for (Individual individual : population.getIndividuals()) {
	            if (individual.getFitness() == 1) {
	                return true;
	            }
	        }
	        return false;
	    }
	    public Individual selectParent(Population population) {
	        Individual individuals[] = population.getIndividuals();
	        double populationFitness = population.getPopulationFitness();
	        double rouletteWheelPosition = Math.random() * populationFitness;
	        double spinWheel = 0;
	        for (Individual individual : individuals) {
	            spinWheel += individual.getFitness();
	            if (spinWheel >= rouletteWheelPosition) {
	                return individual;
	            }
	        }
	        return individuals[population.size() - 1];
	    }
	    public Population crossoverPopulation(Population population) {
	        Population newPopulation = new Population(population.size());
	        for (int populationIndex = 0; populationIndex < population.size(); populationIndex++) {
	            Individual parent1 = population.getFittest(populationIndex);
	            if (this.crossoverRate > Math.random() && populationIndex >= this.elitismCount) {
	                Individual offspring = new Individual(parent1.getChromosomeLength());
	                Individual parent2 = selectParent(population);
	                for (int geneIndex = 0; geneIndex < parent1.getChromosomeLength(); geneIndex++) {
	                    if (0.5 > Math.random()) {
	                        offspring.setGene(geneIndex, parent1.getGene(geneIndex));
	                    } else {
	                        offspring.setGene(geneIndex, parent2.getGene(geneIndex));
	                    }
	                }
	                newPopulation.setIndividual(populationIndex, offspring);
	            } else {
	                newPopulation.setIndividual(populationIndex, parent1);
	            }
	        }
	        return newPopulation;
	    }
	    public Population mutatePopulation(Population population) {
	        Population newPopulation = new Population(this.populationSize);
	        for (int populationIndex = 0; populationIndex < population.size(); populationIndex++) {
	            Individual individual = population.getFittest(populationIndex);
	            for (int geneIndex = 0; geneIndex < individual.getChromosomeLength(); geneIndex++) {
	                if (populationIndex > this.elitismCount) {
	                    if (this.mutationRate > Math.random()) {
	                        int newGene = 1;
	                        if (individual.getGene(geneIndex) == 1) {
	                            newGene = 0;
	                        }
	                        individual.setGene(geneIndex, newGene);
	                    }
	                }
	            }
	            newPopulation.setIndividual(populationIndex, individual);
	        }
	        return newPopulation;
	    }
	}
	private static class Wreck extends Point {
	    private int id;
	    private double radius;
	    private int water;
	    Wreck(int id, double x, double y, int water, double radius) {
	        super(x, y);
	        this.id = id;
	        this.radius = radius;
	        this.water = water;
	    }
	    public int getId() {
	        return id;
	    }
	    public double getRadius() {
	        return radius;
	    }
	    public int getWater() {
	        return water;
	    }
	}
	private static class Individual {
	    private int[] chromosome;
	    private double fitness = -1;
	    public Individual(int[] chromosome) {
	        this.chromosome = chromosome;
	    }
	    public Individual(int chromosomeLength) {
	        this.chromosome = new int[chromosomeLength];
	        for (int gene = 0; gene < chromosomeLength; gene++) {
	            if (0.5 < Math.random()) {
	                this.setGene(gene, 1);
	            } else {
	                this.setGene(gene, 0);
	            }
	        }
	    }
	    public int[] getChromosome() {
	        return this.chromosome;
	    }
	    public int getChromosomeLength() {
	        return this.chromosome.length;
	    }
	    public void setGene(int offset, int gene) {
	        this.chromosome[offset] = gene;
	    }
	    public int getGene(int offset) {
	        return this.chromosome[offset];
	    }
	    public void setFitness(double fitness) {
	        this.fitness = fitness;
	    }
	    public double getFitness() {
	        return this.fitness;
	    }
	    public String toString() {
	        String output = "";
	        for (int gene = 0; gene < this.chromosome.length; gene++) {
	            output += this.chromosome[gene];
	        }
	        return output;
	    }
	}
    @SuppressWarnings("")
    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        IA ia = new IA();
        int tour = 0;
        while (true) {
            int myScore = in.nextInt();
            int enemyScore1 = in.nextInt();
            int enemyScore2 = in.nextInt();
            int myRage = in.nextInt();
            int enemyRage1 = in.nextInt();
            int enemyRage2 = in.nextInt();
            int unitCount = in.nextInt();
            ia.getWrecks().clear();
            ia.getReapers().clear();
            for (int i = 0; i < unitCount; i++) {
                int unitId = in.nextInt();
                int unitType = in.nextInt();
                int player = in.nextInt();
                float mass = in.nextFloat();
                int radius = in.nextInt();
                int x = in.nextInt();
                int y = in.nextInt();
                int vx = in.nextInt();
                int vy = in.nextInt();
                int extra = in.nextInt();
                int extra2 = in.nextInt();
                if(unitType == 4){
                    Wreck wreck = new Wreck(unitId,x,y,extra,radius);
                    ia.getWrecks().add(wreck);
                } else {
                    Reaper reaper = new Reaper(unitId,player,x,y,vx,vy,mass,radius);
                    ia.getReapers().add(reaper);
                }
            }
            ia.play();
            tour ++;
            if(tour>200){
                break;
            }
        }
    }
}
