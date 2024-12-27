public with sharing class EmployeeActivityController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<User>> getEmployeeActivity() {
        // Query all users (active and inactive)
        List<User> allUsers = [
            SELECT Id, LastName, IsActive 
            FROM User
        ];

        // Categorize users
        List<User> checkedInUsers = new List<User>();
        List<User> onLeaveUsers = new List<User>();

        for (User user : allUsers) {
            if (user.IsActive) {
                checkedInUsers.add(user); // Active users
            } else {
                onLeaveUsers.add(user); // Inactive users
            }
        }

        // Return the result as a map
        return new Map<String, List<User>> {
            'checkedInUsers' => checkedInUsers,
            'onLeaveUsers' => onLeaveUsers
        };
    }
}