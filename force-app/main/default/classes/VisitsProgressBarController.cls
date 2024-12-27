public with sharing class VisitsProgressBarController {
    @AuraEnabled
        public static VisitWrapper getVisits(String recordId){
            try {
                List<Visit__c> visitList = new List<Visit__c>();
                Set<Id> planItmIds = new Set<Id>();
                List<Plan_Item__c> plItems=[SELECT Id,Name FROM Plan_Item__c WHERE Journey_Plan__c =: recordId];
                for(Plan_Item__c planItm:plItems){
                    planItmIds.add(planItm.Id);
                }
                List<Visit__c> visitLst=[SELECT Id,Name,PlannedVisitEndTime__c,PlannedVisitStartTime__c,
                                         Account__c,Status__c FROM Visit__c WHERE Journey_Plan__c =:recordId];
                for(Visit__c visit : visitLst){
                    if(visit.Status__c == 'Completed'){ 
                        visitList.add(visit);
                    }
                }
                
                VisitWrapper wrap = new VisitWrapper();
                wrap.completedVisits = visitList.Size();
                wrap.totalVisits = visitLst.Size();
                
                return wrap;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        public class VisitWrapper{
            @AuraEnabled public Integer completedVisits {get;set;}
            @AuraEnabled public Integer totalVisits {get;set;}
            @AuraEnabled public List<Visit__c> visitRecrds {get;set;}
        }
    
    }