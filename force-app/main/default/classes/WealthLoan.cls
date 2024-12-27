public class WealthLoan {
    @AuraEnabled(cacheable=true)
    public static List<Loan__c> getLoansByAccountId(Id accountId) {
        // Query loan records where the account is linked by Id
        return [SELECT Id, Name, Loan_Amount__c, New_Account__c, Borrower_s_Name__c, EMI_Amount__c, Interest_Rate__c, Loan_Purpose__c,
                       New_Account__r.Name, New_Account__r.FirstName__c, New_Account__r.Last_Name__c, Types_Of_Loans__c,RecordType.Name
                FROM Loan__c 
                WHERE New_Account__c = :accountId];
    }

      @AuraEnabled(cacheable=true)
    public static List<Assets__c> getAssetsByAccountId(Id accountId) {
        // Query loan records where the account is linked by Id
        return [SELECT Asset_Name__c,Name,Purchase_Date__c
                FROM Assets__c 
                WHERE Account__c= :accountId];
    }

    @AuraEnabled
public static void saveAsset(Assets__c asset) {
    if (asset.Account__c == null) {
        throw new AuraHandledException('Account ID is required to save the asset.');
    }
    
    try {
        // Ensure the asset has the required Account__c field
        insert asset;
    } catch (DmlException e) {
        throw new AuraHandledException('Failed to save asset: ' + e.getMessage());
    }
}

    
   @AuraEnabled(cacheable=true)
public static Decimal calculateTotalRepayment(Id accountId) {
    Decimal totalRepayment = 0;
    
    try {
        List<Loan__c> loans = getLoansByAccountId(accountId);
        System.debug('Loans for Account: ' + loans);  // Log fetched loans
        
        for (Loan__c loan : loans) {
            if (loan.Loan_Amount__c != null && loan.Interest_Rate__c != null) {
                Decimal principal = loan.Loan_Amount__c;
                Decimal interestRate = loan.Interest_Rate__c / 100; // Convert percentage to decimal
                Integer years = 5; // Assuming loan term is 5 years
                Integer n = 12; // Compounded monthly
                
                Double principalDouble = Double.valueOf(principal);
                Double ratePerPeriod = Double.valueOf(interestRate / n);
                Double totalPeriods = n * years;
                
                Double compoundedAmount = principalDouble * Math.pow(1 + ratePerPeriod, totalPeriods);
                
                // Convert compoundedAmount back to Decimal and accumulate
                totalRepayment += Decimal.valueOf(compoundedAmount);
                System.debug('Current total repayment: ' + totalRepayment);  // Log calculated amount
            } else {
                System.debug('Loan with null Loan_Amount__c or Interest_Rate__c: ' + loan);
            }
        }
    } catch (Exception e) {
        System.debug('Error calculating total repayment: ' + e.getMessage());
        throw new AuraHandledException('Error calculating total repayment: ' + e.getMessage());
    }
    
    System.debug('Final total repayment: ' + totalRepayment);
    return totalRepayment;
}



}