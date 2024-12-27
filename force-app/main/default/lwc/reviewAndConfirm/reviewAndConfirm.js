import { LightningElement,track } from 'lwc';
export default class ReviewAndConfirm extends LightningElement {
    @track isReviewAndConfirmStep=true;
 handlePrev() {
        this.dispatchEvent(new CustomEvent('prev'));
    }
}