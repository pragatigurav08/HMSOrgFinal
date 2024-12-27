public class ApplyingFilters {
	 @AuraEnabled
    public static List<New_Account__c> getAccountFilter(String recordTypeId,String Phoneno,String PanCardno,String AadharNo) {
        String query = 'SELECT Id, Name, RecordType.Name,PANCardNo__c,Aadhar_Number__c,FirstName__c,Last_Name__c,Phone_number__c FROM New_Account__c WHERE RecordTypeId = :recordTypeId  OR Phone_number__c =:Phoneno OR PANCardNo__c =: PanCardno  OR Aadhar_Number__c =:AadharNo' ;
        return Database.query(query);
    }
	@AuraEnabled
public static List<Insurance_Policy__c> getInsuranceFilter(String recordTypeId, String phoneno, String claimable, String policyEndDate) {
    // Initialize a list to build filter conditions dynamically
    List<String> filters = new List<String>();

    // Check and add each filter condition
    if (recordTypeId != null && recordTypeId != '') {
        filters.add('RecordTypeId = :recordTypeId');
    }
    if (claimable != null && claimable.toLowerCase() == 'true') {
        filters.add('Claimable__c = TRUE'); // Ensure Claimable__c is a boolean field in Salesforce
    }
    if (policyEndDate != null && policyEndDate != '') {
        filters.add('Policy_End_Date__c = :policyEndDate');
    }

    // Construct the final query string
    String query = 'SELECT Id, Name, Policy_End_Date__c, RecordType.Name FROM Insurance_Policy__c';
    if (!filters.isEmpty()) {
        query += ' WHERE ' + String.join(filters, ' AND ');
    }

    // Return the result of the dynamic SOQL query
    return Database.query(query);
}
@AuraEnabled
public static List<New_Account__c> getsearchaccounts(String searchAccountNumber) {
    String query = 'SELECT Id, Name,RecordType.Name,PANCardNo__c,Aadhar_Number__c,FirstName__c,Last_Name__c,Phone_number__c FROM New_Account__c';
    
    if (searchAccountNumber != null && searchAccountNumber.trim() != '') {
        searchAccountNumber = '%' + searchAccountNumber + '%';
        query += ' WHERE Name LIKE :searchAccountNumber LIMIT 10 ';
    }

    return Database.query(query);
}
@AuraEnabled
public static List<Insurance_Policy__c> getsearchinsurance(String searchInsuranceNumber) {
    String query = 'SELECT Id,Name,RecordType.Name,Policy_End_Date__c FROM Insurance_Policy__c';
    if (searchInsuranceNumber != null && searchInsuranceNumber.trim() != '') {
        searchInsuranceNumber = '%' + searchInsuranceNumber + '%';
        query += ' WHERE Name LIKE :searchInsuranceNumber LIMIT 10';
    }

    return Database.query(query);
}
@AuraEnabled
public static List<Loan__c> getsearchloan(String searchLoanNumber) {
    String query = 'SELECT Id,Name,CreatedDate,RecordType.Name,Annual_Income__c FROM Loan__c';
    
    if (searchLoanNumber != null && searchLoanNumber.trim() != '') {
        searchLoanNumber = '%' + searchLoanNumber + '%';
        query += ' WHERE Name LIKE :searchLoanNumber LIMIT 10';
    }

    return Database.query(query);
}

}