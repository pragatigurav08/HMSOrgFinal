public with sharing class WealthController {
    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchText) {
        return [SELECT Name, Open_Date__c, Status__c, IFSC_Code__c, Total_Deposit_Amount__c, 
                       Annual_Income__c, Interest_Rate__c, Amount__c, Amount_In_Words__c, 
                       X1st_Joint_Application_Name__c, X2nd_Joint_Application_Name__c, 
                       X3rd_Joint_Application_Name__c, Mode_Of_Operation__c, 
                       Mode_Of_Payment__c, Document_Verification_Status__c, 
                       Credit_Card__c, Debit_Card__c, 
                       FirstName__c, Father_sName__c, Last_Name__c, 
                       Mother_sName__c, DateOfBirth__c, Mother_sMaidenName__c, 
                       Phone_number__c, Gender__c, Nationality__c, MaritalStatus__c,Total_Balance__c,UploadedFile__c
                FROM New_Account__c
                WHERE Name LIKE :('%' + searchText + '%')
                LIMIT 10];
    }
@AuraEnabled
public static void saveAsset(Map<String, Object> asset) {
    // Create a new asset record
    Assets_and_Liabilities__c newAsset = new Assets_and_Liabilities__c();
    
    // Map asset details from the incoming parameter
    newAsset.Asset_or_Liability_Name__c = (String) asset.get('assetName');
    newAsset.Description__c = (String) asset.get('description');

    // Convert the 'amount' field to Decimal
    if (asset.containsKey('amount') && asset.get('amount') != null) {
        String amountStr = (String) asset.get('amount');
        Decimal amountValue = Decimal.valueOf(amountStr);  // Convert String to Decimal
        newAsset.Amount__c = amountValue;
    }

    // Associate the asset with the specified account (Primary Owner)
    newAsset.Primary_Owner__c = (Id) asset.get('accountId');

    // Insert the new asset record
    insert newAsset;
}



     // Method to provide suggestions based on Annual Income
  @AuraEnabled(cacheable=true)
public static String getFinancialSuggestions(Decimal annualIncome, Decimal totalBalance) {
    Decimal recommendedLoanLimit = annualIncome * 0.4;

    if (annualIncome < 100000) {
        return 'With an annual income below ₹1,00,000 and a balance of ₹' + totalBalance + 
               ', focus on saving 20% of your income and avoid large loans. Opt for low-risk investments like savings or recurring deposits.';
    } else if (annualIncome >= 100000 && annualIncome <= 500000) {
        if (totalBalance < 50000) {
            return 'With an income between ₹1,00,000 and ₹5,00,000 and a balance of ₹' + totalBalance + 
                   ', explore safe investments like fixed deposits or conservative mutual funds. Limit loans to ₹' + recommendedLoanLimit + ' for manageable debt.';
        } else {
            return 'With an income of ₹' + annualIncome + ' and balance of ₹' + totalBalance + 
                   ', consider moderate-risk investments like mutual funds. Ensure loans stay within 30% of monthly income.';
        }
    } else {
        if (totalBalance < 200000) {
            return 'With an income above ₹5,00,000 and balance of ₹' + totalBalance + 
                   ', focus on savings and long-term investments like equities. Avoid large loans until your balance strengthens.';
        } else {
            return 'With an income above ₹5,00,000 and a strong balance of ₹' + totalBalance + 
                   ', explore high-growth investments like equities or real estate. Keep loans aligned with growth goals for manageable debt.';
        }
    }
}


    @AuraEnabled(cacheable=true)
    public static List<Assets_and_Liabilities__c> getAssetsByAccountId(Id accountId) {
        // Query to retrieve asset information based on the Account Id
        return [
            SELECT Id, Name, Asset_or_Liability_Name__c, Description__c, Amount__c, CreatedById
            FROM Assets_and_Liabilities__c
            WHERE Primary_Owner__c = :accountId
        ];
    }


}