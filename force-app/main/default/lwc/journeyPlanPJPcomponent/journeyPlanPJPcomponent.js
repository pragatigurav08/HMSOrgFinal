import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import noHeader from '@salesforce/resourceUrl/noHeader2';
import {loadStyle} from "lightning/platformResourceLoader";
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './jPlanPJPDesktopComponent.html';
import MobileView from './journeyPlanPJPcomponent.html';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class JourneyPlanPJPcomponent extends NavigationMixin(LightningElement) {
isDesktop = false;

render(){
    // return FORM_FACTOR==='Large' ? DesktopView : MobileView;
    return FORM_FACTOR==='Large' ? MobileView : MobileView;
}
connectedCallback(){
    loadStyle(this, noHeader)
        .then(result => {});
    console.log('FORM_FACTOR :::: ',FORM_FACTOR); 
    if(FORM_FACTOR == 'Large')  {
        this.isDesktop = true;
    }  
    console.log('this.isDesktop :::: ',this.isDesktop); 

}

showToastMessage(type, message, variant, mode){
    const evt = new ShowToastEvent({
        title: type,
        message: message,
        variant: variant,
        mode: mode
    });
    this.dispatchEvent(evt);
}


handlemapRedirectOption(event){
    console.log('Home Onclick :::: ');
    this.navigateToMapPage();
}
beatOn = false;
handlePlanVisit(){
    console.log('handlePlanVisit :::: '); 
    this.handleOpenBuy();
    this.handlePlanVisitFlag();
}

// navigateToNewRecordPage(){
//     this[NavigationMixin.Navigate]({
//         type: 'standard__objectPage',
//         attributes: {
//             objectApiName: 'Lead',
//             actionName: 'new'
//         },
//         state: {
//             useRecordTypeCheck: 1
//         }
//     });
// }

navigateToMapPage() {
    // this[NavigationMixin.Navigate]({
    //     "type": "standard__webPage",
    //     "attributes": {
    //         "url": "/lightning/o/Visit__c/list?filterName=Recent"
    //     }
    // });
    this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Visit__c',
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on 'state'
                // and identifies the target list view.
                // It may also be an 18 character list view id.
                // or by 18 char '00BT0000002TONQMA4'
                filterName: 'Recent' 
            }
        })
}

handleClosePopover(){
    this.template.querySelector('[data-id="popoverCard"]').style.transform="translateX(-100%)";
    this.template.querySelector('[data-id="popoverCard"]').style.width="0%";
}

handleOpenBuy(){
    this.template.querySelector('[data-id="popoverCard"]').style.transform="translateX(0%)";
    this.template.querySelector('[data-id="popoverCard"]').style.width="100%";
}
@track beatOn = false;
@track planOn = false;
handleBeatOption(){
    this.handleOpenBuy();
    this.beatOn = true;
    this.planOn= false;
}
handlePlanVisitFlag(){
    this.beatOn = false;
    this.planOn= true;
}

showToastMessage(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    this.dispatchEvent(evt);
}

}