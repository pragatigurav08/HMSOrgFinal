import { LightningElement, wire } from 'lwc';
import getSalesData from '@salesforce/apex/SalesDataController.getSalesData';

export default class SalesData extends LightningElement {
    sales;
    error;

    @wire(getSalesData)
    wiredSales({ data, error }) {
        if (data) {
            this.sales = data;
            this.error = undefined;
        } else if (error) {
            this.sales = undefined;
            this.error = error.body.message;
        }
    }
}