import { LightningElement,track } from 'lwc';
export default class AccountSelection extends LightningElement {
    @track isAccountSelectionStep=true;
handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    handlePrev() {
        this.dispatchEvent(new CustomEvent('prev'));
    }
}