public class LoginChecker {

    private String correctPassword;

    public LoginChecker(String correctPassword) {
        this.correctPassword = correctPassword;
    }
    
    public boolean checkPassword(String input){
        return this.correctPassword.equals(input);
    }

    public static void main(String[] args) {
        LoginChecker checker = new LoginChecker("hunter2");

        String direct = "hunter2";
        String fromInput = new String("hunter2");

        System.out.println("direct login: " + checker.checkPassword(direct));
        System.out.println("fromInput login: " + checker.checkPassword(fromInput));
    }
}
