import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

class Solution {
    
    private static final String NOBODY_WINS = "PAT";
    private static final String PLAYER_1_WIN = "1";
    private static final String PLAYER_2_WIN = "2";
    
    private static class Player {
        
        private final Queue<Card> cardsToPlay;
        private final Queue<Card> cardsAtStake;
        
        private Player(Queue<Card> cardsToPlay) {
            this.cardsToPlay = cardsToPlay;
            this.cardsAtStake = new LinkedList<>();
        }
        
        public boolean hasCardsToPlay() {
            return cardsToPlay.size() > 0;
        }
        
        public boolean hasEnoughCardsForWar() {
            return cardsToPlay.size() >= 4;
        }
        
        public Card playCard() {
            Card card = cardsToPlay.poll();
            cardsAtStake.offer(card);
            return card;
        }
        
        public void prepareForWar() {
            for (int i = 0; i < 3; i++) {
                playCard();
            }
        }
        
        public void collectWinningsFromPlayer(Player that) {
            while (!that.cardsAtStake.isEmpty()) {
                this.cardsToPlay.offer(that.cardsAtStake.poll());
            }
        }
        
        public void giveUp() {
            cardsToPlay.clear();
        }
        
    }
    
    private static class Card {
        
        private final int value;
        
        private Card(int value) {
            this.value = value;
        }
        
        public int getValue() {
            return value;
        }
                
        public static Card fromString(String valueAndSuit) {
            String value = valueAndSuit.substring(0, valueAndSuit.length() - 1);
            switch (value) {
                case "J": return new Card(11);
                case "Q": return new Card(12);
                case "K": return new Card(13);
                case "A": return new Card(14);
                default: return new Card(Integer.parseInt(value));
            }
        }
        
    }
    
    private static class GameEngine {
        
        private int rounds;
        private final Player player1;
        private final Player player2;
        
        private GameEngine(Player player1, Player player2) {
            this.player1 = player1;
            this.player2 = player2;
        }       
        
        public String play() {
            while (player1.hasCardsToPlay() && player2.hasCardsToPlay()) {
                playBattle();
                rounds++;
            }
            return getWinnerAndRounds();
        }
        
        private void playBattle() {
            Card player1Card = player1.playCard();
            Card player2Card = player2.playCard();
            fight(player1Card, player2Card);
        }
        
        private void fight(Card player1Card, Card player2Card) {
            if (player1Card.getValue() > player2Card.getValue()) {
                assignWinningsToPlayer(player1);
            } else if (player1Card.getValue() < player2Card.getValue()) {
                assignWinningsToPlayer(player2);
            } else {
                playWar();
            }
        }
        
        private void assignWinningsToPlayer(Player winner) {
            winner.collectWinningsFromPlayer(player1);
            winner.collectWinningsFromPlayer(player2);
        }
        
        private void playWar() {
            if (isWarDoable()) {
                prepareForWar();
                playBattle();
            } else {
                forceGameEnd();
            }
        }

        private boolean isWarDoable() {
            return player1.hasEnoughCardsForWar() && player2.hasEnoughCardsForWar();
        }
        
        private void prepareForWar() {
            player1.prepareForWar();
            player2.prepareForWar();
        }
        
        private void forceGameEnd() {
            player1.giveUp();
            player2.giveUp();
        }
        
        private String getWinnerAndRounds() {
            if (player1.hasCardsToPlay()) {
                return PLAYER_1_WIN + " " + rounds;
            } else if (player2.hasCardsToPlay()) {
                return PLAYER_2_WIN + " " + rounds;
            } else {
                return NOBODY_WINS;
            }
        }
        
    }
    
    public static void main(String args[]) {
        
        Scanner in = new Scanner(System.in);
        
        Queue<Card> player1CardsToPlay = new LinkedList<>();
        int n = in.nextInt(); // the number of cards for player 1
        for (int i = 0; i < n; i++) {
            String player2Card = in.next(); // the n cards of player 1
            player1CardsToPlay.offer(Card.fromString(player2Card));
        }
        
        Queue<Card> player2CardsToPlay = new LinkedList<>();
        int m = in.nextInt(); // the number of cards for player 2
        for (int i = 0; i < m; i++) {
            String player2Card = in.next(); // the m cards of player 2
            player2CardsToPlay.offer(Card.fromString(player2Card));
        }

        // Write an action using System.out.println()
        // To debug: System.err.println("Debug messages...");
        Player player1 = new Player(player1CardsToPlay);
        Player player2 = new Player(player2CardsToPlay);
        GameEngine gameEngine = new GameEngine(player1, player2);
        System.out.println(gameEngine.play());
    }
    
}
