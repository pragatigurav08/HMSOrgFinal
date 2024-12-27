import { LightningElement, track } from 'lwc';

export default class FooterTermsAndConditions extends LightningElement {
    @track isAccepted = false;
    @track disableButton = true;

    handleCheckboxChange(event) {
        this.isAccepted = event.target.checked;
        this.disableButton = !this.isAccepted;
    }

    handleProceed() {
        // Handle the action when the user clicks the "Proceed" button
        alert('Thank you for accepting the Terms and Conditions!');
    }
}