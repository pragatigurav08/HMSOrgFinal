/**
 * @description       : 
 * @author            : Tejaswini Gonuru
 * @group             : 
 * @last modified on  : 13-07-2022
 * @last modified by  : Tejaswini Gonuru
**/
import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createEventMethodCheckIn from '@salesforce/apex/ManageVisitController.createEventMethodCheckIn';
import getOwnerIdMethod from '@salesforce/apex/ManageVisitController.getOwnerIdMethod';
import getLatestEvent from '@salesforce/apex/ManageVisitController.getLatestEvent';
import getCurrentOpp from '@salesforce/apex/ManageVisitController.getCurrentVisit';
import updateVisitRec from '@salesforce/apex/ManageVisitController.updateVisitRec';
import { NavigationMixin } from 'lightning/navigation';
import { publish, MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE }from 'lightning/messageService';
import SAMPLEMC from '@salesforce/messageChannel/LMSMessage__c';
import lmsMC2 from "@salesforce/messageChannel/LMSMessage2__c";
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './manageVisits.html';
import MobileView from './manageVisitsMobileView.html';
export default class ManageVisits extends NavigationMixin(LightningElement) {
    
    timeVal;
    spinnerOn = false;
    showStartLabel = true;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                lmsMC2,
                (message) => this.handleMessage(message), { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(event) {
        console.log('inside subscribed message');
        this.showRelatedListMobileSpecific = true;
        let aura = window["$" + "A"];
        aura.get('e.force:refreshView').fire();
        this.getLatestEventFunction();
        this.getOwnerIdMethodFunction();
        this.getCurrentOppFunction();
    }
    
    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = undefined;
        //releaseMessageContext(this.messageContext);
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }
    
    publishFunction(){
        const message = {
            recordId: '001xx000003NGSFAA4',
            message : "This is simple message from LWC",
            source: "LWC",
            recordData: {accountName: 'Burlington Textiles Corp of America'}
        };
        publish(this.messageContext, SAMPLEMC, message);
    }
    @api recordId;
    @api objectApiName;
    @track taskList = [];
    @track assignedto={};
    @track record = {
        Note__c: '',
        Whatd: '',
        OwnerId: '',
        Subject: '',
        Check_In__c: '',
        Check_In_Location__Latitude__s: '',
        Check_In_Location__Longitude__s: '',
        Check_In_Comments__c:''
    }
    @track interval;
    @track showStartLabel = true;
    @track timeVal = '00 : 00 : 00';
    @track currentVisit = {};
    @track currentVisitAccount = {};

    @wire(getRecord, {recordId: '$recordId', fields: ['Visit__c.Id']})

    getOpp({ data, error }) {
        console.log('Opp Record => ', data, error);
        if(data){
            this.getLatestEventFunction();
            this.getOwnerIdMethodFunction();
            this.getCurrentOppFunction();
        }else if(error){
            console.error('ERROR in Wire => ', JSON.stringify(error)); // handle error properly
        }
    }

    @track showOppVisitComponent = true;

    render(){
        return FORM_FACTOR==='Large' ? DesktopView : MobileView;
    }

    getCurrentOppFunction(){
        getCurrentOpp({recordId: this.recordId})
        .then(result => {
            this.currentVisit = result;
            this.currentVisitAccount = result.Account__r;
            console.log('Current Opp :: '+JSON.stringify(this.currentVisit));
        })
        .catch(error => {
            console.log('Error (getLatestEventFunction) ::: ' + JSON.stringify(error));
        });
    }

    getLatestEventFunction(){
        this.stopTimer();
        clearInterval(this.interval);
        getLatestEvent({recordId: this.recordId})
        .then(result => {
            console.log('Check In/Out Print ::: '+JSON.stringify(result));
            if(result.length != 0){
                if(result[0].Check_In__c == true && result[0].Check_Out__c == false){
                    let eventCreatedDate = new Date(result[0].CreatedDate);
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			        let monthName = months[eventCreatedDate.getMonth()];
                    let dateNumber = eventCreatedDate.getDate();
                    let yearNumber =  eventCreatedDate.getFullYear();
                    let hourNumber = eventCreatedDate.getHours();
                    let minuteNumber = eventCreatedDate.getMinutes();
                    let secondNumber = eventCreatedDate.getSeconds();
                    let eventCreatedDateVar = monthName+' '+dateNumber+' '+yearNumber+' '+String(hourNumber).padStart(2, '0')+':'+String(minuteNumber).padStart(2, '0')+':'+String(secondNumber).padStart(2, '0');
                    console.log('Event Created Date Variable Format ::: '+eventCreatedDateVar);
                    this.startTimer(eventCreatedDateVar);
                }else{
                    this.stopTimer();
                }
            }else{
                this.stopTimer();
            }
            this.refreshFunction();
        })
        .catch(error => {
            console.log('Error (getLatestEventFunction) ::: ' + JSON.stringify(error));
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

    startTimer(eventCreatedDateVar){
        this.showStartLabel = false;
        clearInterval(this.interval);
        this.interval = setInterval(function (){  
            this.displayCountdown(eventCreatedDateVar);
        }.bind(this), 1000);
    }

    stopTimer(){
        this.showStartLabel = true;
        clearInterval(this.interval);
        this.timeVal = '00 : 00 : 00';
    }

    displayCountdown(eventCreatedDateVar){
        //console.log('Event Created Date Var Inside displayCountdown :: '+eventCreatedDateVar)
        var eventCreatedDateVarTime = new Date(eventCreatedDateVar);
        var now_date = new Date();
        var timeDiff = now_date.getTime()-eventCreatedDateVarTime.getTime();
        this.isValid=true;
        var seconds=Math.floor(timeDiff/1000); // seconds
        var minutes=Math.floor(seconds/60); //minute
        var hours=Math.floor(minutes/60); //hours
        var days=Math.floor(hours/24); //days
        hours %=24; 
        minutes %=60;
        seconds %=60;
        //console.log("Days:"+ days+" Hours:"+hours+" min:"+minutes+" sec:"+seconds);
        this.days=days;
        this.hours=hours;
        this.minutes=minutes;
        this.seconds=seconds;
        this.timeVal = String(hours).padStart(2, '0') + ' : ' +String(minutes).padStart(2, '0')+ ' : ' +String(seconds).padStart(2, '0');
    }

    @track spinnerOn = false;
    handleTimerController(event){
        this.spinnerOn = true;
        console.log('Show Start :: '+event.target.dataset.showstart);
        if(event.target.dataset.showstart == 'true'){
            this.updateVisitRecFunc(true);
        }else{
            this.updateVisitRecFunc(false);
        }
    }

    handleCheckInFunction(){
        this.getLocationAndCheckIn();
    }
    updateVisitRecFunc(isStart){
        updateVisitRec({ recordId: this.recordId,isStart:isStart})
        .then(result => {
            console.log('updateVisitRecResult:::' , result);
            if(isStart){
                this.handleCheckInFunction();
            }
            else{
                this.handleCheckOutFunction();   
            }
            this.spinnerOn = false;
        })
        .catch(error => {
            this.error = error.message;
            console.log('Error:::' + JSON.stringify(error));
        });

    }

    getLocationAndCheckIn(){
        navigator.geolocation.getCurrentPosition(position => {
            //Get the Latitude and Longitude from Geolocation API
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            this.record.Subject = this.currentVisit.Category__c;
            this.record.Check_In__c = true;
            this.record.Check_In_Location__Latitude__s = latitude;
            this.record.Check_In_Location__Longitude__s = longitude;
            this.record.WhatId = this.recordId;
            console.log('Owner Type :: ');
            console.log('Owner Type :: '+this.assignedto.ownerType);
            this.record.OwnerId = this.assignedto.ownerId;
            this.record.Check_In_Comments__c = this.currentVisit.Category__c;

            if(this.currentVisit.Category__c == null || this.currentVisit.Category__c == '') {
                this.toast('Error', 'Please Select Category On Current Record', 'error', 'pester');
                this.spinnerOn = false;
                return;
            }else{
                this.createEventMethodCheckInFunction();
            }
        });
    }

    createEventMethodCheckInFunction(){
        createEventMethodCheckIn({ newRec: this.record })
        .then(result => {
            console.log('Result:::' + result);
            this.toast('Hello !', 'You are logged In...', 'success', 'pester');
            this.refreshFunction();
            this.getLatestEventFunction();
            this.spinnerOn = false;
        })
        .catch(error => {
            this.error = error.message;
            console.log('Error:::' + JSON.stringify(error));
        });
    }

    @track checkOutModalOpen = false;
    handleCheckOutFunction(){
        this.handleOpenCheckOutModal();
    }

    handleOpenCheckOutModal(){
        this.checkOutModalOpen = true;
        console.log('checkOutModalOpen:::' , this.checkOutModalOpen);
        this.showOppVisitComponent = false;
    }

    handleCloseCheckOutModal(){
        //this.refreshFunction();
        //this.getLatestEventFunction();
        this.checkOutModalOpen = false;
        this.spinnerOn = false;
        this.showOppVisitComponent = true;
        this.publishFunction();
    }

    handleLoad(){
        this.refreshFunction();
        this.getLatestEventFunction();
    }

    refreshFunction() {
        console.log('cancel');
        setTimeout(() => {

                // eslint-disable-next-line no-eval
            
                eval("$A.get('e.force:refreshView').fire();");
            
              }, 1000);
        // let aura = window["$" + "A"];
        // aura.get('e.force:refreshView').fire();
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
    handleRowForActionClose(){
        this.showOppVisitComponent = true;
        this.publishFunction();
    }

    navigateToGoogleMaps() {
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                //url: 'https://www.google.com/maps'
                url: 'http://maps.google.com/maps?f=q&hl=en&q='+this.currentVisitAccount.BillingStreet+this.currentVisitAccount.BillingCity+this.currentVisitAccount.BillingPostalCode+this.currentVisitAccount.BillingState+'&om=1'

            }
        }
        //true // Replaces the current page in your browser history with the URL
      );
    }
}