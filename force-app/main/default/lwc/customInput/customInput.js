import { LightningElement,api } from 'lwc';
export default class CustomInput extends LightningElement {
 @api label;
    @api value;
    @api required;

    handleChange(event) {
        const inputValue = event.target.value;
        const changeEvent = new CustomEvent('change', { 
            detail: { label: this.label, value: inputValue }
        });
        this.dispatchEvent(changeEvent);
    }
}