public with sharing class AccountRelatedDataController {

    // Wrapper class to hold totals
    public class AccountDataSummary {
        @AuraEnabled public Integer totalInsurancePolicies { get; set; }
        @AuraEnabled public Integer totalLoans { get; set; }
        @AuraEnabled public Integer totalAssets { get; set; }
        @AuraEnabled public Integer totalAdvisors { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static AccountDataSummary getAccountDataSummary(Id accountId) {
        AccountDataSummary summary = new AccountDataSummary();

        // Calculate totals for Insurance Policies
        summary.totalInsurancePolicies = [
            SELECT COUNT()
            FROM Insurance_Policy__c 
            WHERE Customer_Name__c = :accountId
        ];

        // Calculate totals for Loans
        summary.totalLoans = [
            SELECT COUNT()
            FROM Loan__c 
            WHERE New_Account__c = :accountId
        ];

        // Calculate totals for Assets
        summary.totalAssets = [
            SELECT COUNT()
            FROM Assets__c 
            WHERE Account__c = :accountId
        ];

        // Calculate totals for Advisors
        summary.totalAdvisors = [
            SELECT COUNT()
            FROM Advisor__c 
            WHERE New_Account__c = :accountId
        ];
        System.debug('Account ID: ' + accountId);
System.debug('Total Insurance Policies: ' + summary.totalInsurancePolicies);
System.debug('Total Loans: ' + summary.totalLoans);
System.debug('Total Assets: ' + summary.totalAssets);
System.debug('Total Advisors: ' + summary.totalAdvisors);

        return summary;
    }
}