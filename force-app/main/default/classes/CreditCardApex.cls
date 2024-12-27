public class CreditCardApex {
    public static void creditcardcreation(List<New_Account__c> NewAccountRecords){
         List<Credit_Card__c> creditCardRecords=new List<Credit_Card__c>();
        for(New_Account__c na : NewAccountRecords){
            if(na.Credit_Card__c){
                Credit_Card__c c=new Credit_Card__c();
                c.New_Account__c=na.id;
                c.Account_Holder_Name__c=na.FirstName__c;
                c.Account_Number__c=na.Name;
                creditCardRecords.add(c);
            }
        }
        insert creditCardRecords;
    }
}