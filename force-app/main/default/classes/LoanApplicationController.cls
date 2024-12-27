public class LoanApplicationController {
        
    @AuraEnabled
    public static Id Createnewloans(Loan__c NewLoanRecords) {
        System.debug('LoanRecordss: ' + NewLoanRecords);
        try {
            // Set the Record Type Id for 'Personal Loan'
            // Query RecordType by its name

    // Query the RecordType for Loan__c using the Name field
    RecordType personalLoanRecordType = [SELECT Id FROM RecordType WHERE SObjectType = 'Loan__c' AND Name = 'Loan__c' LIMIT 1];

    // Create a new Loan__c record and assign the RecordTypeId
    Loan__c newLoan = new Loan__c();
    newLoan.RecordTypeId = personalLoanRecordType.Id;

    // Debugging to check the new loan record
    System.debug('New loan ::: ' + newLoan);

    // Insert the new loan record
    insert newLoan;



            // Insert the loan record
            insert NewLoanRecords;
    System.debug('New loan records:::' + NewLoanRecords);
            return NewLoanRecords.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error while creating loan record: ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable = true)
    public static List<Loan__c> getRecentlyViewedLoans(){
        // Query to get recently viewed New_Account__c records, ordered by LastViewedDate, limited to 10 records
        return [SELECT Id, Name, CreatedDate, Loan_Type__c, Annual_Income__c
                FROM Loan__c
                ORDER BY LastViewedDate DESC
                LIMIT 10];
    }
    @AuraEnabled(cacheable=true)
    public static List<Loan__c> getLoans() {
        return [
            SELECT Id, Name, Loan_Type__c, Annual_Income__c, CreatedDate
            FROM Loan__c
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
        public static List<New_Account__c> getAccountDetails(Id accountId) {
            
            system.debug('account name inside get account details :::'+ accountId);
            
        // Fetch the account and return required fields
        List<New_Account__c> accounts = [
            SELECT 
            Id,FirstName__c, Last_Name__c, DateOfBirth__c, Annual_Income__c,
                CommunicationResidentAddress__c, Nationality__c, 
                Permanent_Address__c, PANCardNo__c, Phone_number__c 
            FROM New_Account__c 
            WHERE Id = :accountId 
            LIMIT 1
        ];
        
        // Log fetched data
        if (!accounts.isEmpty()) {
            System.debug('Fetched Account: ' + accounts[0]);
            
        } 
            return accounts;
            
        
    }

        

    @AuraEnabled
    public static Id Creategoldloans(Loan__c NewGoldLoanRecords) {
        System.debug('LoanRecordss: ' + NewGoldLoanRecords);
        try {
            // Set the Record Type Id for 'Gold Loan'
            String goldLoanRecordTypeId = '012dM000003TMhlQAG';
            NewGoldLoanRecords.RecordTypeId =goldLoanRecordTypeId;

            // Insert the loan record
            insert NewGoldLoanRecords;

            return NewGoldLoanRecords.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error while creating loan record: ' + e.getMessage());
        }
    }

        @AuraEnabled(cacheable=true)
        public static List<New_Account__c> searchAccounts(String searchTerm) {
            return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
        }

        


    @AuraEnabled
    public static Id CreateHomeloans(Loan__c NewHomeLoanRecords) {
        System.debug('LoanRecordss: ' + NewHomeLoanRecords);
        try {
            // Set the Record Type Id for 'Gold Loan'
            String HomeLoanRecordTypeId = '012dM000003TMcvQAG';
            NewHomeLoanRecords.RecordTypeId =HomeLoanRecordTypeId;

            // Insert the loan record
            insert NewHomeLoanRecords;

            return NewHomeLoanRecords.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error while creating loan record: ' + e.getMessage());
        }
    }

        @AuraEnabled(cacheable=true)
        public static List<New_Account__c> getAccounts(String searchTerm) {
            return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
        }
        

    @AuraEnabled
    public static String saveLoanApplication(
        String borrowerName, 
        String accountId,
        String emailaddress, 
        String phoneNumber, 
        Date dob, 
        String nationality, 
        String address, 
        String maritail, 
        String occupation, 
        Decimal loanamount, 
        String loanpurpose, 
        Integer loantenure, 
        Decimal income,
        String documentId,
        String loanType
    ) {
        system.debug('inside home loan method');
        try {
            
            Loan__c loanApplication = new Loan__c(
                New_Account__c = accountId, 
                Borrower_s_Name__c = borrowerName,
                EmailAddress__c = emailaddress,
                Phone_number__c = phoneNumber,
                Date_Of_Birth__c = dob, 
                Nationality__c = nationality,
                Residential_Address__c = address,
                Marital__c = maritail,
                Occupation__c = occupation,
                Loan_Amount__c = loanamount,
                Loan_Purpose__c = loanpurpose,
                Loan_Term_Months__c = loantenure,
                Annual_Income__c = income, 
                Uploaded_Documents__c = documentId,
                Loan_Type__c = loanType
            //     Uploaded_Documents__c = panDocumentId,
            //    Uploaded_Documents__c = drivingLicenseDocumentId,
            //     Uploaded_Documents__c = salarySlipDocumentId,
            //    Uploaded_Documents__c = bankStatementDocumentId
            );
            insert loanApplication;
            return loanApplication.Id; // Return the Loan__c record ID
        } catch (Exception e) {
           // throw new AuraHandledException('Error saving loan application: ' + e.getMessage());
           	system.debug('error ::'+ e.getMessage());
            return null;
        }
    }
    


@AuraEnabled
public static String saveHomeLoanApplication(
    String borrowerName, 
    String accountId,
    String emailaddress, 
    String phoneNumber, 
    Date dob, 
    String nationality, 
    String address, 
    String maritail, 
    String occupation, 
    Decimal loanamount, 
    String loanpurpose, 
    Integer loantenure, 
    Decimal income,
    String propertyAddress,
    String propertyType,
    Decimal propertyValue,
    String builderName,
    String documentId,
    String loanType
) 
{
    system.debug('Loan type ::'+ loanType);
    try {
        // Null checks for required fields
        if (String.isBlank(borrowerName) || String.isBlank(accountId)) {
            throw new AuraHandledException('Missing required fields: Borrower Name or Account ID.');
        }
        if (loanamount == null || loantenure == null) {
            throw new AuraHandledException('Missing required fields: Loan Amount or Loan Tenure.');
        }

        // Debugging logs
        System.debug('Loan Application Details: ' +
            'Borrower Name: ' + borrowerName + ', Account ID: ' + accountId +
            ', Loan Amount: ' + loanamount + ', Loan Tenure: ' + loantenure);

        // Create Loan__c record
        Loan__c loanApplication = new Loan__c(
            New_Account__c = accountId, 
            Borrower_s_Name__c = borrowerName,
            EmailAddress__c = emailaddress,
            Phone_number__c = phoneNumber,
            Date_Of_Birth__c = dob, 
            Nationality__c = nationality,
            Residential_Address__c = address,
            Marital__c = maritail,
            Occupation__c = occupation,
            Loan_Amount__c = loanamount,
            Loan_Purpose__c = loanpurpose,
            Loan_Term_Months__c = loantenure,
            Annual_Income__c = income,
            Property_Address__c = propertyAddress,
            Type_of_Property__c = propertyType,
            Estimated_Property_Value__c = propertyValue,
            Builder_Developer_Name__c = builderName,
            Uploaded_Documents__c = documentId,
            Loan_Type__c = loanType
        );

        // Insert Loan__c record
        insert loanApplication;

        // Return the record ID of the inserted Loan__c
        return loanApplication.Id;

    }catch (Exception e) {
           // throw new AuraHandledException('Error saving loan application: ' + e.getMessage());
           	system.debug('error ::'+ e.getMessage());
            return null;
        }
}


    
@AuraEnabled
public static String saveGoldLoanApplication(
    String borrowerName, 
    String accountId,
    String emailaddress, 
    String phoneNumber, 
    Date dob, 
    String nationality, 
    String address, 
    String maritail, 
    String occupation, 
    Decimal loanamount, 
    String loanpurpose, 
    Integer loantenure, 
    Decimal income,
    String goldWeight,
    String goldType,
    String goldPurity,
    String documentId,
    String loanType
) {
    try {
        // Check if the purity value is valid (Optional but safe)
        List<String> validPurityValues = new List<String>{'18K', '22K', '24K'};
        if (!validPurityValues.contains(goldPurity)) {
            throw new AuraHandledException('Invalid purity value. Please select a valid option.');
        }

        Loan__c loanApplication = new Loan__c(
            New_Account__c = accountId, 
            Borrower_s_Name__c = borrowerName,
            EmailAddress__c = emailaddress,
            Phone_number__c = phoneNumber,
            Date_Of_Birth__c = dob, 
            Nationality__c = nationality,
            Residential_Address__c = address,
            Marital__c = maritail,
            Occupation__c = occupation,
            Loan_Amount__c = loanamount,
            Loan_Purpose__c = loanpurpose,
            Loan_Term_Months__c = loantenure,
            Annual_Income__c = income,
            Weight_of_Gold__c = goldWeight,
            Type_of_Gold__c = goldType,
            Purity__c = goldPurity, // Save selected value
            Uploaded_Documents__c = documentId,
            Loan_Type__c = loanType
        );

        insert loanApplication;
        return loanApplication.Id; // Return the Loan__c record ID
    } catch (Exception e) {
        throw new AuraHandledException('Error saving loan application: ' + e.getMessage());
    }
}

        
        
    }