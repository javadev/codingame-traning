import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Stream;

class Solution {

    private static class MayanNumericalSystem {
        
        private static final int MAYAN_NUMERALS = 20;
        
        private final Map<String, Integer> mayanToDecimal;
        private final Map<Integer, String> decimalToMayan;

        private MayanNumericalSystem(Map<String, Integer> mayanToDecimal, Map<Integer, String> decimalToMayan) {
            this.mayanToDecimal = mayanToDecimal;
            this.decimalToMayan = decimalToMayan;
        }
        
        public String calculate(String operation, MayanNumber mayanNumber1, MayanNumber mayanNumber2) {
            switch (operation) {
                case "+": return toMayan(toDecimal(mayanNumber1) + toDecimal(mayanNumber2));
                case "-": return toMayan(toDecimal(mayanNumber1) - toDecimal(mayanNumber2));
                case "*": return toMayan(toDecimal(mayanNumber1) * toDecimal(mayanNumber2));
                case "/": return toMayan(toDecimal(mayanNumber1) / toDecimal(mayanNumber2));
                default: throw new IllegalArgumentException("There is no operation with that symbol.");
            }
        }

        public long toDecimal(MayanNumber mayanNumber) {
            long decimal = 0;
            for (int i = 0; i < mayanNumber.getSections().length; i++) {
                decimal += Math.pow(MAYAN_NUMERALS, mayanNumber.getSections().length - 1 - i) * mayanToDecimal.get(mayanNumber.getSections()[i]).intValue();
            }
            return decimal;
        }
        
        private String toMayan(long decimal) {
            
            long quotient = decimal;
            LinkedList<Integer> remainders = new LinkedList<>();
            while (quotient >= MAYAN_NUMERALS) {
                remainders.addFirst(Integer.valueOf((int) (quotient % MAYAN_NUMERALS)));
                quotient = quotient / MAYAN_NUMERALS;
            }
            remainders.addFirst((int) quotient);
            
            StringBuilder mayanBuilder = new StringBuilder();
            for (Integer remainder : remainders) {
                mayanBuilder.append(decimalToMayan.get(remainder)).append('\n');
            }
            mayanBuilder.setLength(mayanBuilder.length() - 1);
            
            return mayanBuilder.toString();
        }
        
        private static class Builder {
            
            private final StringBuilder[] numeralsBuilders;

            private Builder() {
                numeralsBuilders = Stream.generate(StringBuilder::new).limit(20).toArray(StringBuilder[]::new);
            }
            
            public void addRow(String numeralsRow, int widthOfEachNumeral) {
                for (int i = 0; i < numeralsRow.length(); i = i + widthOfEachNumeral) {
                    numeralsBuilders[i / widthOfEachNumeral].append(numeralsRow.substring(i, i + widthOfEachNumeral)).append('\n');
                }
            }
            
            public MayanNumericalSystem build() {
                Map<String, Integer> mayanToDecimal = new HashMap<>();
                Map<Integer, String> decimalToMayan = new HashMap<>();
                for (int i = 0; i < numeralsBuilders.length; i++) {
                    numeralsBuilders[i].setLength(numeralsBuilders[i].length() - 1);
                    mayanToDecimal.put(numeralsBuilders[i].toString(), Integer.valueOf(i));
                    decimalToMayan.put(Integer.valueOf(i), numeralsBuilders[i].toString());
                }
                return new MayanNumericalSystem(mayanToDecimal, decimalToMayan);
            }
            
        }
        
    }
    
    private static class MayanNumber {
        
        private final String[] sections;
        
        private MayanNumber(String[] sections) {
            this.sections = sections;
        }

        public String[] getSections() {
            return sections;
        }
        
        private static class Builder {
            
            private final StringBuilder[] sectionsBuilders;

            private Builder(int numberOfSections) {
                this.sectionsBuilders = Stream.generate(StringBuilder::new).limit(numberOfSections).toArray(StringBuilder[]::new);
            }
            
            public void addRow(String sectionRow, int sectionIndex) {
                sectionsBuilders[sectionIndex].append(sectionRow).append('\n');
            }
            
            public MayanNumber build() {
                Arrays.stream(sectionsBuilders).forEach(sectionBuilder -> sectionBuilder.setLength(sectionBuilder.length() - 1));
                return new MayanNumber(Arrays.stream(sectionsBuilders).map(StringBuilder::toString).toArray(String[]::new));
            }
            
        }
        
    }
    
    public static void main(String args[]) {
        
        Scanner in = new Scanner(System.in);
        int L = in.nextInt();
        int H = in.nextInt();
        
        MayanNumericalSystem.Builder mayanNumericalSystemBuilder = new MayanNumericalSystem.Builder();
        for (int i = 0; i < H; i++) {
            String numeral = in.next();
            mayanNumericalSystemBuilder.addRow(numeral, L);
        }
        MayanNumericalSystem mayanNumericalSystem = mayanNumericalSystemBuilder.build();
        
        int S1 = in.nextInt();
        MayanNumber.Builder mayanNumberBuilder1 = new MayanNumber.Builder(S1 / H);
        for (int i = 0; i < S1; i++) {
            String num1Line = in.next();
            mayanNumberBuilder1.addRow(num1Line, i / H);
        }
        MayanNumber mayanNumber1 = mayanNumberBuilder1.build();
        
        int S2 = in.nextInt();
        MayanNumber.Builder mayanNumberBuilder2 = new MayanNumber.Builder(S2 / H);
        for (int i = 0; i < S2; i++) {
            String num2Line = in.next();
            mayanNumberBuilder2.addRow(num2Line, i / H);
        }
        MayanNumber mayanNumber2 = mayanNumberBuilder2.build();
        
        String operation = in.next();

        System.out.println(mayanNumericalSystem.calculate(operation, mayanNumber1, mayanNumber2));
        
    }
    
}
