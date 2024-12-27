/**
 * @description       : 
 * @author            : Saurav Kashyap
 * @group             : SK Group
 * @last modified on  : 01-09-2024
 * @last modified by  : Saurav Kashyap
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   21-08-2023   Saurav Kashyap   Initial Version
**/
import { LightningElement,api,track } from 'lwc';


export default class BookATestRideComponent extends LightningElement {
    @api recordId;
    @track firstTemplate = true;
    
    @track
    progressBarList = [
        { name: 'GENERAL', css : this.activeCSS, buttonCSS : this.buttonDefaultCSS, isSuccess : false, isActive : true, isVisited : true, isError : false  
        },
        { name: 'TEAM', css : this.defaultCSS,  buttonCSS : this.buttonDefaultCSS,  isSuccess : false, isActive : false, isVisited : false, isError : false  
        },
        { name: 'ACCOUNT STRUCTURE', css : this.defaultCSS,  buttonCSS : this.buttonDefaultCSS,  isSuccess : false, isActive : false, isVisited : false, isError : false  
        },
        { name: 'SOLUTIONS', css : this.defaultCSS,  buttonCSS : this.buttonDefaultCSS,  isSuccess : false, isActive : false, isVisited : false, isError : false  
        },
        { name: 'TARGET', css : this.defaultCSS,  buttonCSS : this.buttonDefaultCSS,  isSuccess : false, isActive : false, isVisited : false, isError : false  
        },
        { name: 'GOALS', css : this.defaultCSS,  buttonCSS : this.buttonDefaultCSS,  isSuccess : false, isActive : false, isVisited : false, isError : false  
        }
    ]

    progressPercentWidthCSS = 'width:0%';
    successCSS = 'position-relative slds-progress__item slds-is-completed';
    activeCSS = 'position-relative slds-progress__item slds-is-active';
    visitedCSS = 'position-relative slds-progress__item slds-is-completed slds-is-visited';
    defaultCSS = 'position-relative slds-progress__item';
    buttonDefaultCSS = 'slds-button slds-progress__marker';
    buttonVisitedCSS ='slds-button slds-button_icon slds-progress__marker slds-progress__marker_icon';

    connectedCallback(){
    }

    //function to close the modal
    handleCancel() {
        let aura = window["$" + "A"];
        aura.get('e.force:refreshView').fire();
        const closeQA = new CustomEvent('close');
        this.dispatchEvent(closeQA);
    }
}