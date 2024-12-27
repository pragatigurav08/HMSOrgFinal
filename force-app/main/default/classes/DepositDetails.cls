public class DepositDetails {
  @AuraEnabled(cacheable=true)
    public static List<DepositesWrapper> getDepositesDetailsByWealthManagement(Id wealthManagementId) {
        System.debug('Fetching Wealth Management record with ID: ' + wealthManagementId);

        // Step 1: Fetch the related New_Account__c ID from Wealth_Management__c
        Wealth_Management__c wmRecord = [
            SELECT New_Account__c 
            FROM Wealth_Management__c 
            WHERE Id = :wealthManagementId 
            LIMIT 1
        ];

        System.debug('Fetched Wealth Management record: ' + wmRecord);

        // Check if the Wealth Management record exists and New_Account__c is populated
        if (wmRecord != null && wmRecord.New_Account__c != null) {
            System.debug('New Account ID associated with Wealth Management: ' + wmRecord.New_Account__c);

            // Step 2: Fetch Deposites__c records related to the New_Account__c and check Record Type
            List<Deposites__c> depositeRecords = [
                SELECT Id, Amount__c, Tenure_In_Months__c, RecordType.Name, New_Account__c, New_Account__r.Name
                FROM Deposites__c 
                WHERE New_Account__c = :wmRecord.New_Account__c
            ];

            System.debug('Fetched Deposites Records: ' + depositeRecords);

            // Step 3: Wrap each Deposites__c record with relevant information based on RecordType
            List<DepositesWrapper> wrappedDeposites = new List<DepositesWrapper>();
            for (Deposites__c deposite : depositeRecords) {
                DepositesWrapper wrapper = new DepositesWrapper();
                wrapper.id = deposite.Id;
                wrapper.amount = deposite.Amount__c;
                wrapper.tenure = deposite.Tenure_In_Months__c;
                wrapper.accountName = deposite.New_Account__r.Name;
                wrapper.recordTypeName = deposite.RecordType.Name;

                if (deposite.RecordType.Name == 'RD') {
                    wrapper.displayAmount = 'Recurring Deposit Amount: ' + deposite.Amount__c;
                    wrapper.displayTenure = 'Tenure (Months): ' + deposite.Tenure_In_Months__c;
                } else if (deposite.RecordType.Name == 'FD') {
                    wrapper.displayAmount = 'Fixed Deposit Amount: ' + deposite.Amount__c;
                    wrapper.displayTenure = 'Tenure (Months): ' + deposite.Tenure_In_Months__c;
                }

                wrappedDeposites.add(wrapper);
            }

            System.debug('Wrapped Deposites Details: ' + wrappedDeposites);

            // Return the wrapped records
            return wrappedDeposites;
        } else {
            System.debug('No New Account associated with Wealth Management ID: ' + wealthManagementId);
            return new List<DepositesWrapper>(); // Return empty list if no New_Account__c is found
        }
    }

    // Wrapper class to structure data based on RecordType
    public class DepositesWrapper {
    @AuraEnabled public Id id;
    @AuraEnabled public String accountName;
    @AuraEnabled public Decimal amount;
    @AuraEnabled public Decimal tenure; // Change to Decimal
    @AuraEnabled public String recordTypeName;
    @AuraEnabled public String displayAmount;
    @AuraEnabled public String displayTenure;
}

}