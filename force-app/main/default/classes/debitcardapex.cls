public class debitcardapex {
public static void Debitcardcreation(List<New_Account__c> NewAccountRecords){
    
         List<Debit_Card__c> DebitCardRecords=new List<Debit_Card__c>();
        for(New_Account__c na : NewAccountRecords){
            if(na.Debit_Card__c){
                Debit_Card__c d=new Debit_Card__c();
                d.New_Account__c=na.id;
                d.Account_Holder_Name__c=na.FirstName__c;
                d.Account_Number__c=na.Name;
                DebitCardRecords.add(d);
            }
        }
        insert DebitCardRecords;
    }
}