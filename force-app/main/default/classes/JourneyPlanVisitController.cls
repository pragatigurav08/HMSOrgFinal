public with sharing class JourneyPlanVisitController {
    @AuraEnabled
    public static List<Account> getAccRecrds(){
        
        
        try {
            String timezone=UserInfo.getTimeZone().getID();
            System.debug(' User Time Zone ID = '+timezone);
            System.debug(' User Time Zone = '+UserInfo.getTimeZone());
            List<Account> accList =[SELECT Id,Name FROM Account LIMIT 50];
            return accList;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Account> getAccFilterList(String keyword){
        try {
            List<Account> accListVal =[SELECT Id,Name FROM Account LIMIT 50];
            String search='%'+keyword+'%';
            if(keyword==''||keyword==null){
                return accListVal;
            }
            List<Account> accList =[SELECT Id,Name FROM Account WHERE Name LIKE :search LIMIT 50];
            return accList;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Journey_Plan__c saveAllValues(recordWrapper journeyDetailsValues,List<Visit__c> visitsDetails){
        try {
            System.debug(journeyDetailsValues);
            System.debug(visitsDetails);
            Journey_Plan__c jurRec=new Journey_Plan__c();
            jurRec.Name=journeyDetailsValues.planItemName;
            jurRec.Plan_Start_Date__c=journeyDetailsValues.startDateValue;
            jurRec.Plan_End_Date__c=journeyDetailsValues.endDateValue;
            insert jurRec;

            List<Visit__c> visDetailsList=new List<Visit__c>();
            for(Visit__c vd:visitsDetails)
            { 
                Visit__c vsDetails=new Visit__c();
                //vsDetails.Name = vd.Account__r.Name;
                vsDetails.Account__c=vd.Account__c;
                vsDetails.PlannedVisitStartTime__c=vd.PlannedVisitStartTime__c.addMinutes(-330);//addSeconds(UserInfo.getTimezone().getOffset(vd.PlannedVisitStartTime__c)/1000);
                vsDetails.PlannedVisitEndTime__c=vd.PlannedVisitEndTime__c.addMinutes(-330);//.addSeconds(UserInfo.getTimezone().getOffset(vd.PlannedVisitStartTime__c)/1000);
                system.debug('vsDetails.PlannedVisitStartTime__c--'+vsDetails.PlannedVisitStartTime__c);
                system.debug('vsDetails.PlannedVisitEndTime__c--'+vsDetails.PlannedVisitEndTime__c);
                vsDetails.Journey_Plan__c=jurRec.Id;
                visDetailsList.add(vsDetails);
            }
            if(!visDetailsList.isEmpty())
            {
                 insert visDetailsList;
                 System.debug(visDetailsList);
            }
           
            return jurRec;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class recordWrapper{
        @AuraEnabled public String planItemName{get;set;}
        @AuraEnabled public Date startDateValue{get;set;}
        @AuraEnabled public Date endDateValue{get;set;}
    }

}