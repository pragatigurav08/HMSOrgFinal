import { LightningElement, track } from 'lwc';
import getAccRecrds from '@salesforce/apex/JourneyPlanVisitController.getAccRecrds';
import getAccFilterList from '@salesforce/apex/JourneyPlanVisitController.getAccFilterList';
import saveAllValues from '@salesforce/apex/JourneyPlanVisitController.saveAllValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './journeyPlanVisitComponent.html';
import MobileView from './journeyPlanVisitMobileComponent.html';
import { NavigationMixin } from 'lightning/navigation';

export default class JourneyPlanVisitComponent extends NavigationMixin(LightningElement) {
@track firstPage = true;
@track counterVisits = 0;
@track secondPage = false;
@track PlanListValues=[];
@track journeyDetails ={planItemName:null,startDateValue:null,endDateValue:null};
@track SchRec = [];
@track AccData = [];
showModal=false;
counterlength;
@track visitRec = {Account__c:'',PlannedVisitStartTime__c:this.selectedDate,PlannedVisitEndTime__c:this.selectedDate};

render(){
    return FORM_FACTOR==='Large' ? DesktopView : MobileView;
}

connectedCallback(){
    console.log('First Page Before :: '+this.firstPage);
    this.firstPage = true;
    this.secondPage = false;
    this.getAccountData();
}


renderedCallback(){
    this.showHideButton();
}

getAccountData(){
    getAccRecrds()
    .then(result => {
        console.log("getAccRecrds",result);
        this.AccData=result;
    })
    .catch(error => {
        this.error = error.message;
    });

    //this.showHideButton();
}
planname(event)
{
    this.journeyDetails.planItemName=event.target.value;
    console.log('this.planItemName'+this.journeyDetails.planItemName);
}
startdate(event)
{
    this.journeyDetails.startDateValue=event.target.value;
    console.log('this.startDateValue'+this.journeyDetails.startDateValue);
}
enddate(event)
{
    this.journeyDetails.endDateValue=event.target.value;
    console.log('this.endDateValue'+this.journeyDetails.endDateValue);
}
handleStart(){
    console.log('journeyDetails :: ',this.journeyDetails);
    var pass=false;
    if(this.journeyDetails.planItemName==null || this.journeyDetails.planItemName==''){
        this.showToastMessage('Error','Please Enter Name.','error');
        return;
    }
    else if(this.journeyDetails.startDateValue==null || this.journeyDetails.startDateValue==''){
        this.showToastMessage('Error','Please Enter Start Date.','error');
        return;
    }
    else if(this.journeyDetails.endDateValue==null || this.journeyDetails.endDateValue==''){
        this.showToastMessage('Error','Please Enter End Date.','error');
        return;
    }
    else if(((this.journeyDetails.endDateValue != null && this.journeyDetails.endDateValue != '') && (this.journeyDetails.startDateValue != null && this.journeyDetails.startDateValue !=  '')) && this.journeyDetails.endDateValue <= this.journeyDetails.startDateValue){
        this.showToastMessage('Error','Start Date should be greater than End Date.','error');
        return;
    }
    if(pass){
        return;
    }
    this.SchRec =this.getDates(new Date(this.journeyDetails.startDateValue), new Date(this.journeyDetails.endDateValue));
    console.log('SchRec',this.SchRec);
    this.firstPage = false;
    this.thirdPage=false;
    this.secondPage = true;
    
}
getDates(startDate, endDate) {
    console.log('Inside::');
    const date = new Date(startDate.getTime());
    console.log('date'+date);
    const dates = [];
    while (date <= endDate) {
        var month = date.getMonth()+1;
        dates.push({dateValue:new Date(date).toISOString(),
                    dateString:date.getDate()+'/'+ month +'/'+date.getFullYear(),
                    created:false});
        date.setDate(date.getDate() + 1);
        console.log('date',date);
    }
    return dates;
}
handleSearch(event){
    this.searchValue=event.target.value;
    this.load=true;
    this.AccData=[];
    getAccFilterList({keyword:this.searchValue})
    .then(result=>{
        console.log("getAccFilterList::",result);
        // result.forEach(item => {
        // if(selcProdIds.includes(item.Id) == false){
        //     this.productList.push(item);
        // }
        // });
        this.load=false;
        this.AccData=result;
        
    })
    .catch(error=>{
        console.log('error:::'+JSON.stringify(error));
    });
}
selectedAccountId;
selectedDate;
colidx;
rowidx;
handleAddVisit(event){
    this.selectedAccountId = event.currentTarget.dataset.accid;
    this.selectedAccnameacc=event.currentTarget.dataset.nameacc;
    this.selectedDate = event.currentTarget.dataset.date;
    //console.log('selected Date ->'+this.selectedDate)
    this.colidx=event.currentTarget.dataset.colindex;
    this.rowidx=event.currentTarget.dataset.rowindex;
    //this.accidx=event.currentTarget.dataset.accsindex;
    console.log('get col index:'+this.colidx);
    console.log('get row index:'+this.rowidx);
    console.log('selectedAccIndex::',this.selectedAccIndex);
    console.log('accountId::',this.selectedAccountId);
    console.log('selectedDate::',this.selectedDate);
    //this.selectedDate.setMinutes(this.selectedDate.getMinutes() + this.selectedDate.getTimezoneOffset())
    this.showModal = true;
    //var utcFormatSelcDate= this.selectedDate.getUTCDate();
    console.log('utcFormatSelcDate::',this.selectedDate);
    this.visitRec = {Account__c:this.selectedAccountId,AccountName:'',PlannedVisitStartTime__c:this.selectedDate,PlannedVisitEndTime__c:this.selectedDate};
    
}
handleVisitChange(event){
    var fieldName=event.target.name;
    console.log('fieldName'+fieldName);
    //fieldName.setMinutes(fieldName.getMinutes() + fieldName.getTimezoneOffset())
    
    var newValue=event.target.value;
    console.log('newValue'+newValue);
    var dt = new Date(newValue);
    let dtOffset = new Date(dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset()));

    //newValue.setMinutes(newValue.getMinutes() + newValue.getTimezoneOffset())
    //console.log()
    console.log('dtOffset'+dtOffset.toISOString());
    switch(fieldName){
        case 'PlannedVisitStartTime__c':
            this.visitRec.PlannedVisitStartTime__c=dtOffset.toISOString();
            break;
        case 'PlannedVisitEndTime__c':
            this.visitRec.PlannedVisitEndTime__c=dtOffset.toISOString();
            break;
    }

    console.log('visitRec:::::->*',this.visitRec);
}
closeModal(){
    this.showModal=false;
    this.visitRec = {Account__c:'',AccountName:'',PlannedVisitStartTime__c:'',PlannedVisitEndTime__c:''};
}
@track visitList=[];
handleModalSave(){
    var pass=false;
    if(this.visitRec.PlannedVisitStartTime__c==null || this.visitRec.PlannedVisitStartTime__c=='' ){
        this.showToastMessage('Error','Please Enter Visit Start Time.','error');
        return;
    }
    else if(this.visitRec.PlannedVisitEndTime__c==null || this.visitRec.PlannedVisitEndTime__c==''){
        this.showToastMessage('Error','Please Enter Visit End Time.','error');
        return;
    }
    else if(((this.visitRec.PlannedVisitEndTime__c != null && this.visitRec.PlannedVisitEndTime__c != '') && (this.visitRec.PlannedVisitStartTime__c != null && this.visitRec.PlannedVisitStartTime__c !=  '')) && this.visitRec.PlannedVisitEndTime__c <= this.visitRec.PlannedVisitStartTime__c){
        this.showToastMessage('Error','Visit Start Time should be greater than End Time.','error');
        return;
    }
    
    if(pass){
        return;
    }
    var newListValuesMap={Account__c:'',AccountName:'',PlannedVisitStartTime__c:'',PlannedVisitEndTime__c:''};

    this.visitRec.Account__c=this.selectedAccountId;
    this.visitRec.AccountName=this.selectedAccnameacc;
    newListValuesMap.Account__c=this.visitRec.Account__c;
    newListValuesMap.AccountName=this.visitRec.AccountName;
    newListValuesMap.PlannedVisitStartTime__c=this.visitRec.PlannedVisitStartTime__c;
    newListValuesMap.PlannedVisitEndTime__c=this.visitRec.PlannedVisitEndTime__c
    console.log('visitRec values:::',this.visitRec);
    this.visitList.push(newListValuesMap);
    this.counterlength=this.visitList.length;
    console.log('this.visitList:'+JSON.stringify(this.visitList));
    var planedRec = this.getDates(new Date(this.visitRec.PlannedVisitStartTime__c), new Date(this.visitRec.PlannedVisitEndTime__c));
    console.log('planedRec:::',planedRec);
    planedRec.forEach(item => {
        this.SchRec=this.SchRec.filter(el => {

            console.log('el'+JSON.stringify(el));
            if(el.dateString==item.dateString){
                this.template.querySelector(`lightning-button[data-accid="${this.selectedAccountId}"][data-date="${el.dateValue}"]`).style.display='none';
                this.template.querySelectorAll(`[data-action="icon"][data-accid="${this.selectedAccountId}"][data-date="${el.dateValue}"]`).forEach(item => {
                    item.style='block';
                })
                
                el.created=true;
                this.counterVisits=this.counterVisits+1;
                console.log('this.counterVisits::'+this.counterVisits);
                //console.log('el::'+JSON.stringify(el));
            }
            return el;
        });
    });
    console.log('SchRec',JSON.stringify(this.SchRec));
    this.showModal=false;
    
    console.log('counter length:'+this.counterlength);
}

showHideButton(){
    //var planedRec = this.getDates(new Date(this.visitRec.PlannedVisitStartTime__c), new Date(this.visitRec.PlannedVisitEndTime__c));
    console.log('inside showhidebutton:::');
    
    this.AccData.forEach(acc => {
        console.log('acc' + JSON.stringify(acc));
        this.SchRec.forEach(item => {
            console.log('sch->' + JSON.stringify(item));
            this.visitList.forEach(visit => {
                //var visitItem = this.getDates(new Date(this.visitRec.PlannedVisitStartTime__c), new Date(this.visitRec.PlannedVisitEndTime__c));
                //console.log('visit'+JSON.stringify(visit));
                //console.log('visit item' + JSON.stringify(visitItem));

                //console.log('visitItem.dateString ' + visitItem[0].dateString);
                console.log('item.dateString ' + item.dateString);
                console.log('visit.Account__c ' + visit.Account__c);
                console.log('acc.Id ' + acc.Id );
                let visitDate; 
                if(visit.PlannedVisitStartTime__c){
                    let dt = new Date(visit.PlannedVisitStartTime__c);
                    visitDate = (dt.getDate())+'/'+ (dt.getMonth()+1) +'/'+dt.getFullYear();
                }

                    //visitDate =date.toISOString().substring(0, 10);
                    //
                    console.log('visitDate' + visitDate);
                if(visitDate === item.dateString && visit.Account__c === acc.Id  ){
                    console.log('inside if condition:::');
                    if(this.template.querySelector(`lightning-button[data-accid="${acc.Id}"][data-date="${item.dateValue}"]`))
                        this.template.querySelector(`lightning-button[data-accid="${acc.Id}"][data-date="${item.dateValue}"]`).style.display='none';
                    this.template.querySelectorAll(`[data-action="icon"][data-accid="${acc.Id}"][data-date="${item.dateValue}"]`).forEach(item => {
                        item.style='block';
                    })
                    
                    
                    //console.log('el::'+JSON.stringify(el));
                }
               // return el;
            });
        });
    })
    
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
handleCancel(){
    this.firstPage = true;
    this.secondPage = false;
    this.thirdPage=false;
    const custEvent = new CustomEvent('close');
    this.dispatchEvent(custEvent);
}
clickedDetailsView()
{
   this.firstPage=false;
   this.secondPage=false;
   this.thirdPage=true;
}
deltedClicked(event)
{
    console.log("The Deleted buton clicked");
    var planedRec = this.getDates(new Date(this.visitRec.PlannedVisitStartTime__c), new Date(this.visitRec.PlannedVisitEndTime__c));
    console.log('planedRec:::',planedRec);
    this.deletedAccountId = event.currentTarget.dataset.accid;
    this.deletedStartDate = event.currentTarget.dataset.date;
    
    planedRec.forEach(item => {
    this.SchRec=this.SchRec.filter(el => {

        console.log('el'+JSON.stringify(el));
        if(el.dateString==item.dateString){
            this.template.querySelector(`lightning-button[data-accid="${this.deletedAccountId}"][data-date="${this.deletedStartDate}"]`).style.display='block';
            this.template.querySelector(`[data-actionval="icons"][data-accid="${this.deletedAccountId}"][data-date="${this.deletedStartDate}"]`).style.display='none';
            this.template.querySelector(`[data-delete="deleted"][data-accid="${this.deletedAccountId}"][data-date="${this.deletedStartDate}"]`).style.display='none';

            
            el.created=false;
            this.counterVisits=this.counterVisits-1;
            console.log('this.counterVisits::'+this.counterVisits);
            //console.log('el::'+JSON.stringify(el));
        }
        return el;
    });
    }); 
    this.visitList=this.visitList.filter(el =>{
        console.log('el****'+JSON.stringify(el));
        if(el.Account__c != this.deletedAccountId && el.PlannedVisitStartTime__c != this.deletedStartDate)
        {
            console.log("Condition is true");

            console.log("elllll::"+JSON.stringify(el));
            console.log('finalvalues****'+JSON.stringify(this.visitList));
            return el;

        }
        
    })
    this.counterlength=this.visitList.length;
    console.log("This is good::"+JSON.stringify(this.visitList));
}
previousClicked()
{
    this.thirdPage=false;
    this.firstPage=false;
    this.secondPage=true;
    /*this.visitList.forEach(item =>{
        console.log('this.visitList Printing values'+JSON.stringify(this.visitList));
            if(item.Account__c != null )
            {
                console.log('condition is trued');
                this.template.querySelector(`lightning-button[data-accid="${item.Account__c}"][data-date="${item.PlannedVisitStartTime__c}"]`).style.display='none';
                this.template.querySelectorAll(`[data-action="icon"][data-accid="${item.Account__c}"][data-date="${item.PlannedVisitStartTime__c}"]`).forEach(item => {
                    item.style.display='block';
                })
            }
           
    })*/
}


saveDetailsCliked()
{
    console.log("Final Save Clicked");
    console.log('this.visitList Printing values'+JSON.stringify(this.visitList));
    saveAllValues({journeyDetailsValues :this.journeyDetails, visitsDetails : this.visitList})
        .then(result => {
            
            console.log('result ===> '+result);
            this.journeyID=result.Id;
            this.showToastMessage('Success','Journey Plan created Successsfully!.','Success');
        
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes:{
                    recordId: this.journeyID,
                    objectApiName: 'Journey_Plan__c',
                    actionName: 'view'
                },
    
            });   
        })
        .catch(error => {
            this.error = error.message;
        });
}
}