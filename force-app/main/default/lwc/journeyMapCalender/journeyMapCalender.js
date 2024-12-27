/**
 * @description       : 
 * @author            : Tejaswini Gonuru
 * @group             : 
 * @last modified on  : 13-07-2022
 * @last modified by  : Tejaswini Gonuru
**/
import { api, LightningElement, track} from 'lwc';
import getPlanItms from '@salesforce/apex/JourneyMapCalenderController.getPlanItms';
import getVisit from '@salesforce/apex/JourneyMapCalenderController.getVisit';
import updateVisitRecord from '@salesforce/apex/JourneyMapCalenderController.updateVisitRecord';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/APPTL_fullCalender';
import getMapCal from '@salesforce/apex/JourneyMapCalenderController.getMapCal';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './journeyMapCalender.html';
import MobileView from './journeyMapCalenderMobile.html';
export default class JourneyMapCalender extends NavigationMixin(LightningElement) {
@api recordId;
load =false;
@track mapMarkers;
@track allEvents;
selecPlanItm;
selecPlanItmName;
selVisit;
selecVisitName;
showModal=false;
selectedVisitId;
@track mapClicked=true;
@track calendarcalled=false;
planItms; 
visitItms;
dropdownClass = 'slds-dropdown-trigger';   
@track visitRec = {PlannedVisitStartTime__c:'',PlannedVisitEndTime__c:''};

render(){
    return FORM_FACTOR==='Large' ? DesktopView : MobileView;
}

connectedCallback(){
    this.load=true;
    this.getPlanItmsFunc();
    
}
getPlanItmsFunc(){
    getPlanItms({recordId:this.recordId})
    .then(result=>{
        console.log('getPlanItms result::',result);
        if(result!= null){
            this.planItms = result.planItms;
            this.visitItms = result.visitItms;
            var temp1 = false;
            this.visitItms.forEach(item=>{
                if(temp1){
                    item.class = 'slds-box btn-light slds-p-around--medium tab-css btn-selc';
                    temp1 = false;
                }
                else{
                    item.class = 'slds-box btn-light slds-p-around--medium tab-css';  
                }
            });
            if(this.visitItms.length != 0){
                this.selVisit = 'ONLOAD';
                console.log('this.selVisit::',this.selVisit);
                this.selecPlanItmName = this.visitItms[0].Name;
                this.selecMenuItm ='VISITS';
                this.IsPlanItemsSelected=false;
            }
            var temp = true;
            this.planItms.forEach(item=>{
                if(temp){
                    item.class = 'slds-box btn-light slds-p-around--medium tab-css btn-selc';
                    temp = false;
                }
                else{
                    item.class = 'slds-box btn-light slds-p-around--medium tab-css';  
                }
            });
            
            if(this.planItms.length != 0){
                this.selecPlanItm =this.planItms[0].Id;
                this.selecPlanItmName = this.planItms[0].Name;
                console.log('selecPlanItmName::',this.selecPlanItmName);
                this.selecMenuItm ='PLAN ITEMS';
                this.IsPlanItemsSelected=true;
            }
            
            this.getMapCalFun();
        }
        this.load=false;
    })
    .catch(error=>{
        console.log('error:::'+JSON.stringify(error));
        this.load=false;
    });
}
selecMenuItm ='PLAN ITEMS';
IsPlanItemsSelected=true;
handleMenuItem(event){
    this.selecMenuItm = event.currentTarget.dataset.id;
    console.log('selecMenuItm:::'+this.selecMenuItm);
    if(this.selecMenuItm == 'PLAN ITEMS'){
        this.IsPlanItemsSelected=true;
    }
    else{
        this.IsPlanItemsSelected=false;
    }
    this.getMapCalFun();
    this.mapView();
} 
getMapCalFun(){
    this.load=true;
    getMapCal({recordId:this.recordId,selecPlanItm:this.selecPlanItm,selVisit:this.selVisit, IsPlanItemsSelected:this.IsPlanItemsSelected})
    .then(result=>{
        console.log('result::',result);
        this.mapMarkers=result.locationlist;
        this.allEvents=result.eventList;
        this.allEvents.forEach(item => {
            item.end = item.enddate;
        });
        if(this.visitUpdated == true){
            this.calender();
            this.visitUpdated = false;
        }
        this.load=false;
    })
    .catch(error=>{
        console.log('error:::'+JSON.stringify(error));
        this.load=false;
    });
}
handleClosePopover(){
    this.template.querySelector('[data-id="popoverCard"]').style.transform="translateX(-100%)";
    this.template.querySelector('[data-id="popoverCard"]').style.width="0%";
}
handlePlanItmSelected(event){
this.handleClosePopover();
this.handlePlanSelected(event);
}
handleVisSelected(event){
    this.handleClosePopover();
    this.handleVisitSelected(event);
    }
    
handlePlanSelected(event){
    this.selecPlanItm= event.currentTarget.dataset.id;
    this.selecPlanItmName = event.currentTarget.dataset.name;
    this.getMapCalFun();
    this.template.querySelectorAll('[data-tab="PlanItems"]').forEach(el=>{
        el.classList.remove('btn-selc');
    })
    
    this.template.querySelector(`[data-id= "${this.selecPlanItm}"]`).classList.add('btn-selc');
    this.template.querySelector('[data-button="CalenderView"]').classList.remove('btn-selc');
    this.template.querySelector('[data-button="MapView"]').classList.add('btn-selc');
    this.template.querySelector('[data-icon="Calendericon"]').classList.remove('icon-color');
    this.template.querySelector('[data-icon="Mapicon"]').classList.add('icon-color');

    this.mapClicked=true;
    this.calendarcalled=false;
    //this.mapView();

}
handleVisitSelected(event){
    this.selVisit= event.currentTarget.dataset.id;
    this.selecPlanItmName = event.currentTarget.dataset.name;
    this.getMapCalFun();
    this.template.querySelectorAll('[data-tab="visitItm"]').forEach(el=>{
        el.classList.remove('btn-selc');
    })
    
    this.template.querySelector(`[data-id= "${this.selVisit}"]`).classList.add('btn-selc');
    this.template.querySelector('[data-button="CalenderView"]').classList.remove('btn-selc');
    this.template.querySelector('[data-button="MapView"]').classList.add('btn-selc');
    this.template.querySelector('[data-icon="Calendericon"]').classList.remove('icon-color');
    this.template.querySelector('[data-icon="Mapicon"]').classList.add('icon-color');

    this.mapClicked=true;
    this.calendarcalled=false;
}
mapView()
{
    // this.isMapselected = true;
    // this.isCalselected = false;
    this.template.querySelector('[data-button="CalenderView"]').classList.remove('btn-selc');
    this.template.querySelector('[data-button="MapView"]').classList.add('btn-selc');
    this.template.querySelector('[data-icon="Calendericon"]').classList.remove('icon-color');
    this.template.querySelector('[data-icon="Mapicon"]').classList.add('icon-color');

    this.mapClicked=true;
    this.calendarcalled=false;
}
isMapselected =true;
isCalselected = false;
handleMapHover(){
    console.log('handleMapHover::')
    this.isMapselected = true;
    //this.isCalselected = false;
}
handleHoverOut(){
    console.log('handleHoverOut::')
    if(this.mapClicked == false){
        this.isMapselected =false;
    }
    if(this.calendarcalled == false){
        this.isCalselected = false;
    }
}
handleCalenderHover(){
    this.isCalselected = true;
    //this.isMapselected =false;
}
calendaPRessed()
{
    // this.isCalselected = true;
    // this.isMapselected =false;
    this.template.querySelector('[data-button="CalenderView"]').classList.add('btn-selc');
    this.template.querySelector('[data-button="MapView"]').classList.remove('btn-selc');
    this.template.querySelector('[data-icon="Calendericon"]').classList.add('icon-color');
    this.template.querySelector('[data-icon="Mapicon"]').classList.remove('icon-color');
    this.mapClicked=true;
    this.mapClicked=false;
    this.calendarcalled=true;
    this.calender();
}  
calender(){
    Promise.all([
        loadScript(this, FullCalendarJS + '/FullCalendarJS/jquery.min.js'),
        loadScript(this, FullCalendarJS + '/FullCalendarJS/moment.min.js'),
        loadScript(this, FullCalendarJS + '/FullCalendarJS/theme.js'),
        loadScript(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.js'),
        loadStyle(this, FullCalendarJS + '/FullCalendarJS/fullcalendar.min.css'),  
    ])
    .then(() => {
        this.initialiseFullCalendarJs();
    })
    .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        console.error({
            message: 'Error occured on FullCalendarJS',
            error
        });
    })
}
/**
 * @description Initialise the calendar configuration
 *              This is where we configure the available options for the calendar.
 *              This is also where we load the Events data.
 */
 initialiseFullCalendarJs() {
    const ele = this.template.querySelector('div.fullcalendar');
    console.log('inside initialise calender::',this.allEvents)
    $(ele).fullCalendar('removeEvents');
    $(ele).fullCalendar('renderEvents', this.allEvents, true);
    var self = this;

    //To open the form with predefined fields
    //TODO: to be moved outside this function
    function openActivityForm(date){
        console.log('openActivityForm:::'+date);
        self.selectedDate=date;
        //self.showModal = true;
    }

    function openEditForm(event){
        console.log('openEditForm:::',event);
        self.selectedVisitId=event.id;
        self.visitRecNavigation();
        //self.getVisitFunc();
        //self.showModal = true;
        
    }
    $(ele).fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay,listWeek'
        },
        themeSystem : 'standard',
        defaultDate: new Date(), 
        navLinks: true,
        editable:true,
        eventLimit: true,
        events: this.allEvents, 
        selectable: true,
        dragScroll : true,
        droppable: true,  
        draggable:true,
        height: 550,
        contentHeight: 'auto',
        eventClick: function(event,jsEvent, view) {
            jsEvent.preventDefault();
            console.log('openEditForm');
            openEditForm(event);
        },
        dayClick :function(date, jsEvent, view) {
            //alert('Day')
            jsEvent.preventDefault();
            console.log('openActivityForm');
            openActivityForm(date.format());
            //this.selectedEvent=true;
        },
        eventReceive: function(event){
            jsEvent.preventDefault();
            console.log('eventReceive');
        },
        eventDrop: function(event, delta, revertFunc) {
            jsEvent.preventDefault();
            console.log('eventDrop');
        },
    }); 
} 
visitRecNavigation(){
    console.log('Enter into Visit nav function');
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.selectedVisitId,
            objectApiName: 'Visit__c',
            actionName: 'view'
        },
    });
}
// Displaying PlanItemList for Mobile
handlePlanItemsList(event){
    this.selecMenuItm = event.currentTarget.dataset.id;
    console.log('selecMenuItm:::'+this.selecMenuItm);
    if(this.selecMenuItm == 'PLAN ITEMS'){
        this.IsPlanItemsSelected=true;
    }
    else{
        this.IsPlanItemsSelected=false;
    }
    this.handleOpen();
}
handleOpen(){
    this.template.querySelector('[data-id="popoverCard"]').style.transform="translateX(0%)";
    this.template.querySelector('[data-id="popoverCard"]').style.width="100%";
}
getVisitFunc(){
    this.load=true;
    console.log('selectedVisitId::',this.selectedVisitId);
    getVisit({recordId:this.selectedVisitId})
    .then(result=>{
        console.log('getVisit::',result);
        if(result != null){
            this.visitRec.PlannedVisitStartTime__c = result.PlannedVisitStartTime__c;
            this.visitRec.PlannedVisitEndTime__c = result.PlannedVisitEndTime__c;
            console.log('visitRec::',this.visitRec);
            this.showModal = true;
        }
        this.load=false;

    })
    .catch(error=>{
        console.log('error::'+JSON.stringify(error));
        this.load=false;
    });
}

closeModal(){
    this.showModal=false;
    this.visitRec = {PlannedVisitStartTime__c:'',PlannedVisitEndTime__c:''};
}
handleVisitChange(event){
    var fieldName=event.target.fieldName;
    var newValue=event.target.value;
    console.log('fieldName'+fieldName);
    console.log('newValue'+newValue);
    switch(fieldName){
        case 'PlannedVisitStartTime__c':
            this.visitRec.PlannedVisitStartTime__c=newValue;
            break;
        case 'PlannedVisitEndTime__c':
            this.visitRec.PlannedVisitEndTime__c=newValue;
            break;
    }
    console.log('visitRec:::',this.visitRec);
}
visitUpdated = false;
handleSave(){
    this.load=true;
    console.log('selectedVisitId::',this.selectedVisitId);
    console.log('visitRec::',this.visitRec);    
    updateVisitRecord({recordId:this.selectedVisitId,visitRec:this.visitRec})
    .then(result=>{
        console.log('updateVisitRecord::',result);
        if(result == 'success'){
            this.visitUpdated = true;
            this.closeModal();
            console.log('selecPlanItm::',this.selecPlanItm);
            this.getMapCalFun();
        }
        this.load=false;
    })
    .catch(error=>{
        console.log('error::'+JSON.stringify(error));
        this.load=false;
    });
}


}