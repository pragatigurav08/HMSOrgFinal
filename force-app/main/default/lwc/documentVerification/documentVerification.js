import { LightningElement,track } from 'lwc';
export default class DocumentVerification extends LightningElement {
   @track isDocumentUploadStep=true;
  handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    handlePrev() {
        this.dispatchEvent(new CustomEvent('prev'));
    }
}