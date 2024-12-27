import { LightningElement,api } from 'lwc';
export default class ModalComponent extends LightningElement {
 //@api title;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    saveAndClose() {
        this.dispatchEvent(new CustomEvent('save'));
        this.closeModal();
    }
}