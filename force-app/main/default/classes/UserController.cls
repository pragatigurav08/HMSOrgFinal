public with sharing class UserController {
   




    @AuraEnabled(cacheable=true)
    public static Map<String, List<User>> getUsers() {
        // Define time frame for "new" users (past 2 months)
        Date twoMonthsAgo = Date.today().addMonths(-2);

        // Query all users
        List<User> allUsers = [SELECT Id, LastName, Email, CreatedDate FROM User];

        // Separate new and existing users
        List<User> newUsers = new List<User>();
        List<User> existingUsers = new List<User>();

        for (User user : allUsers) {
            if (user.CreatedDate >= twoMonthsAgo) {
                newUsers.add(user); // Joined within the last 2 months
            } else {
                existingUsers.add(user); // Joined more than 2 months ago
            }
        }

        // Return as a map for convenience
        return new Map<String, List<User>> {
            'newUsers' => newUsers,
            'existingUsers' => existingUsers
        };
    }
}