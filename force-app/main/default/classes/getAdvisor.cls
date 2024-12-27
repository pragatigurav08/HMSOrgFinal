public class getAdvisor {

@AuraEnabled(cacheable=true)
public static List<Map<String, String>> getAllAdvi(Id newAccountId) {
    // Fetch advisors assigned to the given account
    List<Advisor__c> assignedAdvisors = [
        SELECT Id 
        FROM Advisor__c 
        WHERE New_Account__c = :newAccountId
    ];
    
    // Check if there are assigned advisors
    Set<Id> assignedAdvisorIds = new Set<Id>();
    for (Advisor__c advisor : assignedAdvisors) {
        assignedAdvisorIds.add(advisor.Id);
    }

    // Fetch all advisors
    List<Advisor__c> advisors;
    if (assignedAdvisorIds.isEmpty()) {
        // If no advisors are assigned, fetch all advisors
        advisors = [
            SELECT Id, Advisor_Name__c, Specialization__c 
            FROM Advisor__c
        ];
    } else {
        // Fetch advisors not assigned to the account
        advisors = [
            SELECT Id, Advisor_Name__c, Specialization__c 
            FROM Advisor__c
            WHERE Id NOT IN :assignedAdvisorIds
        ];
    }

    // Prepare the result list
    List<Map<String, String>> result = new List<Map<String, String>>();
    for (Advisor__c advisor : advisors) {
        Map<String, String> advisorDetails = new Map<String, String>();
        advisorDetails.put('id', advisor.Id);
        advisorDetails.put('advisorName', advisor.Advisor_Name__c);
        advisorDetails.put('specialization', advisor.Specialization__c);
        result.add(advisorDetails);
    }

    return result;
}


// Method to assign an advisor to a New Account through Wealth Management
@AuraEnabled
public static void assignAdvisorToAccount(Id advisorId, Id newAccountId) {
    try {
        // Fetch the Advisor record and assign the New Account to it
        Advisor__c advisor = [
            SELECT Id, New_Account__c 
            FROM Advisor__c 
            WHERE Id = :advisorId 
            LIMIT 1
        ];

        // Set the New Account to the Advisor
        advisor.New_Account__c = newAccountId;

        // Update the Advisor record with the new New Account
        update advisor;

    } catch (DmlException e) {
        throw new AuraHandledException('Error assigning advisor: ' + e.getMessage());
    }
}



    @AuraEnabled(cacheable=true)
public static List<Map<String, String>> getAssignedAdvisors(Id newAccountId) {
    
    // Fetch advisors assigned to the New Account
    List<Advisor__c> assignedAdvisors = [
        SELECT Id, Advisor_Name__c, Specialization__c 
        FROM Advisor__c 
        WHERE New_Account__c = :newAccountId
    ];

    // Prepare the result list
    List<Map<String, String>> result = new List<Map<String, String>>();
    for (Advisor__c advisor : assignedAdvisors) {
        Map<String, String> advisorDetails = new Map<String, String>();
        advisorDetails.put('id', advisor.Id);
        advisorDetails.put('advisorName', advisor.Advisor_Name__c);
        advisorDetails.put('specialization', advisor.Specialization__c);
        result.add(advisorDetails);
    }

    return result;
}

}