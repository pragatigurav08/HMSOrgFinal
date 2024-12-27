import { LightningElement,track,wire } from 'lwc';
import getRecordCountsCreatedDateToday from '@salesforce/apex/HomepageController.getRecordCountsToday';
export default class testcomponent extends LightningElement {
  @track accountHeight = 0;
    @track insuranceHeight = 0;
    @track loansHeight = 0;

    @wire(getRecordCountsCreatedDateToday)
    wiredRecordCounts({ error, data }) {
        if (data) {
            const maxCount = Math.max(data.Accounts, data.Insurances, data.Loans);
            const accountHeight = data.Accounts;
            const insuranceHeight = data.Insurances;
            const loansHeight = data.Loans;

            console.log('accountHeight>>>' + accountHeight);
            console.log('insuranceHeight>>>' + insuranceHeight);
            console.log('loansHeight>>>' + loansHeight);

            // Set the bar heights
            this.setBarHeight('.account-bar', accountHeight);
            this.setBarHeight('.insurance-bar', insuranceHeight);
            this.setBarHeight('.loan-bar', loansHeight);

            this.accountHeight = accountHeight;
            this.insuranceHeight = insuranceHeight;
            this.loansHeight = loansHeight;
        } else if (error) {
            console.error(error);
        }
    }

    setBarHeight(selector, height) {
        const element = this.template.querySelector(selector);
        if (element) {
            element.style.height = `${height}%`;
            console.log('element.style.height' + element.style.height);
        }
    }
}