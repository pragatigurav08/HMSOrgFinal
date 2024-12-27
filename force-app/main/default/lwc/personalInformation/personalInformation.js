import { LightningElement,track } from 'lwc';
export default class PersonalInformation extends LightningElement {
  @track isPersonalInfoStep=true;
  handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
}