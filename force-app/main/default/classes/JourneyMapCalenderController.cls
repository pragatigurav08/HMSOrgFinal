public with sharing class JourneyMapCalenderController {
    @AuraEnabled
    public static DataWrapper getPlanItms(String recordId)
    {
        List<Plan_Item__c> plItems=[SELECT Id,Name FROM Plan_Item__c WHERE Journey_Plan__c =: recordId];
        List<Visit__c> visItems=[SELECT Id,Name,PlannedVisitEndTime__c,PlannedVisitStartTime__c FROM Visit__c WHERE Journey_Plan__c =: recordId];
		DataWrapper wrap = new DataWrapper();
        wrap.planItms = plItems;
        wrap.visitItms = visItems;
        return wrap;
    }
    
    public class DataWrapper{
    @AuraEnabled public List<Plan_Item__c> planItms {get;set;}
    @AuraEnabled public List<Visit__c> visitItms {get;set;}
	}
    
    @AuraEnabled
    public static RecordWrapper getMapCal(String recordId,String selecPlanItm,String selVisit,Boolean IsPlanItemsSelected){
        System.debug('recordId::'+selecPlanItm);
        try {
            List<EventWrapper> eventLst = new List<EventWrapper>();
            List<Marker> locationsList = new List<Marker>();
            Plan_Item__c planItm;
            List<Visit__c> visitList;
            if(IsPlanItemsSelected == true){
                if(selecPlanItm != null){
                    planItm=[SELECT Id,Name,(SELECT Id,Name,Account__c,Account__r.Name,Account__r.BillingStreet,Account__r.BillingCountry,
                                             Account__r.BillingCity,Account__r.BillingState,Account__r.BillingPostalCode,Status__c,
                                             PlannedVisitEndTime__c,PlannedVisitStartTime__c FROM Visits__r)FROM Plan_Item__c 
                             WHERE Id =:selecPlanItm];
                    visitList = planItm.Visits__r;
                    System.debug('planItmsLst::::'+planItm.Visits__r);
                }
                
            }
            else{
                if(selVisit != null){
                    if(selVisit == 'ONLOAD'){
                        visitList = [SELECT Id,Name,Account__c,Account__r.Name,Account__r.BillingStreet,Account__r.BillingCountry,
                        Account__r.BillingCity,Account__r.BillingState,Account__r.BillingPostalCode,Status__c,
                        PlannedVisitEndTime__c,PlannedVisitStartTime__c FROM Visit__c WHERE Journey_Plan__c =: recordId];

                    }
                    else{
                        visitList = [SELECT Id,Name,Account__c,Account__r.Name,Account__r.BillingStreet,Account__r.BillingCountry,
                        Account__r.BillingCity,Account__r.BillingState,Account__r.BillingPostalCode,Status__c,
                        PlannedVisitEndTime__c,PlannedVisitStartTime__c FROM Visit__c WHERE Id =: selVisit];
                    }
                    
                }
            }

            System.debug(' User Time Zone ID = '+UserInfo.getTimeZone().getID());
            System.debug(' User Time Zone = '+UserInfo.getTimeZone());

                for(Visit__c visitRec: visitList){
                   pointer locWrap = new pointer();
                   locWrap.Street=visitRec.Account__r.BillingStreet;
                   locWrap.State=visitRec.Account__r.BillingState;
                   locWrap.City=visitRec.Account__r.BillingCity;
                   locWrap.Country=visitRec.Account__r.BillingCountry;
                   locWrap.PostalCode=visitRec.Account__r.BillingPostalCode;
                   
                    MapIcon mapicn = new MapIcon();
                    //mapicn.path = 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';
                    mapicn.path = 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z';
                    mapicn.fillOpacity = .9;
                    mapicn.fillColor = '#ff6700';
                    mapicn.scale = 1.5;

                    Marker markerWrap = new Marker();
				   	markerWrap.location=locWrap;
                    //markerWrap.mapIcon=mapicn;
                    markerWrap.title= visitRec.Account__r.Name;
                    markerWrap.icon='standard:account';
                   	locationsList.add(markerWrap);
                    
                   EventWrapper eventWrap = new EventWrapper();
                   eventWrap.id=visitRec.Id;
                   eventWrap.title=visitRec.Account__r.Name;                    
                   eventWrap.start=visitRec.PlannedVisitStartTime__c.addSeconds(UserInfo.getTimezone().getOffset(visitRec.PlannedVisitStartTime__c)/1000);
                   eventWrap.enddate=visitRec.PlannedVisitEndTime__c.addSeconds(UserInfo.getTimezone().getOffset(visitRec.PlannedVisitEndTime__c)/1000);
                   //eventWrap.start=DateTime.valueOf(visitRec.PlannedVisitStartTime__c.format('yyyy-MM-dd HH:mm:ss',UserInfo.getTimeZone().getID()));
                   //eventWrap.enddate=DateTime.valueOf(visitRec.PlannedVisitEndTime__c.format('yyyy-MM-dd HH:mm:ss',UserInfo.getTimeZone().getID()));
                   eventWrap.startTime=visitRec.PlannedVisitStartTime__c.getTime();
                    String eventColor;
                    if(visitRec.Status__c == 'Planned'){
                        eventColor='#055F74';
                    }else if(visitRec.Status__c == 'InProgress'){
                        eventColor='#800000';
                    }else if(visitRec.Status__c == 'Completed'){
                        eventColor='#008000';
                    }
                    
                   eventWrap.backgroundColor = eventColor;
                   eventWrap.endTime=visitRec.PlannedVisitEndTime__c.getTime();
                   eventLst.add(eventWrap);
                }
                
            RecordWrapper recWrap = new RecordWrapper();
            recWrap.locationlist = locationsList;
			recWrap.eventList = eventLst;
            system.debug('recWrap::'+recWrap);
            
            return recWrap;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Visit__c getVisit(String recordId)
    {
        System.debug('recordId::'+recordId);
        Visit__c visitRec=[SELECT Id,Name,PlannedVisitStartTime__c,PlannedVisitEndTime__c FROM Visit__c WHERE Id =: recordId];
        return visitRec;
    }
    @AuraEnabled
    public static String updateVisitRecord(String recordId, Visit__c visitRec)
    {
        System.debug('visitRec::'+visitRec);
        System.debug('recordId::'+recordId);

        Visit__c visitRecrd = new Visit__c();
        visitRecrd.Id = recordId;
        visitRecrd.PlannedVisitStartTime__c = visitRec.PlannedVisitStartTime__c;
        visitRecrd.PlannedVisitEndTime__c = visitRec.PlannedVisitEndTime__c;
        update visitRecrd;
        return 'success';
    }
    public class RecordWrapper{
    @AuraEnabled public List<Plan_Item__c> planItms {get;set;}
    @AuraEnabled public List<Marker> locationlist {get;set;}
    @AuraEnabled public List<EventWrapper> eventList {get;set;}
	}
    public class EventWrapper{
        @AuraEnabled public String id {get;set;}
        @AuraEnabled public String title {get;set;}
        @AuraEnabled public String backgroundColor {get;set;}
        @AuraEnabled public DateTime start {get;set;}
        @AuraEnabled public DateTime enddate {get;set;}
        @AuraEnabled public Long startTime {get;set;}
        @AuraEnabled public Long endTime {get;set;}
    }
    
    public class Marker
    {
        @AuraEnabled public Pointer location {get;set;}
        //@AuraEnabled public MapIcon mapIcon {get;set;}
        @AuraEnabled public String title{get;set;}
        @AuraEnabled public String icon{get;set;}
    }

    public class Pointer
    {
        @AuraEnabled public String Street{get;set;}
        @AuraEnabled public String City{get;set;}
        @AuraEnabled public String Country{get;set;}
        @AuraEnabled public String PostalCode{get;set;}
        @AuraEnabled public String State{get;set;}
    }
    public class MapIcon
    {
        @AuraEnabled public String path{get;set;}
        @AuraEnabled public String fillColor{get;set;}
        @AuraEnabled public Decimal fillOpacity{get;set;}
        @AuraEnabled public Decimal scale{get;set;}
        @AuraEnabled public Anchor anchor{get;set;}
    }
    public class Anchor
    {
        @AuraEnabled public Decimal x{get;set;}
        @AuraEnabled public Decimal y{get;set;}
    }
}