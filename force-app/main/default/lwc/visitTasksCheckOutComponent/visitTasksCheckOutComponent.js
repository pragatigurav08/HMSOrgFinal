import { LightningElement, track, api } from 'lwc';
import getOwnerIdMethod from '@salesforce/apex/ManageVisitController.getOwnerIdMethod';
import getOpportunity from '@salesforce/apex/ManageVisitController.getVisit';
import getCurrentUser from '@salesforce/apex/ManageVisitController.getCurrentUser';
import createEventMethodCheckOut from '@salesforce/apex/ManageVisitController.createEventMethodCheckOut';
import createTask from '@salesforce/apex/ManageVisitController.createTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import {loadStyle} from 'lightning/platformResourceLoader';
import DesktopView from './visitTasksCheckOutComponent.html';
import MobileView from './visitTasksCheckOutMobileComponent';
import FORM_FACTOR from '@salesforce/client/formFactor';
export default class VisitTasksCheckOutComponent extends LightningElement {
    @api recordId;
    @track lstMarkers =[];
    @track zoomlevel ='';
    @track assignedto={};
    @track lat;
    @track lon;
    @track leadAndDateTimeWrapperObject={};
    @track accountId;
    @track leadObject={};
    @track accountNameObject = {};

    // renderedCallback(){
    //     if(FORM_FACTOR==='Large'){
    //         Promise.all([loadStyle(this, mapInnerCss)])
    //     }
    // }

    handleFollowUpDate(event) {
        this.nextFollowUp = event.target.value;
        console.log('Next Follow-Up: ' + JSON.stringify((this.nextFollowUp)));
    }

    render(){
        return FORM_FACTOR==='Large' ? DesktopView : MobileView;
        return DesktopView;
    }

    @track record = {
        Note__c: '',
        WhatId: '',
        OwnerId: '',
        Check_Out__c: '',
        Check_Out_Comments__c: '',
        Check_Out_Location__Latitude__s: '',
        Check_Out_Location__Longitude__s: '',
        Meeting_Purpose__c:''
    }

    toast(type, message, variant, mode){
        const evt = new ShowToastEvent({
            title: type,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    //@track noteValue = '';
    @track nextFollowUp = null;
    @track descriptionValue = '';
    submitFunction() {
        console.log('In Submit Function');
        //this.record.Note__c = this.noteValue;
        this.record.Check_Out_Comments__c = this.descriptionValue;
        this.record.Meeting_Purpose__c = this.visitPurposeValue;
        this.record.Check_Out__c = true;
        this.record.Check_Out_Location__Latitude__s = this.lat;
        this.record.Check_Out_Location__Longitude__s = this.lon;
        this.record.WhatId = this.recordId;
        console.log('Type Print :: ');
        console.log('Type Print :: '+this.assignedto.ownerType);
        this.record.OwnerId = this.assignedto.ownerId;
        console.log('this.record :: ',this.record);
        if(this.nextFollowUp == null || this.nextFollowUp == '') {
            this.createEventMethodCheckOutFunction();
        }else{
            this.createEventMethodCheckOutFunction();
            this.createTaskFunction();
        }
    }

    taskRecord = {
        WhatId: '',
        Subject: '',
        ActivityDate: '',
        OwnerId: '',
        Status: '',
    }
    accountTaskRecord = {
        WhatId: '',
        Subject: '',
        ActivityDate: '',
        OwnerId: '',
        Status: '',
    }

    createTaskFunction() {
        this.taskRecord.WhatId = this.recordId;
        this.taskRecord.ActivityDate = this.nextFollowUp;
        this.taskRecord.Status = 'Not Started';
        this.taskRecord.Subject = 'Next Follow-Up';

        this.accountTaskRecord.WhatId = this.accountId;
        this.accountTaskRecord.ActivityDate = this.nextFollowUp;
        this.accountTaskRecord.Status = 'Not Started';
        this.accountTaskRecord.Subject = 'Next Follow-Up';

        createTask({ taskRec: this.taskRecord, accountId:this.accountTaskRecord})
            .then(result => {
                this.toast('Hello !', 'Your Task Is Created...', 'success', 'pester');
                this.cancelFunction();
                this.loadFunction();
            })
            .catch(error => {
                this.error = error.message;
                console.log("Error::::" + JSON.stringify(error));
            });
    }

    createEventMethodCheckOutFunction(){
        console.log('this.record :: ',this.record);
        createEventMethodCheckOut({ newRec: this.record, id: this.recordId })
        .then(result => {
            console.log('Result:::' + result);
            this.toast('Hello !', 'You are logged Out...', 'success', 'pester');
            this.cancelFunction();
            this.loadFunction();
        })
        .catch(error => {
            this.error = error.message;
            console.log('Error:::' + JSON.stringify(error));
        });
    }

    cancelFunction() {
        const closeQA = new CustomEvent('close');
        this.dispatchEvent(closeQA);
    }

    loadFunction() {
        const closeQA = new CustomEvent('load');
        this.dispatchEvent(closeQA);
    }

    connectedCallback(){
        console.log('accountId:::'+this.accountId);
        this.getLocation();
        this.getOwnerIdMethodFunction();
        this.getOpportunityFunction();
        if(FORM_FACTOR==='Small'){
            this.getCurrentUserFunction();
        }
    }

    @track userObject={};
    getCurrentUserFunction(){
        getCurrentUser()
        .then(result => {
            console.log('result: ' + JSON.stringify(this.result));
            this.userObject = result;
            console.log('userObject : ' + JSON.stringify(this.userObject));
        })
        .catch(error => {
            console.log('Error:::' + JSON.stringify(error));
        });
    }

    @track visitPurposeValue;
    handleVisitPurpose(event){
        this.visitPurposeValue = event.target.value;
        console.log('Visit Purpose Value :: '+this.visitPurposeValue);
    }

    handleCommentsChange(event){
        this.descriptionValue = event.target.value;
        console.log('Description Value :: '+this.descriptionValue);
    }

    handleNoteChange(event){
        this.noteValue = event.target.value;
        console.log('Note Value :: '+this.noteValue);
    }

    getOpportunityFunction(){
        console.log('recid>>>>>>>',this.recordId);
        getOpportunity({recordId: this.recordId})
        .then(result => {
            console.log('result: ' + JSON.stringify(result));
            this.leadAndDateTimeWrapperObject = result;
            this.leadObject = result.oppObject;
            this.accountNameObject = result.oppObject.Account__r;
            console.log('accountNameObject : ' + JSON.stringify(this.accountNameObject));
            this.accountId =  result.oppObject.Account__c;
            console.log('accountId : ' + JSON.stringify(this.accountId));
            console.log('leadRecord : ' + JSON.stringify(this.leadAndDateTimeWrapperObject));
            this.getOwnerIdMethodFunction();
        })
        .catch(error => {
            console.log('Error:::' + JSON.stringify(error));
        });
    }

    getOwnerIdMethodFunction(){
        getOwnerIdMethod({id: this.recordId})
        .then(result => {
            console.log('result: ' + JSON.stringify(this.result));
            this.assignedto = result;
            console.log('assigned to: ' + JSON.stringify(this.assignedto));
        })
        .catch(error => {
            console.log('Error:::' + JSON.stringify(error));
        });
    }

    getLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                // Get the Latitude and Longitude from Geolocation API
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                this.lat= latitude;
                this.lon= longitude;
                console.log('Latitude: '+JSON.stringify(this.lat));
                console.log('Longitude: '+JSON.stringify(this.lon));
                this.lstMarkers = [{
                    location : {
                        Latitude: latitude,
                        Longitude : longitude
                    },
                    title : 'You are here'
                }];
                this.zoomlevel = "10";
            });
        }
    }
}