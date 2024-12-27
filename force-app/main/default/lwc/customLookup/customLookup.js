import { api, LightningElement, track, wire } from 'lwc';
import lookUp from '@salesforce/apex/CustomLookupController.search';

export default class CustomLookup extends LightningElement {
    @api objName;
    @api iconName;
    @api filter = '';
    @api searchPlaceholder = 'Search';
    @api defaultName;
    @api inputLabel;
    @api uniqueId;
    @api disabled;
    @api required;

    @track selectedName;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    stopRecursion = false;
    @track searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    @wire(lookUp, { searchTerm: '$searchTerm', myObject: '$objName', filter: '$filter' })
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    renderedCallback() {
        if (!this.stopRecursion)
            this.populateDefault();
    }

    connectedCallback() {
        console.log('objName= ' + this.objName);
        console.log('iconName= ' + this.iconName);
        console.log('filter= ' + this.filter);
        console.log('searchPlaceholder= ' + this.searchPlaceholder);
        console.log('defaultName= ' + this.defaultName);
    }

    @api populateDefault() {
        console.log('inside populateDefault' + this.defaultName);
        console.log('filter= ' + this.filter);
        if (this.defaultName != '') {
            this.selectedName = this.defaultName;
            this.stopRecursion = true;
            this.isValueSelected = true;
            if (this.blurTimeout) {
                clearTimeout(this.blurTimeout);
            }
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        }

    }


    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() => { this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus' }, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        let selectedRecord = {
            Id: selectedId,
            Name: selectedName,
            uniqueId:this.uniqueId
        }
        const valueSelectedEvent = new CustomEvent('lookupselected', { detail: selectedRecord });
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    @api handleRemovePill() {
        this.isValueSelected = false;
        const noValueSelectedEvent = new CustomEvent('nolookupselected', { detail: this.isValueSelected });
        this.dispatchEvent(noValueSelectedEvent);
    }

    onChange(event) {
        console.log('SEarch Term:::'+ event.target.value);
        this.searchTerm = event.target.value;
    }
}