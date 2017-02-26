import java.util.*;
import java.io.*;
import java.math.*;

class Player {
    private static FactoryMap factoryMap;
    private static List<Troop> allTroops;

    public static void main(String args[]) {
        Scanner inStream = new Scanner(System.in);
        oneTimeGameSetup(inStream);
        
        while (true) {
            allTroops = InputParser.getTroopsAndUpdateFactories(inStream, factoryMap);
            makeMove();
        }
    }
    
    static void oneTimeGameSetup(Scanner in) {
        int numberOfFactories = in.nextInt();
        factoryMap = InputParser.getFactoryMap(in, numberOfFactories);
    }
    
    static void printTurnInfo() {
        List<Factory> myFactories = factoryMap.getMine();
        Output.LOG("My factories: ");
        for (Factory factory : myFactories) {
            Output.LOG("   " + factory.getID());
        }
    }
    
    static int turn_number = 0;
    
    static void makeMove() {
        List<Factory> myFactories = factoryMap.getMine();
        List<Factory> opponentFactories = factoryMap.getOpponents();
        List<Factory> neutralFactories = factoryMap.getNeutral();
        
        if (neutralFactories.size() > 0) {
            Strategy.divideAndConquerNeutral(factoryMap);
        } else if (opponentFactories.size() > 0) {
            Strategy.attackOpponent(factoryMap);
        } else {
            Output.skipTurn();
        }

        turn_number++;
    }
}

class Strategy {
    private static List<Factory> myFactories;
    private static List<Factory> opponentFactories;
    private static List<Factory> neutralFactories;
    private static List<Factory> factoriesToConquer;

    static void initialize(FactoryMap factoryMap) {
        myFactories = factoryMap.getMine();
        opponentFactories = factoryMap.getOpponents();
        neutralFactories = factoryMap.getNeutral();
        factoriesToConquer = new ArrayList<>();
        factoriesToConquer.addAll(opponentFactories);
        factoriesToConquer.addAll(neutralFactories);
    }
    
    static void divideAndConquerNeutral(FactoryMap factoryMap) {
        initialize(factoryMap);

        sortBySizeLargest(myFactories);
        Factory sourceFactory = myFactories.get(0);
        Factory targetFactory = sourceFactory.getClosest(neutralFactories);
        
        int numberOfCyborgsToSend = targetFactory.getNumberOfCyborgs()
                + sourceFactory.getDistance(targetFactory.getID()) * targetFactory.getProductionRate()
                + 1;
                
        Output.LOG("NUMBER OF CYBORGS TO SEND = " + numberOfCyborgsToSend);
        numberOfCyborgsToSend = numberOfCyborgsToSend < sourceFactory.getNumberOfCyborgs()
                                    ? numberOfCyborgsToSend
                                    : sourceFactory.getNumberOfCyborgs() - sourceFactory.getProductionRate();
        
        Output.sendTroop(sourceFactory, targetFactory, numberOfCyborgsToSend);
    }
    
    static void attackOpponent(FactoryMap factoryMap) {
        initialize(factoryMap);

        sortBySizeLargest(myFactories);
        Factory sourceFactory = myFactories.get(0);
        
        sortBySizeSmallest(opponentFactories);
        Factory targetFactory = opponentFactories.get(0);
        
        int numberOfCyborgsToConquer = targetFactory.getNumberOfCyborgs() 
                    + (targetFactory.getDistance(sourceFactory.getID()) * targetFactory.getProductionRate());
        
        if (numberOfCyborgsToConquer < sourceFactory.getSize()) {
            Output.sendTroop(sourceFactory, targetFactory, targetFactory.getSize());
        } else {
            Output.sendTroop(sourceFactory, targetFactory, sourceFactory.getSize() / 2);
        }
    }
    
    private static void sortBySizeLargest(List<Factory> factories) {
        Collections.sort(factories, new NumberOfCyborgsComparator());
    }
    
    private static void sortBySizeSmallest(List<Factory> factories) {
        Collections.sort(factories, new NumberOfCyborgsComparator(true));
    }
    
    static class NumberOfCyborgsComparator implements Comparator<Factory> {
        private boolean _isInverse = false;
        
        NumberOfCyborgsComparator() {}
        NumberOfCyborgsComparator(boolean isInverse) {
            _isInverse = isInverse;
        }

        public int compare(Factory o1, Factory o2) {
            int result = _isInverse
                ? o1.getNumberOfCyborgs() - o2.getNumberOfCyborgs()
                : o2.getNumberOfCyborgs() - o1.getNumberOfCyborgs();
            if (result == 0) {
                return -1;
            } else {
                return result;
            }
        }
    }
}

enum Owner {
    ME(1),
    OPPONENT(-1),
    NEUTRAL(0);
    
    private int _key;
    
    Owner(int key) {
        _key = key;
    }
    
    static Owner get(int key) {
        for (Owner owner : Owner.values()) {
            if (owner._key == key) return owner;
        }
        return null;
    }
}

class Troop {
    Owner _owner;
    Factory _sourceFactory;
    Factory _targetFactory;
    int _size;
    int _remainingTurnsToTarget;

    Troop(Owner owner, 
          Factory sourceFactory, 
          Factory targetFactory, 
          int numberOfCyborgs, 
          int remainingTurnsToDestination){
        _owner = owner;
        _sourceFactory = sourceFactory;
        _targetFactory = targetFactory;
        _size = numberOfCyborgs;
        _remainingTurnsToTarget = remainingTurnsToDestination;
    }
    
    Owner getOwner() {
        return _owner;
    }
}

class TroopRegistry {
    List<Troop> _allTroops;
    
    TroopRegistry(List<Troop> allTroops) {
        _allTroops = allTroops;
    }
    
    List<Troop> getMine() {
        return getTroops(Owner.ME);
    }
    
    List<Troop> getOpponentTroops() {
        return getTroops(Owner.OPPONENT);
    }
    
    private List<Troop> getTroops(Owner owner) {
        List<Troop> troops = new ArrayList<>();
        for (Troop troop : _allTroops) {
            if (troop.getOwner() == owner) troops.add(troop);
        }
        return troops;
    }
}

class Factory {
    private int _id;
    private int _numberOfCyborgs = 0;
    private int _productionRate = 0; // in range [0, 3]
    private Owner _owner = Owner.NEUTRAL;
    private Map<Integer, Integer> _linksByFactoryID = new HashMap<>();
    
    Factory(int id) {
        _id = id;
    }
    
    int getID() {
        return _id;
    }
    
    Owner getOwner() {
        return _owner;
    }
    
    int getNumberOfCyborgs() {
        return _numberOfCyborgs;
    }
    
    int getSize() {
        return _numberOfCyborgs;
    }
    
    int getProductionRate() {
        return _productionRate;
    }
    
    void update(Owner owner, int numberOfCyborgs, int productionRate) {
        _owner = owner;
        _numberOfCyborgs = numberOfCyborgs;
        _productionRate = productionRate;
    }
    
    void addLink(int otherFactoryID, int distanceToFactory) {
        _linksByFactoryID.put(otherFactoryID, distanceToFactory);
    }
    
    int getDistance(int otherFactoryID) {
        return _linksByFactoryID.get(otherFactoryID);
    }
    
    Factory getClosest(List<Factory> otherFactories) {
        Factory closest = otherFactories.get(0);
        for (Factory factory : otherFactories) {
            if (getDistance(factory.getID()) < getDistance(closest.getID())) {
                closest = factory;
            }
        }
        return closest;
    }
}

class FactoryMap {
    private Map<Integer, Factory> _factoryByID = new HashMap<>();
    
    FactoryMap() {}
    
    void addFactory(Factory factory) {
        _factoryByID.put(factory.getID(), factory);
    }
    
    void addLink(int fromFactoryID, int toFactoryID, int distanceBetweenFactories) {
        _factoryByID.get(fromFactoryID).addLink(toFactoryID, distanceBetweenFactories);
        _factoryByID.get(toFactoryID).addLink(fromFactoryID, distanceBetweenFactories);
    }
    
    Factory getFactory(int id) {
        return _factoryByID.get(id);
    }
    
    List<Factory> getMine() {
        return getFactories(Owner.ME);
    }
    
    List<Factory> getOpponents() {
        return getFactories(Owner.OPPONENT);
    }
    
    List<Factory> getNeutral() {
        return getFactories(Owner.NEUTRAL);
    }
    
    private List<Factory> getFactories(Owner owner) {
        List<Factory> factories = new ArrayList<>();
        for (Factory factory : _factoryByID.values()) {
            if (factory.getOwner() == owner) factories.add(factory);
        }
        return factories;
    }
}

class Output {
    static void sendTroop(Factory sourceFactory, Factory targetFactory, int numberOfCyborgs) {
        System.out.println("MOVE " + 
                           sourceFactory.getID() + " " +
                           targetFactory.getID() + " " +
                           numberOfCyborgs);
    }
    
    static void skipTurn() {
        System.out.println("WAIT");
    }
    
    static void LOG(String input) {
        System.err.println(input);
    }
}

class InputParser {
    static FactoryMap getFactoryMap(Scanner in, int numberOfFactories) {
        FactoryMap factoryMap = new FactoryMap();
        for (int i = 0; i < numberOfFactories; i++) {
            factoryMap.addFactory(new Factory(i));
        }
        int numberOfLinks = in.nextInt();
        for (int i = 0; i < numberOfLinks; i++) {
            int factory1 = in.nextInt();
            int factory2 = in.nextInt();
            int distance = in.nextInt();
            factoryMap.addLink(factory1, factory2, distance);
        }
        return factoryMap;
    }
    
    static List<Troop> getTroopsAndUpdateFactories(Scanner in, FactoryMap factoryMap) {
        List<Troop> allTroops = new ArrayList<>();
        int entityCount = in.nextInt();
        for (int i = 0; i < entityCount; i++) {
            int entityID = in.nextInt();
            String entityType = in.next();
            int arg1 = in.nextInt();
            int arg2 = in.nextInt();
            int arg3 = in.nextInt();
            int arg4 = in.nextInt();
            int arg5 = in.nextInt();

            if (entityType.equals("FACTORY")) {
                Owner owner = Owner.get(arg1);
                int numberOfCyborgs = arg2;
                int productionRate = arg3;
                factoryMap.getFactory(entityID).update(owner, numberOfCyborgs, productionRate);
            } else {
                Owner owner = Owner.get(arg1);
                int numberOfCyborgs = arg4;
                int remainingTurnsToDestination = arg5;
                allTroops.add(new Troop(owner, 
                                        factoryMap.getFactory(arg2),
                                        factoryMap.getFactory(arg3),
                                        numberOfCyborgs, 
                                        remainingTurnsToDestination));
            }
        }
        return allTroops;
    }
}
