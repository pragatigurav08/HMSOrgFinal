import { LightningElement, track, wire } from 'lwc';
import getRecordCountsCreatedDateToday from '@salesforce/apex/HomepageController.getRecordCountsToday';
import getRecordCountsTotal from '@salesforce/apex/HomepageController.getRecordCountsTotal';
import getRecordCountsWeek from '@salesforce/apex/HomepageController.getRecordCountsWeek';

export default class AboutUs extends LightningElement {
    @track accountHeight = 0;
    @track insuranceHeight = 0;
    @track loansHeight = 0;

    @track todaysaccountHeight = 0;
    @track todaysinsuranceHeight = 0;
    @track todaysloansHeight = 0;

    @track weeklyaccountHeight = 0;
    @track weeklyinsuranceHeight = 0;
    @track weeklyloansHeight = 0;

    @track total = false;
    @track today = false;
    @track weekly = true;
    @track isDropdownOpen = false;

    // Toggle Dropdown
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    // Handle Total Trends Selection
    selectTotalTrends() {
        this.total = true;
        this.today = false;
        this.weekly = false;
        this.isDropdownOpen = false;
        this.updateBarHeights(); // Update bar heights for total trends
    }

    // Handle Today's Trends Selection
    selectTodayTrends() {
        this.today = true;
        this.total = false;
        this.weekly = false;
        this.isDropdownOpen = false;
        this.updateBarHeights(); // Update bar heights for today's trends
    }

    // Handle Weekly Trends Selection
    selectWeeklyTrends() {
        this.weekly = true;
        this.total = false;
        this.today = false;
        this.isDropdownOpen = false;
        this.updateBarHeights(); // Update bar heights for weekly trends
    }

    // Wire Today's Trends Data
    @wire(getRecordCountsCreatedDateToday)
    handleTodayCounts({ error, data }) {
        if (data) {

            console.log('bar graph>>>>');
            this.todaysaccountHeight = data.Accounts;
            this.todaysinsuranceHeight = data.Insurances;
            this.todaysloansHeight = data.Loans;

        } else if (error) {
            console.error('Error fetching today counts:', error);
        }
    }

    // Wire Total Trends Data
    @wire(getRecordCountsTotal)
    handleTotalCounts({ error, data }) {
        if (data) {
            console.log('bar graph>>>>');
            this.accountHeight = data.Accounts;
            this.insuranceHeight = data.Insurances;
            this.loansHeight = data.Loans;
        } else if (error) {
            console.error('Error fetching total counts:', error);
        }
    }

    // Wire Weekly Trends Data
    @wire(getRecordCountsWeek)
    handleWeeklyCounts({ error, data }) {
        if (data) {
            console.log('bar graph>>>>');
            this.weeklyaccountHeight = data.Accounts;
            this.weeklyinsuranceHeight = data.Insurances;
            this.weeklyloansHeight = data.Loans;
        } else if (error) {
            console.error('Error fetching weekly counts:', error);
        }
    }

    // Update Bar Heights Based on Active Trend
    updateBarHeights() {
        if (this.total) {
            this.setBarHeight('.account-bar', this.accountHeight);
            this.setBarHeight('.insurance-bar', this.insuranceHeight);
            this.setBarHeight('.loan-bar', this.loansHeight);
        } else if (this.today) {
            this.setBarHeight('.account-bar', this.todaysaccountHeight);
            this.setBarHeight('.insurance-bar', this.todaysinsuranceHeight);
            this.setBarHeight('.loan-bar', this.todaysloansHeight);
        } else if (this.weekly) {
            this.setBarHeight('.account-bar', this.weeklyaccountHeight);
            this.setBarHeight('.insurance-bar', this.weeklyinsuranceHeight);
            this.setBarHeight('.loan-bar', this.weeklyloansHeight);
        }
    }

    // Set Bar Height
    setBarHeight(selector, height) {
        const element = this.template.querySelector(selector);

        console.log('setbarheights  element>>>>>>');
        if (element) {
            element.style.height = `${height}%`;
        }
    }

    // Update Bars on DOM Load
    renderedCallback() {
        this.updateBarHeights();
    }
}