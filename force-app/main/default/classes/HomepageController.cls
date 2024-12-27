public with sharing class HomepageController{
    @AuraEnabled(cacheable = true)
    public static List<New_Account__c> getRecentlyViewedAccounts(){
        // Query to get recently viewed New_Account__c records, ordered by LastViewedDate, limited to 10 records
        return [SELECT Id, Name, RecordType.Name, PANCardNo__c, Aadhar_Number__c, FirstName__c, Last_Name__c, Phone_number__c
                FROM New_Account__c
                ORDER BY LastViewedDate DESC
                LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Integer> PieChartgetRecordCounts(){
        Map<String, Integer> recordCounts = new Map<String, Integer>();
        recordCounts.put('Accounts', [SELECT Count()
                                      FROM New_Account__c]);
        // recordCounts.put('Contacts', [SELECT Count() FROM Contact ]);
        recordCounts.put('Insurances', [SELECT Count()
                                        FROM Insurance_Policy__c]);
        recordCounts.put('Loans', [SELECT Count()
                                   FROM Loan__c]);
        return recordCounts;
    }

    @AuraEnabled(cacheable = true)
    public static Integer getCurrentMonthAccountOpenings(){
        // Get the current year and month
        Integer currentYear = Date.today().year();
        Integer currentMonth = Date.today().month();

        // Query to count the number of accounts created in the current month
        AggregateResult[] results = [SELECT COUNT(Id)total
                                     FROM New_Account__c
                                     WHERE CALENDAR_YEAR(CreatedDate) = :currentYear AND CALENDAR_MONTH(CreatedDate) = :currentMonth];

        if (!results.isEmpty()){
            return (Integer) results[0].get('total');
        }

        return 0;
    }

    @AuraEnabled(cacheable = true)
    public static Integer getCurrentMonthInsuranceOpenings(){
        // Get the current year and month
        Integer currentYear = Date.today().year();
        Integer currentMonth = Date.today().month();

        // Query to count the number of accounts created in the current month
        AggregateResult[] results = [SELECT COUNT(Id)total
                                     FROM Insurance_Policy__c
                                     WHERE CALENDAR_YEAR(CreatedDate) = :currentYear AND CALENDAR_MONTH(CreatedDate) = :currentMonth];

        if (!results.isEmpty()){
            return (Integer) results[0].get('total');
        }

        return 0; // Return 0 if no records are found
    }

    @AuraEnabled(cacheable = true)
    public static Integer getCurrentMonthLoanOpenings(){
        // Get the current year and month
        Integer currentYear = Date.today().year();
        Integer currentMonth = Date.today().month();

        // Query to count the number of accounts created in the current month
        AggregateResult[] results = [SELECT COUNT(Id)total
                                     FROM Loan__c
                                     WHERE CALENDAR_YEAR(CreatedDate) = :currentYear AND CALENDAR_MONTH(CreatedDate) = :currentMonth];

        if (!results.isEmpty()){
            return (Integer) results[0].get('total');
        }

        return 0; // Return 0 if no records are found
    }

    @AuraEnabled(cacheable = true)
    public static List<Loan__c> getRecentlyViewedLoans(){
        // Query to get recently viewed New_Account__c records, ordered by LastViewedDate, limited to 10 records
        return [SELECT Id, Name, CreatedDate, Loan_Type__c, Annual_Income__c
                FROM Loan__c
                ORDER BY LastViewedDate DESC
                LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Integer> getRecordCountsTotal(){
        Map<String, Integer> recordCounts = new Map<String, Integer>();
        recordCounts.put('Accounts', [SELECT Count()
                                      FROM New_Account__c]);
        recordCounts.put('Insurances', [SELECT Count()
                                        FROM Insurance_Policy__c]);
        recordCounts.put('Loans', [SELECT Count()
                                   FROM Loan__c]);
        return recordCounts;
    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Integer> getRecordCountsWeek(){
        Map<String, Integer> recordCounts = new Map<String, Integer>();
        recordCounts.put('Accounts', [SELECT Count()
                                      FROM New_Account__c
                                      WHERE CreatedDate = LAST_N_DAYS:7]);
        recordCounts.put('Insurances', [SELECT Count()
                                        FROM Insurance_Policy__c
                                        WHERE CreatedDate = LAST_N_DAYS:7]);
        recordCounts.put('Loans', [SELECT Count()
                                   FROM Loan__c
                                   WHERE CreatedDate = LAST_N_DAYS:7]);
        return recordCounts;
    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Integer> getRecordCountsToday(){
        Map<String, Integer> recordCounts = new Map<String, Integer>();
        recordCounts.put('Accounts', [SELECT Count()
                                      FROM New_Account__c
                                      where CreatedDate = TODAY]);
        recordCounts.put('Insurances', [SELECT Count()
                                        FROM Insurance_Policy__c
                                        where CreatedDate = TODAY]);
        recordCounts.put('Loans', [SELECT Count()
                                   FROM Loan__c
                                   where CreatedDate = TODAY]);
        return recordCounts;
    }

    @AuraEnabled(cacheable = true)
    public static List<Wealth_Management__c> getRecentlyViewedWealth(){
        return [SELECT Id, Name, CreatedDate, New_Account__r.Name
                FROM Wealth_Management__c
                ORDER BY LastViewedDate DESC
                LIMIT 10];
    }

    @AuraEnabled(cacheable = true)
    public static List<Insurance_Policy__c> getRecentlyViewedInsurance(){
        return [SELECT Id, Name, CreatedDate, RecordType.Name, Policy_End_Date__c
                FROM Insurance_Policy__c
                ORDER BY LastViewedDate DESC
                LIMIT 10];
    }

    //    @AuraEnabled(cacheable=true)
    // public static Map<String, Object> getUserCount() {
    //     Map<String, Object> result = new Map<String, Object>();
    //     User loggedInUser = [SELECT Name,Profile.Name,Alias,Username FROM User WHERE Id = :UserInfo.getUserId()];
    //     String profileName = loggedInUser.Profile.Name;
    //     String EmployeeNo= loggedInUser.Alias;
    //     String Usernamme=loggedInUser.Username;
    //     Integer userCount = [SELECT COUNT() FROM User];
    //     result.put('loggedInUserName', loggedInUser.Name);
    //     result.put('userCount', userCount);
    //     result.put('isBankManager', profileName == 'System Administrator'); // Add a flag for the profile
    //     result.put('EmpID',EmployeeNo);
    //     result.put('UserName',Usernamme);
    //     return result;
    // }
    @AuraEnabled(cacheable = true)
    public static Map<String, Object> getUserCount(){
        Map<String, Object> result = new Map<String, Object>();

        // Fetch the current user's details
        //User loggedInUser = [SELECT Name, Alias, Username, ProfileId FROM User WHERE Id = :UserInfo.getUserId()];
        User loggedInUser = [SELECT Name, Alias, Username, ProfileId
                             FROM User
                             WHERE Id = :UserInfo.getUserId()
                             WITH SECURITY_ENFORCED];

        Profile userProfile = [SELECT Name
                               FROM Profile
                               WHERE Id = :loggedInUser.ProfileId];

        // Fetch the total user count
        Integer userCount = [SELECT COUNT()
                             FROM User];

        // Add details to the result map
        result.put('loggedInUserName', loggedInUser.Name);
        result.put('userCount', userCount);
        result.put('isBankManager', userProfile.Name == 'System Administrator'); // Add a flag for the profile
        result.put('EmpID', loggedInUser.Alias);
        result.put('UserName', loggedInUser.Username);

        return result;
    }

    @AuraEnabled(cacheable = true)
    public static String getUserLoginStatus(Id userId){
        // Get today's date
        Date today = Date.today();

        DateTime startOfDay = DateTime.newInstance(today, Time.newInstance(7, 0, 0, 0));  // Midnight
        DateTime endOfDay = DateTime.newInstance(today, Time.newInstance(23, 59, 59, 999));  // 11:59:59 PM

        // Query LoginHistory to get the latest login information for the specific user
        List<LoginHistory> loginHistoryyy = [SELECT LoginTime, UserId
                                             FROM LoginHistory
                                             WHERE UserId = :userId AND LoginTime >= :startOfDay AND LoginTime <= :endOfDay
                                             ORDER BY LoginTime DESC
                                             LIMIT 1];
        System.debug('login' + loginHistoryyy);
        System.debug('login' + loginHistoryyy.size());
        // Return status based on login history
        if (!loginHistoryyy.isEmpty()){
            // If the user logged in today, return 'green' (indicating active status)
            return 'green';  // Green icon (active)
        }

        // If the user hasn't logged in today, return 'red' (indicating inactive status)
        return 'red';  // Red icon (not logged in today)
    }

    @AuraEnabled(cacheable = true)
    public static String getProfileNameFromUserId(Id userId){
        // Query the user record to get the ProfileId
        User userRecord = [SELECT Profile.Name
                           FROM User
                           WHERE Id = :userId
                           LIMIT 1];

        // Return the Profile Name
        return userRecord.Profile.Name;
    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Integer> QuarterPieChartgetRecordCounts(Boolean isQuarter){
        Map<String, Integer> recordCounts = new Map<String, Integer>();

        Date startDate;
        Date endDate = Date.today();

        // Calculate the start date for the last 3 months (quarter)
        if (isQuarter){
            startDate = endDate.addMonths(-3);
        } else{
            startDate = Date.newInstance(2000, 1, 1);  // For "Total", we want all records
        }

        // Query for Accounts, Insurances, and Loans based on the date range
        Integer accountCount = [SELECT COUNT()
                                FROM New_Account__c
                                WHERE CreatedDate >= :startDate AND CreatedDate <= :endDate];
        Integer insuranceCount = [SELECT COUNT()
                                  FROM Insurance_Policy__c
                                  WHERE CreatedDate >= :startDate AND CreatedDate <= :endDate];
        Integer loanCount = [SELECT COUNT()
                             FROM Loan__c
                             WHERE CreatedDate >= :startDate AND CreatedDate <= :endDate];

        recordCounts.put('Accounts', accountCount);
        recordCounts.put('Insurances', insuranceCount);
        recordCounts.put('Loans', loanCount);

        return recordCounts;
    }

}