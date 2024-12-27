public class WealthControllers {
    @AuraEnabled(cacheable=true)
    public static New_Account__c getNewAccountDetails(Id wealthManagementId) {
        Wealth_Management__c wmRecord = [
            SELECT Id, New_Account__c 
            FROM Wealth_Management__c 
            WHERE Id = :wealthManagementId 
            LIMIT 1
        ];
        
        System.debug('Wealth Management Record: ' + wmRecord);
        System.debug('New_Account__c ID: ' + wmRecord.New_Account__c);
        
       
        if (wmRecord.New_Account__c != null) {
            New_Account__c newAccount = [
                SELECT Name, Open_Date__c, Status__c, IFSC_Code__c, Total_Deposit_Amount__c, 
                       Annual_Income__c, Interest_Rate__c, Amount__c, Amount_In_Words__c, 
                       X1st_Joint_Application_Name__c, X2nd_Joint_Application_Name__c, 
                       X3rd_Joint_Application_Name__c, Mode_Of_Operation__c, 
                       Mode_Of_Payment__c, Document_Verification_Status__c, 
                       Credit_Card__c, Debit_Card__c, 
                       FirstName__c, Father_sName__c, Last_Name__c, 
                       Mother_sName__c, DateOfBirth__c, Mother_sMaidenName__c, 
                       Phone_number__c, Gender__c, Nationality__c, MaritalStatus__c,Total_Balance__c,UploadedFile__c,RecordType.Name
                FROM New_Account__c 
                WHERE Id = :wmRecord.New_Account__c 
                LIMIT 1
            ];
            System.debug('New Account Record: ' + newAccount);
            return newAccount;
        } else {
            System.debug('No associated New Account found for Wealth Management ID: ' + wealthManagementId);
            return null;
        }
    }
   

}