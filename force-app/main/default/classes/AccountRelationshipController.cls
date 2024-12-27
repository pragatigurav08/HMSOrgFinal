public with sharing class AccountRelationshipController {
    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> getNewAccounts() {
        try {
            return [SELECT Id, Name, RecordType.Name,FirstName__c,Last_Name__c FROM New_Account__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving New Account records: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<New_Account__c> getApplyFilter(String recordTypeId,String Phoneno,String PanCardno,String AadharNo) {
        String query = 'SELECT Id, Name, RecordType.Name,PANCardNo__c,Aadhar_Number__c,FirstName__c,Last_Name__c,Phone_number__c FROM New_Account__c WHERE RecordTypeId = :recordTypeId  OR Phone_number__c =:Phoneno OR PANCardNo__c =: PanCardno  OR Aadhar_Number__c =:AadharNo' ;
        return Database.query(query);
    }
@AuraEnabled
public static List<New_Account__c> getsearchaccounts(String searchAccountNumber) {
    String query = 'SELECT Id, Name, RecordType.Name,FirstName__c,Last_Name__c FROM New_Account__c';
    
    if (searchAccountNumber != null && searchAccountNumber.trim() != '') {
        searchAccountNumber = '%' + searchAccountNumber + '%';
        query += ' WHERE Name LIKE :searchAccountNumber';
    }

    return Database.query(query);
}

    @AuraEnabled(cacheable=true)
    public static List<Loan__c> getRelatedLoans(Id accountId) {
        return [SELECT Id, Name, Aadhar_Number__c, Annual_Income__c,Approval_Status__c 
                FROM Loan__c 
                WHERE New_Account__c = :accountId];
    }
     @AuraEnabled(cacheable=true)
    public static List<Insurance_Policy__c> getRelatedInsurances(Id accountId) {
        return [SELECT Id, Name, Policy_End_Date__c,Policy_Term__c,Phone_No__c,	Policy_Premium_Amount__c
                FROM Insurance_Policy__c 
                WHERE Customer_Name__c = :accountId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Credit_Card__c> getRelatedCreditcards(Id accountId) {
        return [SELECT Id, Name,Account_Holder_Name__c,	Account_Number__c,IFSC_Code__c 
                FROM Credit_Card__c
                WHERE New_Account__c = :accountId];
    }

    @AuraEnabled(cacheable=true)
    public static List<	Assets_and_Liabilities__c> getRelationshipAssets(Id accountId) {
        return [SELECT Id, Name,Asset_or_Liability_Name__c,Amount__c 
                FROM Assets_and_Liabilities__c 
                WHERE Primary_Owner__c = :accountId];
    }
    @AuraEnabled(cacheable=true)
    public static List<Insurance_Policy__c> getRelationshipInsurence(Id accountId) {
        return [SELECT Id, Name,Accidental_Death_Benefit__c,Benefit_Period__c 
                FROM Insurance_Policy__c 
                WHERE Customer_Name__c = :accountId];
    }
      @AuraEnabled(cacheable=true)
    public static List<RecordType> getAccountRecordTypes() {
    return [SELECT Id, Name FROM RecordType WHERE SObjectType = 'New_Account__c' AND IsActive = TRUE];
    }
  @AuraEnabled
    public static New_Account__c getAccountDetails(Id accountId) {
        try {
            // Fetch the account details based on the record ID
            return [
                SELECT Id, FirstName__c, Last_Name__c, DateOfBirth__c, Phone_number__c, Nationality__c, Home_Branch__r.Name, TotalAmountDepo__c, 
                Total_Balance__c, Father_sName__c, Mother_sName__c, Gender__c, MaritalStatus__c, Name, 
                PANCardNo__c,Aadhar_Number__c, Document_Verification_Status__c, Open_Date__c, Mode_Of_Operation__c, Mode_Of_Payment__c, Total_Deposit_Amount__c, 
                IFSC_Code__c, X1st_Joint_Application_Name__c, X2nd_Joint_Application_Name__c, 
                X3rd_Joint_Application_Name__c, Status__c, Annual_Income__c, Country__c, State__c, City__c, PinCode__c, Landmark__c, 
                CommunicationResidentAddress__c, Same_as_Resident_Address__c, Country_P__c, State_P__c, City_P__c, Landmark_P__c, PinCode_P__c, 
                Permanent_Address__c,UploadedFile__c
                FROM New_Account__c 
                WHERE Id = :accountId 
                LIMIT 1
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching account details: ' + e.getMessage());
        }
    }
@AuraEnabled
public static List<Loan__c> getLoanDetails(Id accountId) {
    try {
        List<Loan__c> loans = [
            SELECT Id, Name,Annual_Income__c,RecordType.Name,Occupation__c,Loan_Purpose__c,Loan_Term_Months__c,Loan_Start_Date__c,Loan_End_Date__c,Loan_Amount__c,Types_Of_Loans__c,Approval_Status__c FROM Loan__c WHERE New_Account__r.Id = :accountId
        ];
        return loans; // Return the list of loans (may be empty)
    } catch (Exception e) {
        throw new AuraHandledException('Error fetching account details: ' + e.getMessage());
    }
}
    @AuraEnabled(cacheable=true)
public static List<Insurance_Policy__c> getInsuranceDetails(Id accountId) {
    try {
        List<Insurance_Policy__c> Insurance = [
            SELECT Id, Name,Policy_Premium_Amount__c,RecordType.Name,Status__c,Payment_Frequency__c,Underwriting_Status__c,Policy_End_Date__c,Policy_Start_Date__c,Sum_Assured__c,Policy_Term__c FROM Insurance_Policy__c  WHERE Customer_Name__c = :accountId
        ];
        return Insurance; // Return the list of loans (may be empty) 
    } catch (Exception e) {
        throw new AuraHandledException('Error fetching insurance details: ' + e.getMessage());
    }
}

 @AuraEnabled(cacheable=true)
    public static Loan__c getLoanDetailsById(Id loanId) {
        try {
            return [SELECT Id, Name,Annual_Income__c,Occupation__c,Loan_Purpose__c,Loan_Term_Months__c,Loan_Start_Date__c,Loan_End_Date__c,Loan_Amount__c,Types_Of_Loans__c,Approval_Status__c
                    FROM Loan__c
                    WHERE Id = :loanId];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving loan details: ' + e.getMessage());
        }
    }

 @AuraEnabled(cacheable=true)
    public static Insurance_Policy__c getInsuranceDetailsById(Id insuranceId) {
        try {
            return [SELECT Id, Name,Policy_Premium_Amount__c,Status__c,Payment_Frequency__c,Underwriting_Status__c,Policy_End_Date__c,Policy_Start_Date__c,Sum_Assured__c,Policy_Term__c FROM Insurance_Policy__c WHERE  Id = :insuranceId];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving loan details: ' + e.getMessage());
        }
    }

 @AuraEnabled(cacheable=true)
public static List<Loan__c> searchloans(String searchAccountNumber, Id accountId) {
    // Log the input values
    System.debug('searchAccountNumber: ' + searchAccountNumber);
    System.debug('accountId: ' + accountId);
    
    // Initialize the query
    String query = 'SELECT Id, Name, RecordType.Name, Loan_End_Date__c, Loan_Amount__c FROM Loan__c WHERE New_Account__r.Id = :accountId';
    
    // Add condition for searchAccountNumber if provided
    if (searchAccountNumber != null && searchAccountNumber.trim() != '') {
        String searchAccountNumbers = '%' + searchAccountNumber.trim() + '%';
        query += ' AND Name LIKE :searchAccountNumbers';
    }

    // Log the final query string
    System.debug('Executing Loan Query: ' + query);

    // Execute the query and return results
    List<Loan__c> loanList = Database.query(query);
    System.debug('Query Results: ' + loanList);

    return loanList;
}

 @AuraEnabled(cacheable=true)
public static List<Insurance_Policy__c> searchInsurance(String searchAccountNumber, Id accountId) {
    // Log the input values
    System.debug('searchAccountNumber: ' + searchAccountNumber);
    System.debug('accountId: ' + accountId);
    
    // Initialize the query
    String query = 'SELECT Id, Name,Policy_Premium_Amount__c,RecordType.Name,Policy_End_Date__c FROM Insurance_Policy__c WHERE Customer_Name__r.Id = :accountId';
    
    // Add condition for searchAccountNumber if provided
    if (searchAccountNumber != null && searchAccountNumber.trim() != '') {
        String searchAccountNumbers = '%' + searchAccountNumber.trim() + '%';
        query += ' AND Name LIKE :searchAccountNumbers';
    }

    // Log the final query string
    System.debug('Executing Insurance Query: ' + query);

    // Execute the query and return results
    List<Insurance_Policy__c> InsuranceList = Database.query(query);
    System.debug('Query Results: ' + InsuranceList);

    return InsuranceList;
}

}