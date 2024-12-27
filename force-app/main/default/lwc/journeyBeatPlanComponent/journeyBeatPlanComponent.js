/**
 * @description       : 
 * @author            : Tejaswini Gonuru
 * @group             : 
 * @last modified on  : 8-07-2022
 * @last modified by  : Tejaswini Gonuru
**/
import { LightningElement, track } from 'lwc';
import getRouteStores from '@salesforce/apex/BeatPlanController.getRouteAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './journeyBeatPlanComponent.html';
import MobileView from './journeyBeatPlanComponentMobileView.html';
import savePlan from '@salesforce/apex/journeyPlanCreate.savePlanRecord';
import saveRecord from '@salesforce/apex/journeyPlanCreate.saveJourneyRecord';
import { NavigationMixin } from 'lightning/navigation';
export default class JourneyBeatPlanComponent extends NavigationMixin(LightningElement) {
@track firstPage = true;
@track secondPage = false;
@track addRowsFields=[];
@track starttime = [];
@track endtime = [];
//@track accountsRecord = {checkValue : false, isDisabled : true,starttime : '',endtime : ''};
@track accountsRecord;
@track journeyDetails ={planItemName:null,startDateValue:null,endDateValue:null}
@track journeyId;
@track planId;
searchValue = '';
routeId;
addRowsFieldsvalues=[];    
storeValues;
storenames;
checkValue;
storedata=[];
beatList=[];
beat = {Name:'',acclist:''};
@track beatSelected = {Id : '', Name : ''};


render(){
    return FORM_FACTOR==='Large' ? DesktopView : MobileView;
}

connectedCallback(){
    console.log('First Page Before :: '+this.firstPage);
    this.firstPage = true;
    this.secondPage = false;
    this.addRow();
}

renderedCallback(){
    console.log('this.template.querySelectorAll(c-custom-lookup)'+this.template.querySelectorAll('c-custom-lookup'));
    this.template.querySelectorAll('c-custom-lookup').forEach(item=>{
        item.populateDefault();
     });
}

handleStart(){
    console.log('journeyDetails :: ',this.journeyDetails);
    var pass=false;
    if(this.journeyDetails.planItemName==null || this.journeyDetails.planItemName==''){
        this.showToastMessage('Error','Please Enter Name.','error');
        return;
    }
    if(((this.journeyDetails.endDateValue != null && this.journeyDetails.endDateValue != '') && (this.journeyDetails.startDateValue != null && this.journeyDetails.startDateValue !=  '')) && this.journeyDetails.endDateValue <= this.journeyDetails.startDateValue){
        this.showToastMessage('Error','Start Date should be greater than End Date.','error');
        return;
    }
    if(pass){
        return;
    }
    this.firstPage = false;
    this.secondPage = true;
}
addRow()
{
    this.addRowsFields.push({
        Id :'',
        Name : '',
        accountsRecord : [],
        uniqueId : Math.random(),
        isChecked : false,
        isDisabled:true  ,
        beatName:'',
        beatId:''  
    });
}   
handleBeatChange(event){
    var searchKey = event.detail;
    console.log('searchKey::'+JSON.stringify(searchKey));
    this.searchValue = searchKey.Name;
    this.routeId= searchKey.Id;
    console.log("routeID::"+this.routeId);
    console.log('this.searchValue::::' + this.searchValue);
    var uqId = event.currentTarget.dataset.id;
    this.addRowsFields.forEach(element => {
        if(element.uniqueId == uqId)
        {
            console.log('inside::');
            element.beatName=event.detail.Name;
            element.beatId=event.detail.Id;
        } 
    });
    this.handlegetAccountsList(uqId);
}
handlegetAccountsList(unq){
    if (this.routeId !== '') {
        this.addRowsFields.forEach(element => {
            if(element.uniqueId == unq)
            {
                console.log('getRouteStores::');
                getRouteStores({
                    routeId: this.routeId
                })
                .then(result => {
                    element.accountsRecord = result.filter(item=>{
                        item.accID=item.Account__c;
                        item.isDisabled =true;
                        return item;
                    });
                    element.Name=this.searchValue;
                    element.Id=this.routeId;
                    console.log('Accounts:::' + JSON.stringify(element.accountsRecord));
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event); 
                    element.accountsRecord = null;
                });
            }
        });
    }else {
        const event = new ShowToastEvent({
            variant: 'error',
            message: 'Search text missing..',
        });
        this.dispatchEvent(event);
    }
} 
handleBeatNoChange(event){
    console.log('NoBeatSelected::',event.currentTarget.dataset.id);
    var unqId = event.currentTarget.dataset.id;
    this.addRowsFields.forEach(element => {
        if(element.uniqueId == unqId)
        {
            element.accountsRecord = [];
            element.beatName='';
            element.beatId='';

        }
    })
    this.searchKey = "";  
    this.searchValue = null;  
    this.routeId = null;  
      
}
checkedHandler(event)
{   
    this.storenames=event.target.name;
    console.log('this.storenames'+this.storenames);
    this.storeValues=event.currentTarget.dataset.id;
    console.log('this.storeValues'+this.storeValues);
    this.addRowsFields.forEach(element => 
    {
        if(element.uniqueId == this.storenames)
        {
            for (var i = 0; i < element.accountsRecord.length; i++) {
                if(element.accountsRecord[i].Id == this.storeValues )
                {
                    element.accountsRecord[i].checkValue =event.target.checked;
                    element.accountsRecord[i].isDisabled = !event.target.checked;
                } 
            }   
            }
        console.log('addRowsFields'+JSON.stringify(this.addRowsFields));
    });
    //this.allcheckedthencheckabove();
}
planname(event)
{
    this.journeyDetails.planItemName=event.target.value;
    console.log('this.planItemName'+this.planItemName);
}
startdate(event)
{
    this.journeyDetails.startDateValue=event.target.value;
    console.log('this.startDateValue'+this.startDateValue);
}
enddate(event)
{
    this.journeyDetails.endDateValue=event.target.value;
    console.log('this.startDateValue'+this.endDateValue);
}

saveClicked()
{
    console.log("Save clicked::",this.journeyDetails);
    var accIds=[];
    var pass=false;
    this.addRowsFields.forEach(element => 
    {
        element.accountsRecord.forEach(el => {
            if(el.checkValue == true){
                accIds.push(el);
            }
        })

    });
    console.log('accIds::',accIds);
    if(accIds.length == 0){
        this.showToastMessage('Error','Please Select.','error');
        return;
    }
    accIds.forEach(el => 
    {
        if(el.checkValue == true && (el.starttime == '' || el.starttime == null || el.endtime == '' || el.endtime == null))
        {
            this.showToastMessage('Error','Please fill the fields.','error');
            pass=true;
            return;
        }
    });
    if(pass){
        return;
    }

    saveRecord({objJourney: this.journeyDetails})
    .then(result => {
        this.journeyId=result.Id;
        console.log("journeyId"+this.journeyId);
        this.savePlanFunction();
        this.navToJourneyPlanRecord();
        window.console.log('result ===> '+result);
        this.showToastMsg("Success","JournePlan Created")        
    })
    .catch(error => {
        this.error = error.message;
    });
}
navToJourneyPlanRecord()
{
    console.log('Enter into journey nav function');
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.journeyId,
            objectApiName: 'Journey_Plan__c',
            actionName: 'view'
        },
    });
}
savePlanFunction()
{
    console.log("Enter into save plan function");
    savePlan({objPlan: this.addRowsFields,jrId :this.journeyId })
    .then(result => {
        this.planId=result.Id;
        console.log("planId"+this.planId);
        window.console.log('result ===> '+result);
        this.showToastMsg("Success","JourneyPlan Created")        
    })
    .catch(error => {
        this.error = error.message;
    });
}
//TOAST MESSAGE FUNCTION
showToastMessage(title, message, variant) 
{
    const evt = new ShowToastEvent({
    title: title,
    message: message,
    variant: variant
    });
    this.dispatchEvent(evt);
}
endDateAccount(event)
{
    // this.endtime.push(event.target.value);
    // console.log('this.starttime'+this.endtime);
    this.storenames=event.target.name;
    console.log('this.storenames'+this.storenames);
    this.storeValues=event.currentTarget.dataset.id;
    console.log('this.storeValues'+this.storeValues);
    this.addRowsFields.forEach(element => {
    if(element.uniqueId == this.storenames)
    {
        for (var i = 0; i < element.accountsRecord.length; i++) {
            if(element.accountsRecord[i].Id == this.storeValues )
            {
                element.accountsRecord[i].endtime =event.target.value;
            }        
            }
    }
    console.log('addRowsFields'+JSON.stringify(this.addRowsFields));
});
}
startDateAccount(event)
{
    // this.starttime.push(event.target.value);
    // console.log('this.starttime'+this.starttime);
    this.storenames=event.target.name;
    console.log('this.storenames'+this.storenames);
    this.storeValues=event.currentTarget.dataset.id;
    console.log('this.storeValues'+this.storeValues);
    this.addRowsFields.forEach(element =>
    {
        if(element.uniqueId == this.storenames)
        {
            for (var i = 0; i < element.accountsRecord.length; i++) {
                if(element.accountsRecord[i].Id == this.storeValues )
                {
                    element.accountsRecord[i].starttime =event.target.value;
                }
        }
    }
    console.log('addRowsFields'+JSON.stringify(this.addRowsFields));
});
}
handleCancel(){
    this.journeyDetails ={planItemName:'',startDateValue:'',endDateValue:''}
    this.beatSelected = {Id : '', Name : ''};
    this.template.querySelectorAll('c-custom-lookup').forEach(element=>{
        element.handleRemovePill()
    });
    this.addRowsFields = [];
    this.firstPage = true;
    this.secondPage = false;
    this.addRow();
    const custEvent = new CustomEvent('close');
    this.dispatchEvent(custEvent);
}
tempVar=true;
tempF='Kerala';
handleDeleteRow(event){
    //this.tempVar=false;
    var uqId = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    console.log('deluqId::',index);

   

    //this.template.querySelector(`[data-uniqueid= "${uqId}"]`).handleRemovePill();
    this.addRowsFields.splice(index,1);
    /*this.addRowsFields = this.addRowsFields.filter(element =>{
        return element.uniqueId != uqId;
    });*/
    
    this.tempVar=true;
    console.log('this.addRowsFields::',this.addRowsFields);
}
}