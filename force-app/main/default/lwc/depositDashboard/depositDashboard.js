import { LightningElement, api, track, wire } from 'lwc';
import getDepositesDetailsByWealthManagement from '@salesforce/apex/DepositDetails.getDepositesDetailsByWealthManagement';

export default class DepositDashboard extends LightningElement {
    @api recordId; // Wealth Management record ID
    @track depositDetails = [];
    @track totalRecurringDepositAmount = 0;
    @track totalFixedDepositAmount = 0;
    error;

    // Fetch deposit details using wire service
    @wire(getDepositesDetailsByWealthManagement, { wealthManagementId: '$recordId' })
    wiredDepositDetails({ error, data }) {
        if (data) {
            this.depositDetails = data;
            console.log('Fetched Deposit Details:', JSON.stringify(this.depositDetails));
            this.calculateTotals();
        } else if (error) {
            this.depositDetails = [];
            console.error('Error fetching deposit details:', error);
            this.totalRecurringDepositAmount = 0;
            this.totalFixedDepositAmount = 0;
        }
    }

    // Calculate totals based on deposit record type
    calculateTotals() {
        this.totalRecurringDepositAmount = this.depositDetails
            .filter(deposit => deposit.recordTypeName === 'RD')
            .reduce((acc, deposit) => acc + (deposit.amount || 0), 0);

        this.totalFixedDepositAmount = this.depositDetails
            .filter(deposit => deposit.recordTypeName === 'FD')
            .reduce((acc, deposit) => acc + (deposit.amount || 0), 0);
    }
}