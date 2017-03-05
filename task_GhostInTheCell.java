import java.util.*;
import java.util.stream.Collectors;

class Player {

	static boolean validateGS = false;

	static AI ai = new RandomAI(new BasicScoreEvaluation(), new ProdAI(-1));

	static boolean firstTurn = true;

	public static void main(String args[]) {
		Scanner in = new Scanner(System.in);

		InputReader.initFactories(in);

		GameState computedGameState = null;

		while (true) {
			GameState gs = InputReader.initGameState(in);
			if (computedGameState != null) {
				if (validateGS) {
					GameAssertions.assertGameState(computedGameState, gs);
				}
				carryOverComputedState(computedGameState, gs);
			}

			List<Action> actions = ai.compute(gs);

			computedGameState = GameEngine.applyActions(gs, actions, new ArrayList<>(), 1);

			String commands = actions.get(0).output();
			if (actions.size() > 1) {
				for (int i = 1; i < actions.size(); i++) {
					commands += ";" + actions.get(i).output();
				}
			}
			System.out.println(commands);

			firstTurn = false;
		}
	}

	private static void carryOverComputedState(GameState computedGameState, GameState gs) {
		gs.bombsLeft[0] = computedGameState.bombsLeft[0];
		gs.bombsLeft[1] = computedGameState.bombsLeft[1];

		for (int i = 0; i < computedGameState.factories.length; i++) {
			gs.factories[i].bombCountdown = computedGameState.factories[i].bombCountdown;
		}
	}


	static class GameState {
		static int[][] distances;

		Factory[] factories;
		List<Bomb> incomingBombs = new ArrayList<>();
		int[] bombsLeft = {2, 2};

		GameState(int factoryCount) {
			factories = new Factory[factoryCount];
		}

		int factories(int ownerId) {
			int count = 0;
			for (Factory factory : factories) {
				if (factory.owner == ownerId) {
					count++;
				}
			}
			return count;
		}

		GameState copy() {
			GameState copy = new GameState(factories.length);

			for (int i = 0; i < factories.length; i++) {
				copy.factories[i] = factories[i].copy();
			}
			for (Bomb bomb : incomingBombs) {
				copy.incomingBombs.add(bomb.copy());
			}
			copy.bombsLeft = Arrays.copyOf(bombsLeft, bombsLeft.length);

			return copy;
		}

		Factory findFactory(int id) {
			for (int i = 0; i < factories.length; i++) {
				if (factories[i].id == id) {
					return factories[i];
				}
			}
			throw new IllegalArgumentException("Could not find factory: " + id);
		}

		@Override
		public String toString() {
			return "GameState{" +
					"factories=" + Arrays.toString(factories) +
					'}';
		}

		int cyborgs(int ownerId) {
			int cyborgs = 0;
			for (Factory factory : factories) {
				if (factory.owner == ownerId) {
					cyborgs += factory.cyborgCount;
				}
				for (Troop troop : factory.incomingTroops) {
					if (troop.owner == ownerId) {
						cyborgs += troop.count;
					}
				}
			}
			return cyborgs;
		}

		public int cyborgProduction(int ownerId) {
			int production = 0;
			for (Factory factory : factories) {
				if (factory.owner == ownerId) {
					production += factory.production;
				}
			}
			return production;
		}

		public int cyborgProjectedProduction(int ownerId, int depth, int activePlayer) {
			int production = 0;
			GameState gs = this;
			for (int i = 0; i < depth; i++) {
				for (Factory factory : gs.factories) {
					if (factory.owner == ownerId) {
						production += factory.production;
					}
				}
				gs = GameEngine.applyActions(gs, Collections.emptyList(), Collections.emptyList(), activePlayer);
			}
			return production;
		}

		public boolean hasIncomingBomb(int id) {
			for (Bomb bomb : incomingBombs) {
				if (bomb.to == id) return true;
			}
			return false;
		}
	}

	static class Factory {
		int id;
		int owner;
		int cyborgCount;
		int production;

		List<Troop> incomingTroops;
		int bombCountdown = -1;

		int[] troopsReadyForBattle = new int[3];

		Factory(int id, int owner, int cyborgCount, int production) {
			this.id = id;
			this.owner = owner;
			this.cyborgCount = cyborgCount;
			this.production = production;

			incomingTroops = new ArrayList<>();
		}

		Factory copy() {
			Factory copy = new Factory(id, owner, cyborgCount, production);

			for (Troop troop : incomingTroops) {
				copy.incomingTroops.add(troop.copy());
			}
			copy.bombCountdown = bombCountdown;

			return copy;
		}

		public void addIncomingTroop(int id, int owner, int source, int destination, int movedCyborgs, int timeToTarget) {
			for (Troop troop : incomingTroops) {
				if (troop.from == source && troop.to == destination && troop.timeToTarget == timeToTarget) {
					troop.count += movedCyborgs;
					return;
				}
			}
			incomingTroops.add(new Troop(-1, owner, source, destination, movedCyborgs, timeToTarget));
		}

		@Override
		public boolean equals(Object obj) {
			if (obj == null) return false;

			Factory other = (Factory) obj;

			if (other.id != id) return false;
			if (other.owner != owner) return false;
			if (other.cyborgCount != cyborgCount) return false;
			if (other.production != production) return false;

			if (!other.incomingTroops.equals(incomingTroops)) return false;

			return true;
		}

		@Override
		public String toString() {
			return "Factory{" +
					"id=" + id +
					", owner=" + owner +
					", cyborgCount=" + cyborgCount +
					", production=" + production +
					", incomingTroops=" + incomingTroops +
					", bombCountdown=" + bombCountdown +
					", troopsReadyForBattle=" + Arrays.toString(troopsReadyForBattle) +
					'}';
		}
	}

	static class Troop {
		int id;
		int owner;
		int from;
		int to;
		int count;
		int timeToTarget;

		public Troop(int id, int owner, int from, int to, int count, int timeToTarget) {
			this.id = id;
			this.from = from;
			this.to = to;
			this.owner = owner;
			this.count = count;
			this.timeToTarget = timeToTarget;
		}

		public Troop copy() {
			return new Troop(id, owner, from, to, count, timeToTarget);
		}

		@Override
		public boolean equals(Object obj) {
			if (obj == null) return false;

			Troop other = (Troop) obj;

			if (other.owner != owner) return false;
			if (other.count != count) return false;
			if (other.timeToTarget != timeToTarget) return false;

			return true;
		}

		@Override
		public String toString() {
			return "Troop{" +
					"id=" + id +
					", owner=" + owner +
					", from=" + from +
					", to=" + to +
					", count=" + count +
					", timeToTarget=" + timeToTarget +
					'}';
		}
	}

	static class Bomb {
		int id;
		int owner;
		int from;
		int to;
		int timeToTarget;

		Bomb(int id, int owner, int from, int to, int timeToTarget) {
			this.id = id;
			this.owner = owner;
			this.from = from;
			this.to = to;
			this.timeToTarget = timeToTarget;
		}

		Bomb copy() {
			return new Bomb(id, owner, from, to, timeToTarget);
		}

		@Override
		public boolean equals(Object obj) {
			if (obj == null) return false;

			Bomb other = (Bomb) obj;
			if (owner != other.owner) return false;
			if (from != other.from) return false;
			if (to != other.to) return false;
			if (timeToTarget != other.timeToTarget) return false;

			return true;
		}

		@Override
		public String toString() {
			return "Bomb{" +
					"id=" + id +
					", owner=" + owner +
					", from=" + from +
					", to=" + to +
					", timeToTarget=" + timeToTarget +
					'}';
		}
	}


	static abstract class Action {
		abstract String output();
	}

	static class MoveAction extends Action {
		int source;
		int destination;
		int cyborgCount;

		public MoveAction(int source, int destination, int cyborgCount) {
			this.source = source;
			this.destination = destination;
			this.cyborgCount = cyborgCount;
		}

		@Override
		public boolean equals(Object o) {
			if (this == o) return true;
			if (o == null || getClass() != o.getClass()) return false;
			MoveAction that = (MoveAction) o;
			return source == that.source &&
					destination == that.destination &&
					cyborgCount == that.cyborgCount;
		}

		@Override
		public int hashCode() {
			return Objects.hash(source, destination, cyborgCount);
		}

		@Override
		String output() {
			return "MOVE " + source + " " + destination + " " + cyborgCount;
		}

		@Override
		public String toString() {
			return "MoveAction{" +
					"source=" + source +
					", destination=" + destination +
					", cyborgCount=" + cyborgCount +
					'}';
		}
	}

	static class WaitAction extends Action {

		@Override
		String output() {
			return "WAIT";
		}

		@Override
		public String toString() {
			return "WaitAction{}";
		}
	}

	static class DefendAction extends Action {

		int source;
		int cyborgCount;

		public DefendAction(int source, int cyborgCount) {
			this.source = source;
			this.cyborgCount = cyborgCount;
		}

		@Override
		String output() {
			return "WAIT";
		}

		@Override
		public String toString() {
			return "DefendAction{" +
					"source=" + source +
					", cyborgCount=" + cyborgCount +
					'}';
		}
	}

	static class BombAction extends Action {
		int source;
		int destination;

		public BombAction(int source, int destination) {
			this.source = source;
			this.destination = destination;
		}

		@Override
		String output() {
			return "BOMB " + source + " " + destination;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj == null) return false;
			if (!(obj instanceof BombAction)) return false;

			BombAction other = (BombAction) obj;

			if (other.source != source) return false;
			if (other.destination != destination) return false;

			return true;
		}

		@Override
		public String toString() {
			return "BombAction{" +
					"source=" + source +
					", destination=" + destination +
					'}';
		}
	}

	static class IncreaseAction extends Action {
		int source;

		public IncreaseAction(int source) {
			this.source = source;
		}

		@Override
		String output() {
			return "INC " + source;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj == null) return false;
			if (!(obj instanceof IncreaseAction)) return false;

			IncreaseAction other = (IncreaseAction) obj;

			if (other.source != source) return false;

			return true;
		}

		@Override
		public String toString() {
			return "IncreaseAction{" +
					"source=" + source +
					'}';
		}
	}

	static class GameEngine {

		public static int nbApplyAction;

		public static GameState applyActions(GameState gs, List<Action> actions, List<Action> oppActions, int activePlayer) {
			gs = gs.copy();
			for (Factory factory : gs.factories) {
				for (Troop troop : factory.incomingTroops) {
					troop.timeToTarget--;
				}
				factory.bombCountdown--;
			}
			for (Bomb bomb : gs.incomingBombs) {
				bomb.timeToTarget--;
			}

			applyUserActions(gs, oppActions, -activePlayer);
			boolean valid = applyUserActions(gs, actions, activePlayer);
			if (!valid) return null;

			for (Factory factory : gs.factories) {
				if (factory.owner != 0 && factory.bombCountdown <= 0) {
					factory.cyborgCount += factory.production;
				}
				factory.troopsReadyForBattle[1 + factory.owner] = factory.cyborgCount;

				for (Iterator<Troop> iterator = factory.incomingTroops.iterator(); iterator.hasNext(); ) {
					Troop troop = iterator.next();
					if (troop.timeToTarget > 0) continue;

					factory.troopsReadyForBattle[1 + troop.owner] += troop.count;
					iterator.remove();
				}
			}

			for (Factory factory : gs.factories) {
				resolveBattleAt(factory);
			}

			for (Iterator<Bomb> iterator = gs.incomingBombs.iterator(); iterator.hasNext(); ) {
				Bomb bomb = iterator.next();
				if (bomb.timeToTarget == 0) {
					explodeBomb(gs, bomb);
					iterator.remove();
				}
			}

			return gs;
		}

		private static boolean applyUserActions(GameState gs, List<Action> actions, int owner) {
			boolean valid = true;
			for (Action action : actions) {
				valid &= applyAction(gs, action, owner);
			}
			return valid;
		}

		private static boolean applyAction(GameState gs, Action action, int owner) {
			if (action instanceof WaitAction || action instanceof DefendAction) {
				// Do nothing
			}
			else if (action instanceof MoveAction) {
				MoveAction move = (MoveAction) action;
				Factory source = gs.findFactory(move.source);
				if (source.owner != owner) {
					return false;
				}
				Factory destination = gs.findFactory(move.destination);
				int movedCyborgs = move.cyborgCount > source.cyborgCount ? source.cyborgCount : move.cyborgCount;
				if (movedCyborgs > 0) {
					source.cyborgCount -= movedCyborgs;
					destination.addIncomingTroop(-1, owner, source.id, destination.id, movedCyborgs, GameState.distances[move.source][move.destination]);
				}
			}
			else if (action instanceof BombAction) {
				BombAction bomb = (BombAction) action;
				gs.incomingBombs.add(new Bomb(-1, owner, bomb.source, bomb.destination, gs.distances[bomb.source][bomb.destination]));
				gs.bombsLeft[Math.max(0, owner)]--;
			}
			else if (action instanceof IncreaseAction) {
				IncreaseAction inc = (IncreaseAction) action;
				Factory factory = gs.findFactory(inc.source);
				if (factory.cyborgCount < 10 || factory.production == 3) {
					return true;
				}
				factory.cyborgCount -= 10;
				factory.production = factory.production + 1;
			}
			else {
				throw new IllegalArgumentException("Invalid action: " + action);
			}
			nbApplyAction++;
			return true;
		}

		private static void explodeBomb(GameState gs, Bomb bomb) {
			Factory factory = gs.findFactory(bomb.to);
			double deaths = Math.max(10, Math.floor(factory.cyborgCount / 2));
			factory.cyborgCount = (int) Math.max(0, factory.cyborgCount - deaths);
			factory.bombCountdown = 5;
		}

		public static void resolveBattleAt(Factory factory) {
			int units = Math.min(factory.troopsReadyForBattle[0], factory.troopsReadyForBattle[2]);
			factory.troopsReadyForBattle[0] -= units;
			factory.troopsReadyForBattle[2] -= units;

			int maxUnits = 0;
			int previousMax = 0;
			int futureOwner = factory.owner;
			for (int i = 0; i <= 2; i++) {
				if (factory.troopsReadyForBattle[i] <= 0) continue;

				if (factory.troopsReadyForBattle[i] > maxUnits) {
					previousMax = maxUnits;
					maxUnits = factory.troopsReadyForBattle[i];
					futureOwner = i - 1;
				}
				else if (factory.troopsReadyForBattle[i] == maxUnits && factory.owner == i - 1) {
					previousMax = maxUnits;
					futureOwner = i - 1;
				}
				else if (factory.troopsReadyForBattle[i] <= maxUnits) {
					previousMax = factory.troopsReadyForBattle[i];
				}
			}

			factory.owner = futureOwner;
			factory.cyborgCount = factory.troopsReadyForBattle[factory.owner + 1] - previousMax;
		}

		public static List<Action> consolidateActions(List<Action> actions) {
			List<Action> consolidated = new ArrayList<>();
			for (Iterator<Action> iterator = actions.iterator(); iterator.hasNext(); ) {
				Action action = iterator.next();
				consolidate(action, consolidated);
			}
			return consolidated;
		}

		private static void consolidate(Action newAction, List<Action> consolidated) {
			for (Action action : consolidated) {
				if (newAction instanceof MoveAction && action instanceof MoveAction) {
					if (consolidateMoveAction((MoveAction) newAction, (MoveAction) action, consolidated)) return;
				}
				else if (newAction instanceof BombAction && action instanceof BombAction) {
					if (consolidateBombAction((BombAction) newAction, (BombAction) action, consolidated)) return;
				}
			}
			consolidated.add(newAction);
		}

		private static boolean consolidateMoveAction(MoveAction newAction, MoveAction action, List<Action> consolidated) {
			if (newAction.source == action.source && newAction.destination == action.destination) {
				action.cyborgCount += newAction.cyborgCount;
				return true;
			}
			return false;
		}

		private static boolean consolidateBombAction(BombAction newAction, BombAction action, List<Action> consolidated) {
			if (newAction.source == action.source && newAction.destination == action.destination) {
				return true;
			}
			return false;
		}
	}

	static class InputReader {

		static void initFactories(Scanner in) {
			int factoryCount = in.nextInt();
			int linkCount = in.nextInt();

			GameState.distances = new int[factoryCount][factoryCount];
			for (int i = 0; i < factoryCount; i++) {
				for (int j = 0; j < factoryCount; j++) {
					GameState.distances[i][j] = -1;
				}
			}

			for (int i = 0; i < linkCount; i++) {
				int factory1Id = in.nextInt();
				int factory2Id = in.nextInt();
				int distance = in.nextInt();

				GameState.distances[factory1Id][factory2Id] = distance;
				GameState.distances[factory2Id][factory1Id] = distance;
			}
		}

		static GameState initGameState(Scanner in) {
			int entityCount = in.nextInt();
			Timer.startTurn();
			Logger.log("Turn start");

			GameState gs = new GameState(GameState.distances.length);

			for (int i = 0; i < entityCount; i++) {
				int entityId = in.nextInt();
				String entityType = in.next();

				int arg1 = in.nextInt();
				int arg2 = in.nextInt();
				int arg3 = in.nextInt();
				int arg4 = in.nextInt();
				int arg5 = in.nextInt();

				if ("FACTORY".equals(entityType)) {
					gs.factories[entityId] = new Factory(entityId, arg1, arg2, arg3);
				}
				else if ("TROOP".equals(entityType)) {
					gs.factories[arg3].incomingTroops.add(new Troop(entityId, arg1, arg2, arg3, arg4, arg5));
				}
				else if ("BOMB".equals(entityType)) {
					gs.incomingBombs.add(new Bomb(entityId, arg1, arg2, arg3, arg4));
				}
				else {
					throw new IllegalArgumentException("Invalid entity type! " + entityType);
				}
			}
			return gs;
		}
	}

	static class GameAssertions {

		public static void assertGameState(GameState computedGameState, GameState gsFromInput) {
			if (computedGameState.factories.length != gsFromInput.factories.length) {
				throw new IllegalArgumentException("Factory length doesn't match: " + computedGameState.factories.length + " // " + gsFromInput.factories.length);
			}
			for (int i = 0; i < gsFromInput.factories.length; i++) {
				if (!computedGameState.factories[i].equals(gsFromInput.factories[i])) {
					throw new IllegalArgumentException("Factories don't match (computed / fromInput): " + computedGameState.factories[i] + " // " + gsFromInput.factories[i]);
				}
			}
			if (!computedGameState.incomingBombs.equals(gsFromInput.incomingBombs)) {
				throw new IllegalArgumentException(
						"Incoming bombs don't match: " + computedGameState.incomingBombs + " // " + gsFromInput.incomingBombs +
								" // " + computedGameState.bombsLeft + " // " + gsFromInput.bombsLeft);
			}
		}
	}

	static class RandomAccessors {

		static Random rnd = new Random();

		static Factory getRandomCapableFactory(GameState gs, int activePlayer) {
			List<Factory> factories =
					Arrays.stream(gs.factories)
							.filter(f -> f.owner == activePlayer)
							.filter(f -> f.cyborgCount > 0)
							.collect(Collectors.toList());
			Factory factory = factories.get(rnd.nextInt(factories.size()));
			return factory;
		}

		static Factory getRandomTargetFactory(GameState gs, Factory source, int activePlayer) {
			List<Factory> factories =
					Arrays.stream(gs.factories)
							.filter(f -> f.id != source.id)
							.collect(Collectors.toList());
			Factory factory = factories.get(rnd.nextInt(factories.size()));
			return factory;
		}

		static Factory getRandomOpponentFactory(GameState gs, int activePlayer) {
			return getRandomFactory(gs, -activePlayer);
		}

		public static Factory getRandomFactory(GameState gs, int activePlayer) {
			List<Factory> factories = Arrays.stream(gs.factories).filter(f -> activePlayer == -2 || f.owner == activePlayer).collect(Collectors.toList());
			int bound = factories.size();
			if (bound == 0) {
				if (activePlayer == 0) {
					return getRandomFactory(gs, -2);
				}
				return getRandomFactory(gs, 0);
			}
			Factory factory = factories.get(rnd.nextInt(bound));
			return factory;
		}

		public static Factory getOpponentRandomFactoryExcluding(GameState gs, List<Integer> moveDestinations, int activePlayer) {
			List<Factory> factories = Arrays.stream(gs.factories)
					.filter(f -> f.owner == -activePlayer)
					.filter(f -> !moveDestinations.contains(f.id))
					.collect(Collectors.toList());
			int bound = factories.size();
			if (bound == 0) {
				return getRandomOpponentFactory(gs, activePlayer);
			}
			Factory factory = factories.get(rnd.nextInt(bound));
			return factory;
		}

		public static Factory getRandomTargetFactoryExcludingWithMaxDistance(GameState gs, Factory source, int owner, List<Integer> bombDestinations, int maxDistance) {
			List<Factory> factories =
					Arrays.stream(gs.factories)
							.filter(f -> f.id != source.id)
							.filter(f -> GameState.distances[source.id][f.id] < maxDistance)
							.filter(f -> owner == 0 || f.owner == owner)
							.filter(f -> !bombDestinations.contains(f.id))
							.collect(Collectors.toList());
			int bound = factories.size();
			if (bound == 0) {
				return getRandomTargetFactoryExcludingWithMaxDistance(gs, source, 0, bombDestinations, maxDistance);
			}
			Factory factory = factories.get(rnd.nextInt(bound));
			return factory;
		}
	}

	static class Timer {
		static final int maxRoundTime = 50;
		static final int maxFirstRoundTime = 980;
		static final int maxOpponentTime = 4;
		static final int maxCarryOverTime = 10;
		static final int maxFirstRoundOpponentTime = 100;
		static final int roundTimeMargin = 6;
		static final int maxRoundTimeWithMargin = maxRoundTime - roundTimeMargin;
		static final int maxFirstRoundTimeWithMargin = maxFirstRoundTime - roundTimeMargin;

		static long roundStartTime;

		public static void startTurn() {
			roundStartTime = System.currentTimeMillis();
		}

		public static long elapsed() {
			return System.currentTimeMillis() - roundStartTime;
		}

		public static boolean isTimeLeft() {
			if (Player.firstTurn) {
				return getRoundDuration() < maxFirstRoundTimeWithMargin;
			}
			return getRoundDuration() < maxRoundTimeWithMargin;
		}

		static long getRoundDuration() {
			return System.currentTimeMillis() - roundStartTime;
		}

		public static boolean isOpponentSimulationTimeLeft() {
			if (Player.firstTurn) {
				return getRoundDuration() < maxFirstRoundOpponentTime;
			}
			return getRoundDuration() < maxOpponentTime;
		}

		public static boolean isCarryOverTimeLeft() {
			return getRoundDuration() < maxCarryOverTime;
		}
	}

	static class Logger {

		public static void log(String s) {
			System.err.println(Timer.elapsed() + ": " + s);
		}
	}

	static class MagicNumbers {
		static int SIMULATION_DEPTH = 8;

		static double PATIENCE = 0.8;

		static double ODDS_BOMB = 0.1;
		static double THRESHOLD_ODDS_INC = 0.3;
		static double THRESHOLD_ODDS_MOVE = 0.8;
		static double ODDS_MOVE_OPP = 0.4;
		static double ODDS_MOVE_TO_KILL = 0.2;
		static double THRESHOLD_ODDS_DEFEND = 1;

		static int SCORE_ETA_THRESHOLD = 5;

		static double SCORE_CYBORGS = 1;
		static double SCORE_PRODUCTION = 10;
		static double SCORE_TROOP_ETA = 1000;

		static int MAX_MOVE_DISTANCE = 5;
	}

	static class Solution {
		double score;
		List<List<Action>> actions;
		GameState originalGS;

		Solution() {
			actions = new ArrayList<>();
		}

		@Override
		public String toString() {
			return "Solution{" +
					"score=" + score +
					", actions=" + actions +
					'}';
		}
	}

	interface ScoreEvaluation {
		double getGameStateScore(GameState copy, int turn, int activePlayer);
	}

	static class BasicScoreEvaluation implements ScoreEvaluation {

		@Override
		public double getGameStateScore(GameState gs, int turn, int activePlayer) {
			if (gs.factories(-1) == 0 && gs.cyborgs(-activePlayer) == 0) return 100_000;
			if (gs.factories(1) == 0 && gs.cyborgs(activePlayer) == 0) return -100_000;

			double productionScore =
					MagicNumbers.SCORE_PRODUCTION *
							Math.pow(MagicNumbers.PATIENCE, turn) *
							(gs.cyborgProduction(activePlayer) - gs.cyborgProduction(-activePlayer));

			double cyborgsScore =
					MagicNumbers.SCORE_CYBORGS *
							Math.pow(MagicNumbers.PATIENCE, turn) *
							(gs.cyborgs(activePlayer) - gs.cyborgs(-activePlayer));

			int movementScore = 0;
			for (Factory factory : gs.factories) {
				for (Troop troop : factory.incomingTroops) {
					if (troop.owner == activePlayer && troop.timeToTarget > MagicNumbers.SCORE_ETA_THRESHOLD) {
						movementScore -= MagicNumbers.SCORE_TROOP_ETA * (troop.timeToTarget - MagicNumbers.SCORE_ETA_THRESHOLD);
					}
				}
			}
			return productionScore + cyborgsScore;
		}
	}

	interface AI {
		List<Action> compute(GameState gs);

		Solution buildRandomSolution(GameState gs, List<List<Action>> opponentActions, ScoreEvaluation eval);
	}

	static class ProdAI implements AI {

		int owner;

		public ProdAI(int owner) {
			this.owner = owner;
		}

		@Override
		public List<Action> compute(GameState gs) {
			return null;
		}

		@Override
		public Solution buildRandomSolution(GameState gs, List<List<Action>> oppActions, ScoreEvaluation eval) {
			Solution solution = new Solution();

			GameState copy = gs.copy();

			for (int i = 0; i < MagicNumbers.SIMULATION_DEPTH; i++) {
				List<Action> actions = buildRandomActions(copy);
				solution.actions.add(actions);

				copy = GameEngine.applyActions(copy, actions, oppActions.size() <= i ? new ArrayList<>() : oppActions.get(i), owner);

				double turnScore = eval.getGameStateScore(copy, i, owner);
				solution.score += turnScore;
			}

			return solution;
		}

		public List<Action> buildRandomActions(GameState gs) {
			List<Action> actions = new ArrayList<>();
			for (Factory factory : gs.factories) {
				if (factory.owner == 0 && factory.production > 0) {
					Factory source = RandomAccessors.getRandomFactory(gs, owner);
					actions.add(new MoveAction(source.id, factory.id, Math.min(source.cyborgCount, factory.cyborgCount + 1)));
					break;
				}
			}
			if (actions.isEmpty()) {
				for (Factory factory : gs.factories) {
					if (factory.owner ==owner && factory.production > 0) {
						Factory source = RandomAccessors.getRandomFactory(gs, owner);
						actions.add(new MoveAction(source.id, factory.id, Math.min(source.cyborgCount, factory.cyborgCount + 1)));
						break;
					}
				}
			}
			actions.add(new WaitAction());
			return actions;
		}
	}

	static class RandomAI implements AI {

		static final Random rnd = new Random();

		int activePlayer = 1;
		ScoreEvaluation eval;

		AI opAI;

		List<Integer> moveDestinations = new ArrayList<>();
		List<Integer> bombDestinations = new ArrayList<>();

		Solution previousBestSolution = null;

		public RandomAI(ScoreEvaluation eval, AI opAI) {
			this.eval = eval;
			this.opAI = opAI;
		}

		@Override
		public List<Action> compute(GameState gs) {
			GameEngine.nbApplyAction = 0;

			Solution currentSolution;
			Solution bestSolution = null;

			Solution oppCurrentSolution;
			Solution oppBestSolution = null;

			int nbFullIterations = 0;
			activePlayer = -1;
			if (opAI != null) {
				Logger.log("Starting opponent sim");
				while (Timer.isOpponentSimulationTimeLeft()) {
					oppCurrentSolution = opAI.buildRandomSolution(gs, new ArrayList<>(), eval);

					if (oppBestSolution == null || oppCurrentSolution.score > oppBestSolution.score) {
						oppBestSolution = oppCurrentSolution;
					}

					nbFullIterations++;
				}
			}

			activePlayer = 1;
			if (previousBestSolution != null) {
				while (Timer.isCarryOverTimeLeft()) {
					currentSolution = new Solution();
					for (int i = 1; i < previousBestSolution.actions.size(); i++) {
                        currentSolution.actions.add(previousBestSolution.actions.get(i));
                    }
                    GameState copy = gs.copy();
                    currentSolution.originalGS = copy;
                    List<Action> actions = buildRandomActions(copy);
					currentSolution.actions.add(actions);

					for (int i = 0; i < previousBestSolution.actions.size(); i++) {
                        copy = GameEngine.applyActions(copy, actions,
                                oppBestSolution.actions.size() <= MagicNumbers.SIMULATION_DEPTH ? new ArrayList<>() : oppBestSolution.actions.get(MagicNumbers.SIMULATION_DEPTH),
                                activePlayer);

                        if (copy == null) {
                            currentSolution.score = -1_000_000;
                            break;
                        }
                        else {
                            double turnScore = eval.getGameStateScore(copy, i, activePlayer);
                            currentSolution.score += turnScore;
                        }
                    }

                    if (bestSolution == null || currentSolution.score > bestSolution.score) {
                        bestSolution = currentSolution;
                    }
				}
			}
			while (Timer.isTimeLeft()) {
				currentSolution = buildRandomSolution(gs, oppBestSolution.actions, eval);
				currentSolution.originalGS = gs;

				if (bestSolution == null || currentSolution.score > bestSolution.score) {
					bestSolution = currentSolution;
				}

				nbFullIterations++;
			}

			previousBestSolution = bestSolution;

			return bestSolution.actions.get(0);
		}

		@Override
		public Solution buildRandomSolution(GameState gs, List<List<Action>> oppActions, ScoreEvaluation eval) {
			Solution solution = new Solution();

			GameState copy = gs.copy();

			for (int i = 0; i < MagicNumbers.SIMULATION_DEPTH; i++) {
				List<Action> actions = buildRandomActions(copy);
				solution.actions.add(actions);

				copy = GameEngine.applyActions(copy, actions, oppActions.size() <= i ? new ArrayList<>() : oppActions.get(i), activePlayer);

				double turnScore = eval.getGameStateScore(copy, i, activePlayer);
				solution.score += turnScore;
			}

			return solution;
		}

		public List<Action> buildRandomActions(GameState gs) {
			List<Action> randomActions = new ArrayList<>();
			int bombsLeft = gs.bombsLeft[Math.max(0, activePlayer)];

			for (Factory factory : gs.factories) {
				if (factory.owner != activePlayer) continue;

				moveDestinations.clear();
				bombDestinations.clear();

				int cyborgsLeft = factory.cyborgCount + factory.production;

				while (cyborgsLeft > 0) {
					double random = rnd.nextDouble();
					if (bombsLeft > 0 && random < MagicNumbers.ODDS_BOMB) {
						Factory destination = RandomAccessors.getOpponentRandomFactoryExcluding(gs, moveDestinations, activePlayer);
						if (destination.production >= 2 && !gs.hasIncomingBomb(destination.id)) {
							bombDestinations.add(destination.id);

							bombsLeft--;

							BombAction action = new BombAction(factory.id, destination.id);
							randomActions.add(action);
						}
					}

					if (cyborgsLeft > 10 && random < MagicNumbers.THRESHOLD_ODDS_INC) {
						cyborgsLeft -= 10;

						randomActions.add(new IncreaseAction(factory.id));
					}
					else if (random < MagicNumbers.THRESHOLD_ODDS_MOVE) {
						Factory destination;
						int cyborgCount = 1 + rnd.nextInt(cyborgsLeft);
						if (random < MagicNumbers.ODDS_MOVE_OPP) {
							destination = RandomAccessors.getRandomTargetFactoryExcludingWithMaxDistance(gs, factory, activePlayer, bombDestinations, MagicNumbers.MAX_MOVE_DISTANCE);
							if (random < MagicNumbers.ODDS_MOVE_TO_KILL) {
								cyborgCount = Math.min(cyborgsLeft, destination.cyborgCount + 1);
							}
						}
						else {
							destination = RandomAccessors.getRandomTargetFactoryExcludingWithMaxDistance(gs, factory, -activePlayer, bombDestinations, MagicNumbers.MAX_MOVE_DISTANCE);
						}

						cyborgsLeft -= cyborgCount;
						moveDestinations.add(destination.id);

						randomActions.add(new MoveAction(factory.id, destination.id, cyborgCount));
					}
					else if (random < MagicNumbers.THRESHOLD_ODDS_DEFEND) {
						int cyborgCount = 1 + rnd.nextInt(cyborgsLeft);

						randomActions.add(new DefendAction(factory.id, cyborgCount));
					}
				}
			}

			if (randomActions.isEmpty()) {
				randomActions.add(new WaitAction());
			}

			return randomActions;
		}

	}
}
