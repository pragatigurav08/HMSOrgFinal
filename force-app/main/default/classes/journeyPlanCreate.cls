public with sharing class journeyPlanCreate {
    public class recordWrapper{
        @AuraEnabled public String planItemName{get;set;}
        @AuraEnabled public Date startDateValue{get;set;}
        @AuraEnabled public Date endDateValue{get;set;}
    }
    public class planBeatsWrapper{
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public Id Id{get;set;}
        @AuraEnabled public List<accountWrapper> accountsRecord{get;set;}
    }
    public class accountWrapper{
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public Id accID{get;set;}
        @AuraEnabled public Date starttime{get;set;}
        @AuraEnabled public Date endtime{get;set;}
        @AuraEnabled public Boolean checkValue{get;set;}
    }
   @AuraEnabled
   public static Journey_Plan__c saveJourneyRecord(recordWrapper objJourney){
       System.debug('objJourney::'+objJourney);
       try {
           System.debug('objJourney'+objJourney);
           Journey_Plan__c jurRec=new Journey_Plan__c();
           jurRec.Name=objJourney.planItemName;
           jurRec.Plan_Start_Date__c=objJourney.startDateValue;
           jurRec.Plan_End_Date__c=objJourney.endDateValue;
           insert jurRec;
           return jurRec;
       } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }
    @AuraEnabled
    public static string savePlanRecord(List<planBeatsWrapper> objPlan,String jrId){
        
        System.debug('objPlan'+objPlan);
        System.debug('jrId'+jrId);
        List<Plan_Item__c> plItems=new List<Plan_Item__c>();
        List<Visit__c> visDetailsList=new List<Visit__c>();
        // Map<Name,Map<Id,planBeatsWrapper>> mapNew=new Map<Name,Map<Id,planBeatsWrapper>>();
        map<string,id>planitems =new map<string,id>();
        for(planBeatsWrapper plI:objPlan)
        {
            Plan_Item__c planRec=new Plan_Item__c();
            planRec.Name=plI.Name;
            planRec.Route__c=plI.Id;
            planRec.Journey_Plan__c=jrId;
            plItems.add(planRec);
            
            /*for(accountWrapper objAccDetails:plI.accountsRecord)
            {   
            System.debug('Enter into visit for');
            System.debug('objAccDetails'+objAccDetails);
            Visit__c visDetails= new Visit__c();  
            visDetails.Account__c=objAccDetails.accID;
            visDetails.PlannedVisitStartTime__c=objAccDetails.starttime;
            
            visDetails.PlannedVisitEndTime__c=objAccDetails.endtime;
            visDetailsList.add(visDetails);
            }*/
        }
        if(!plItems.isEmpty())
        {
            insert plItems;
            System.debug(plItems);
        }
        
        for (Plan_Item__c pi:plItems ){
            planitems.put(pi.name,pi.id);
        }
        
        for(planBeatsWrapper plI:objPlan)
        {
            id planid=planitems.get(plI.name);
            
            for(accountWrapper objAccDetails:plI.accountsRecord)
            {   
                System.debug('Enter into visit for');
                System.debug('objAccDetails'+objAccDetails);
                Visit__c visDetails= new Visit__c();
                //visDetails.Name = objAccDetails.Name;
                //visDetails.Account__c=objAccDetails.accID;
                visDetails.PlannedVisitStartTime__c=objAccDetails.starttime;
                visDetails.PlannedVisitEndTime__c=objAccDetails.endtime;
                visDetails.Plan_Item__c=planid;
                visDetails.Journey_Plan__c=jrId;
                if(objAccDetails.checkValue == true)
                {
                    visDetailsList.add(visDetails);
                }
            }
        }
        if(!visDetailsList.isEmpty())
        {
            insert visDetailsList;
            System.debug(visDetailsList);
        }
        return 'success';
    }
   
}