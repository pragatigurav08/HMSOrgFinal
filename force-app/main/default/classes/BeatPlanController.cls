public with sharing class BeatPlanController 
{
    //public class VisitWrapper{
       // @AuraEnabled public String dateStr;
       // @AuraEnabled public List<Account_Route__c> retailLst;
    //}
    @AuraEnabled
   public static List<Account__c> getRouteAccounts(String routeId)
   {
             List<Account__c> routeRecrdLst = [Select Id,Name,Account__c,Route__c from Account__c Where Route__c =: routeId];
             System.debug('routeRecrdLst'+routeRecrdLst);
             return routeRecrdLst;
         }   
    }