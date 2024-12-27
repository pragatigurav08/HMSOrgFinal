import { LightningElement } from 'lwc';

export default class LoanForm extends LightningElement {
     navigateBack() {
        // Dispatch a custom event to notify the parent
        const backEvent = new CustomEvent('back');
        this.dispatchEvent(backEvent);
    }
}