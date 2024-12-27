public with sharing class ManageVisitController {
    @AuraEnabled
    public static OppAndDateTimeWrapper getVisit(String recordId){
        OppAndDateTimeWrapper oppAndDateTimeWrapperObject = new OppAndDateTimeWrapper();
        oppAndDateTimeWrapperObject.currentDateTime = System.now();
        System.debug('Get Time :: '+String.valueOf(System.now().getTime()));
        oppAndDateTimeWrapperObject.currentTime = String.valueOf(System.now().getTime());
        oppAndDateTimeWrapperObject.oppObject = [SELECT Id, Name,Account__r.Id,Account__c, Account__r.Name FROM Visit__c WHERE Id =: recordId LIMIT 1];
        system.debug('accountId::'+oppAndDateTimeWrapperObject.oppObject);
        return oppAndDateTimeWrapperObject;
    }

    @AuraEnabled
    public static Visit__c getCurrentVisit(String recordId){
        return [SELECT Id, Name,Category__c, Account__r.BillingStreet, Account__r.BillingCity, Account__r.BillingState,Account__r.BillingPostalCode FROM Visit__c WHERE Id=: recordId];
    }
    @AuraEnabled
    public static String updateVisitRec(String recordId,Boolean isStart){
        Visit__c visitRec = new Visit__c();
        visitRec.Id=recordId;
        if(isStart==true){
            visitRec.ActualVisitStartTime__c = System.now();
            visitRec.Status__c = 'InProgress';
        }
        else{
            visitRec.ActualVisitEndTime__c = System.now(); 
            visitRec.Status__c = 'Completed';
        }
        update visitRec;
        return 'success';
    } 
 

    @AuraEnabled
    public static List<LabelValueWrapper> getListOfDropdown(){
        List<LabelValueWrapper> purposeOptions= new List<LabelValueWrapper>();
        Schema.DescribeFieldResult purposeResult = Check_In_Out__c.Purpose__c.getDescribe();
        List<Schema.PicklistEntry> purposeValue = purposeResult.getPicklistValues();
        for(Schema.PicklistEntry pickListVal : purposeValue){
            LabelValueWrapper labelValueWrapperObject = new LabelValueWrapper();
            labelValueWrapperObject.label = pickListVal.getLabel();
            labelValueWrapperObject.value = pickListVal.getValue();
            purposeOptions.add(labelValueWrapperObject);
        }
        return purposeOptions;
    }

    Public class LabelValueWrapper{
        @AuraEnabled public String label;
        @AuraEnabled public String value;
    }

    @AuraEnabled
    public static List<Event> getLatestEvent(String recordId){
        List<LabelValueWrapper> labelValueWrapperList = new List<LabelValueWrapper>(getListOfDropdown());
        List<String> subject=new List<String>();
        for(LabelValueWrapper labelValueWrapperVar : labelValueWrapperList){
            subject.add(labelValueWrapperVar.value);
        }
        List<Event> eventList =[SELECT Id, Check_In__c,Check_Out__c,Subject, CreatedDate FROM Event 
        WHERE WhatId=: recordId AND Subject=:subject ORDER BY CreatedDate DESC LIMIT 1];
        return eventList;
    }

    @AuraEnabled
    public static Boolean getCheckValueMethod(string RId){
        System.debug('Inside Check-In');
        System.debug('RecordId : '+RId);
        Boolean b;
        List<LabelValueWrapper> labelValueWrapperList = new List<LabelValueWrapper>(getListOfDropdown());
        List<String> subject=new List<String>();
        for(LabelValueWrapper labelValueWrapperVar : labelValueWrapperList){
            subject.add(labelValueWrapperVar.value);
        }
        List<Event> e =[SELECT Id, Check_In__c,Check_Out__c,Subject FROM Event 
        WHERE WhatId=: RId AND Subject=:subject ORDER BY CreatedDate DESC LIMIT 1];
        if(e.size()==0){
            b=false;
        }
        else if(e[0].Check_In__c==true && e[0].Check_Out__c==true){
            b= false;
        }
        else {
            b=true;
        }
        System.debug('Inside Check-In b='+b);
        return b;
    }

    @AuraEnabled
    public static User getCurrentUser(){
        return [SELECT Id, Name, Email, MobilePhone FROM User WHERE Id=: UserInfo.getUserId() LIMIT 1];
    }

    @AuraEnabled
    public static OwnerIdTypeWrapper getOwnerIdMethod(string id){
        List<Visit__c> e = [SELECT Name, Id, OwnerId FROM Visit__c  WHERE Id=:id];
        OwnerIdTypeWrapper OwnerIdTypeWrapperObject = new OwnerIdTypeWrapper();
        // OwnerIdTypeWrapperObject.ownerType = e[0].Owner.Type;
        OwnerIdTypeWrapperObject.ownerId = UserInfo.getUserId();
        //if(e[0].Owner.Type != 'User'){
            //OwnerIdTypeWrapperObject.ownerId = UserInfo.getUserId() ;
        //}else{
            //OwnerIdTypeWrapperObject.ownerId = e[0].OwnerId;
        //}
        //system.debug('Owner Id: '+e[0].OwnerId);
        //string k= e[0].OwnerId;
        return OwnerIdTypeWrapperObject;
    }

    Public class OwnerIdTypeWrapper{
        @AuraEnabled public String ownerId;
        @AuraEnabled public String ownerType;
    }

    @AuraEnabled
    public static string createEventMethodCheckIn(Event newRec){
        System.debug('Inside Create event');
        System.debug('Location Lat:'+newRec.Check_In_Location__Latitude__s);
        System.debug('Location Lon:'+newRec.Check_In_Location__Longitude__s);
        System.debug('newRec'+ newRec);
        if(newRec!=null){
            newRec.StartDateTime=System.now();
            newRec.EndDateTime=System.now();
            newRec.Check_In_Date_Time__c=System.now();
            System.debug('Owner Id Print ::: '+newRec.OwnerId);
            insert newRec;
            createCheckIn(newRec);
        }
        return 'success';
    }
    
     @AuraEnabled
    public static string createEventMethodCheckOut(Event newRec, string id){
        System.debug('Inside Update event');
        System.debug('Id In Check-Out'+ id);
        System.debug('newRec:'+newRec);
        System.debug('Location Lat:'+newRec.Check_Out_Location__Latitude__s);
        System.debug('Location Lon:'+newRec.Check_Out_Location__Longitude__s);
        if(newRec!=null) {
            Check_In_Out__c check=[SELECT Id,Purpose__c,Visit__c,Event_ID_Check_In__c FROM Check_In_Out__c
            WHERE Visit__c=:id ORDER BY CreatedDate DESC LIMIT 1];
            List<Event> e=[SELECT id, Subject, Description, Check_In_Comments__c,
            Check_Out_Comments__c, Check_In__c, WhatId FROM Event 
            WHERE Id=:check.Event_ID_Check_In__c LIMIT 1];
            newRec.Id=e[0].id;
            newRec.Check_Out_Date_Time__c=System.now();
            //newRec.OwnerId = newRec.OwnerId == null || newRec.OwnerId == ''? UserInfo.getUserId() : newRec.OwnerId;
            Update newRec; 
            updateCheckOut(newRec,id);
        }
        return 'success';
    }

    private static void createCheckIn(Event newRec){
        system.debug('Inside CREATE CHECK IN');
        System.debug('Event::'+newRec);
        Check_In_Out__c checkIn=new Check_In_Out__c();
        checkIn.Visit__c=newRec.WhatId;
        checkIn.Who__c= newRec.OwnerId;
        checkIn.Purpose__c=newRec.Subject;
        checkIn.Why_Text__c= newRec.Check_In_Comments__c;
        checkIn.Check_In__c= true;
        checkIn.When__c=System.now();
        checkIn.Where__Latitude__s=newRec.Check_In_Location__Latitude__s;
        checkIn.Where__Longitude__s=newRec.Check_In_Location__Longitude__s;
        checkIn.Event_ID_Check_In__c=newRec.Id;
        System.debug('checkin>>'+checkIn);
        insert checkIn;
    }

    private static void updateCheckOut(Event updRec,string oppId){
        Check_In_Out__c check = [SELECT Id, Purpose__c, Visit__c FROM Check_In_Out__c
        WHERE Visit__c =: oppId ORDER BY CreatedDate DESC LIMIT 1];
        System.debug(check);
        //check.Comments__c=updRec.Description;
        //check.Note__c=updRec.Note__c;
        check.Why_Check_Out__c= updRec.Check_Out_Comments__c;
        check.Where_Check_Out__Latitude__s=updRec.Check_Out_Location__Latitude__s;
        check.Where_Check_Out__Longitude__s=updRec.Check_Out_Location__Longitude__s;        
        //check.Check_Out_Comments__c=updRec.Check_Out_Comments__c;
        check.Meeting_Purpose__c=updRec.Meeting_Purpose__c;
        check.Check_Out__c= true;
        check.When_Check_Out__c=System.now();
        check.Event_ID_Check_Out__c=updRec.Id;
        Update check;
        Visit__c visRec = new Visit__c();
        visRec.Id = oppId;
        visRec.CheckOut_Comments__c = updRec.Check_Out_Comments__c;
        visRec.Visit_Purpose__c = updRec.Meeting_Purpose__c;
        update visRec;

    }

    @AuraEnabled
    public static String createTask(Task taskRec,Task accountId){
        taskRec.OwnerId = UserInfo.getUserId();
        taskRec.Subject = taskRec.Subject+' : '+UserInfo.getName();
        System.debug('TASK:::::'+taskRec.Subject);
        insert taskRec; 
        accountId.OwnerId = UserInfo.getUserId();
        accountId.Subject = accountId.Subject+' : '+UserInfo.getName();
        System.debug('TASK:::::'+taskRec.Subject);
        insert accountId; 
        return 'Succes';
    }

    Public class OppAndDateTimeWrapper{
        public OppAndDateTimeWrapper(){
            currentDateTime= System.now();
            currentTime='';
            oppObject = new Visit__c();
        }
        @AuraEnabled public DateTime currentDateTime;
        @AuraEnabled public String currentTime;
        @AuraEnabled public Visit__c oppObject;
    }
}