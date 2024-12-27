public class InsuranceDetails {
    @AuraEnabled(cacheable=true)
    public static List<Insurance_Policy__c> getInsurancePoliciesByWealthManagement(Id wealthManagementId) {
        System.debug('Fetching Wealth Management record with ID: ' + wealthManagementId);

        Wealth_Management__c wmRecord = [
            SELECT New_Account__c 
            FROM Wealth_Management__c 
            WHERE Id = :wealthManagementId 
            LIMIT 1
        ];

        System.debug('Fetched Wealth Management record: ' + wmRecord);

        if (wmRecord != null && wmRecord.New_Account__c != null) {
            System.debug('New Account ID associated with Wealth Management: ' + wmRecord.New_Account__c);

            List<Insurance_Policy__c> insurancePolicies = [
                SELECT Id, Name, Coverage_Amount__c, Policy_Premium_Amount__c, Status__c, RecordType.Name
                FROM Insurance_Policy__c
                WHERE Customer_Name__c = :wmRecord.New_Account__c
            ];

            System.debug('Fetched Insurance Policies: ' + insurancePolicies);

            return insurancePolicies;
        } else {
            System.debug('No New Account associated with Wealth Management ID: ' + wealthManagementId);
            return new List<Insurance_Policy__c>();
        }
    }

}