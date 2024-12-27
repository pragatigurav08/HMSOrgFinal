import { LightningElement,wire } from 'lwc';
import getCurrentMonthAccountOpenings from '@salesforce/apex/HomepageController.getCurrentMonthAccountOpenings';
import getCurrentMonthInsuranceOpenings from '@salesforce/apex/HomepageController.getCurrentMonthInsuranceOpenings';
import getCurrentMonthLoanOpenings from '@salesforce/apex/HomepageController.getCurrentMonthLoanOpenings';
import calenderPic from '@salesforce/resourceUrl/calenderPic';

export default class DashBoard extends LightningElement {
currentMonthAccountCount;
    currentMonthInsuranceCount;
    currentMonthLoanCount;
    calenderPicUrl=calenderPic;

    // Call the Apex method using wire
    @wire(getCurrentMonthAccountOpenings)
    wiredAccountData({ error, data }) {
        if (data) {
            this.currentMonthAccountCount = data;
        } else if (error) {
            console.error('Error fetching account data:', error);
        }
    }

    @wire(getCurrentMonthInsuranceOpenings)
    wiredInsurancetData({ error, data }) {
        if (data) {
            this.currentMonthInsuranceCount = data;
        } else if (error) {
            console.error('Error fetching Insurance data:', error);
        }
    }

    @wire(getCurrentMonthLoanOpenings)
    wiredLoanData({ error, data }) {
        if (data) {
            this.currentMonthLoanCount = data;
        } else if (error) {
            console.error('Error fetching Loan data:', error);
        }
    }

}