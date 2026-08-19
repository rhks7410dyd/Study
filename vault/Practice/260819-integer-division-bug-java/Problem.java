import java.util.List;
import java.util.Arrays;

public class ScoreBoard {

    public static double average(List<Integer> scores) {
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        return sum / scores.size();
    }

    public static void main(String[] args) {
        List<Integer> scores = Arrays.asList(90, 80, 70);
        System.out.println("average: " + average(scores));
        // 기대: average: 80.0
        // 실제: ?
    }
}
