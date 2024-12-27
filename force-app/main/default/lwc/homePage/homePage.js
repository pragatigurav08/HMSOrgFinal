import { LightningElement, track, wire,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import Name from '@salesforce/schema/User.Name';
//import ProfileName from '@salesforce/schema/User.Profile.Name';
import PROFILE_NAME_FIELD from '@salesforce/schema/Profile.Name';
import WealthPic from '@salesforce/resourceUrl/WealthPic';
import getAccounts from '@salesforce/apex/HomepageController.getRecentlyViewedAccounts'; // Replace 'YourApexClass' with your Apex class name
import getInsurances from '@salesforce/apex/HomepageController.getRecentlyViewedInsurance'; // Same here
import getLoans from '@salesforce/apex/HomepageController.getRecentlyViewedLoans'; // And here
import getCurrentMonthAccountOpenings from '@salesforce/apex/HomepageController.getCurrentMonthAccountOpenings';
import insurancePic from '@salesforce/resourceUrl/insurancePic';
import accountProfile from '@salesforce/resourceUrl/accountProfile';
import LoanPic from '@salesforce/resourceUrl/LoanPic';
import getCurrentMonthInsuranceOpenings from '@salesforce/apex/HomepageController.getCurrentMonthInsuranceOpenings';
import filterAccrecords from '@salesforce/apex/ApplyingFilters.getAccountFilter';
import filterrecords from '@salesforce/apex/ApplyingFilters.getInsuranceFilter';
import getRecordTypes from '@salesforce/apex/InsuranceDetailsController.getRecordTypes';
import getCurrentMonthLoanOpenings from '@salesforce/apex/HomepageController.getCurrentMonthLoanOpenings';
import getRecordCountsCreatedDateToday from '@salesforce/apex/HomepageController.getRecordCountsToday';
import DesktopView from './homePage.html';
import MobileView from './homepageMobile.html';
import FORM_FACTOR from '@salesforce/client/formFactor';
import getWealths from '@salesforce/apex/HomepageController.getRecentlyViewedWealth'; 
import getsearchaccount from '@salesforce/apex/ApplyingFilters.getsearchaccounts';
import getsearchinsurance from '@salesforce/apex/ApplyingFilters.getsearchinsurance';
import getsearchloan from '@salesforce/apex/ApplyingFilters.getsearchloan';
import getProfileNameFromUserId from '@salesforce/apex/HomepageController.getProfileNameFromUserId';

import calenderPic from '@salesforce/resourceUrl/calenderPic';

export default class HomePage extends NavigationMixin(LightningElement) {
    insurancePicUrl=insurancePic;
    loanPicUrl=LoanPic;
    wealthPicUrl=WealthPic;
    accountPicUrl =accountProfile;
    calenderPicUrl=calenderPic;
    @track accounts = [];
    @track Insurances = [];
    @track Loans = [];
    @track wealths = [];
    @track AccNumber='';
    @track InsuNumber='';
    @track LoanNumber='';
    @track error;
    @track showAccountCreation = false;
    @track showInsuranceCreation = false;
    @track showLoanCreation = false;
    @track showHome = true;
    @track showAccounts = false;
    @track showInsurance = false;
    @track showLoans = false;
    @track showWealth = false;
    @track graph = true;
    @track isPopoverOpen = false;
    @track PolEndDate = '';
    @track claimable = '';
    @track recordTypeOptions = [];
    @track recordType;
    @track insurancerecordType = '';
    @track isTemplateVisible = false;
    @track currentMonthAccountCount=0;
    @track currentMonthInsuranceCount=0;
    @track currentMonthLoanCount=0;
    @api currentUser;
    @track isDisabled = false;
    userId = Id;

    @wire(getProfileNameFromUserId, { userId: '$userId' })
    userDetails({ error, data }) {
        if (data) {
            // Check if the profile name is not 'System Administrator'
            if (data !== 'System Administrator') {
                this.isDisabled = true;  // Disable the buttons if not an admin
                console.log('this.isDisabled>>>', this.isDisabled)
                 console.log('profile name :', data);
            } else {
                console.log('profile name :', data)
                this.isDisabled = false;
                console.log('this.isDisabled>>>')
            }
        } else if (error) {
            console.log('Error fetching user profile:', error);
        }
    }
   
    connectedCallback() {
        
         this.template.addEventListener('DOMContentLoaded', () => {
        const homeButton = this.template.querySelector('[data-section="home"]');
        if (homeButton) {
            homeButton.classList.add('nav_selected');
        }
    });
        // this.updateDisabledState();
        this.loadAccounts();
        this.loadInsurances();
        this.loadLoans();
        this.loadWealths();
    // Ensure the "Home" button is highlighted by default
   
}



    // Call the Apex method using wire
    @wire(getCurrentMonthAccountOpenings)
    wiredAccountData({ error, data }) {
        if (data) {
            this.currentMonthAccountCount = data;
           console.log('this.currentMonthAccountCount>>>', JSON.stringify(this.currentMonthAccountCount));

        } else if (error) {
            console.error('Error fetching account data:', error);
        }
    }

    @wire(getCurrentMonthInsuranceOpenings)
    wiredInsurancetData({ error, data }) {
        if (data) {
            this.currentMonthInsuranceCount = data;
             console.log('this.currentMonthInsuranceCount>>>', JSON.stringify(this.currentMonthInsuranceCount));
        } else if (error) {
            console.error('Error fetching Insurance data:', error);
        }
    }

    @wire(getCurrentMonthLoanOpenings)
    wiredLoanData({ error, data }) {
        if (data) {
            this.currentMonthLoanCount = data;
             console.log('this.currentMonthLoanCount>>>', JSON.stringify(this.currentMonthLoanCount));
        } else if (error) {
            console.error('Error fetching Loan data:', error);
        }
    }

    @track accountHeight = 0;
    @track insuranceHeight = 0;
    @track loansHeight = 0;

    @wire(getRecordCountsCreatedDateToday)
    wiredRecordCounts({ error, data }) {
        if (data) {
            const maxCount = Math.max(data.Accounts, data.Insurances, data.Loans);

            // Prevent division by zero if maxCount is 0
            // const accountHeight = maxCount ? Math.floor((data.Accounts / maxCount) * 100) : 0;
            // const contactsHeight = maxCount ? Math.floor((data.Contacts / maxCount) * 100) : 0;
            const accountHeight = data.Accounts;
            const insuranceHeight = data.Insurances;
            const loansHeight = data.Loans;
            console.log('accountHeight>>>' + accountHeight);
            console.log('insuranceHeight>>>' + insuranceHeight);
            console.log('loansHeights>>>' + loansHeight);
            console.log('data.Accounts>>>' + data.Accounts);
            console.log('data.Insurances>>>' + data.Insurances);
            console.log('data.Loans>>>' + data.Loans);
            this.setBarHeight('.account-bar', accountHeight);
            this.setBarHeight('.insurance-bar', insuranceHeight);
            this.setBarHeight('.loan-bar', loansHeight);

            this.accountHeight = accountHeight;
            this.insuranceHeight = insuranceHeight;
            this.loansHeight = loansHeight;
            console.log('end of wired data>>');
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getRecordTypes, { objectApiName: 'Insurance_Policy__c' })
    wiredRecordTypes({ error, data }) {
        if (data) {
            this.recordTypeOptions = data.map(recordType => ({
                label: recordType.label,
                value: recordType.value
            }));
        } else if (error) {
            console.error('Error fetching record types: ', error);
        }
    }
    setBarHeight(selector, height) {
        const element = this.template.querySelector(selector);
        console.log('setbarheight>>>>>');
        if (element) {
            element.style.height = `${height}%`;
            console.log('element.style.height' + element.style.height);
        }
    }
    handleSearchInsurance(event){
        this.isLoading=false;
        this.InsuNumber = event.target.value;
        if (this.InsuNumber.length >0) {
            this.searchMetadata();
        }
        else{

        }
    }
     searchMetadata() {
         this.isLoading=false;
         
        getsearchinsurance({ searchInsuranceNumber: this.InsuNumber })
            .then(result => {
                this.Insurances=result;
                this.error = undefined;
                this.InsuNumber = '';
            })
            .catch(error => {
                this.error = error.body.message;
                this.Insurances = undefined;
                this.InsuNumber = '';
            });
    }
     handleSearchAccount(event){
        this.isLoading=false;
        this.AccNumber = event.target.value;
        if (this.AccNumber.length >0) {
            this.searchaccountMetadata();
        }
        else{

        }
    }
     searchaccountMetadata() {
         this.isLoading=false;
         
        getsearchaccount({ searchAccountNumber: this.AccNumber })
            .then(result => {
                this.accounts=result;
                this.error = undefined;
                this.AccNumber = '';
            })
            .catch(error => {
                this.error = error.body.message;
                this.accounts = undefined;
                this.AccNumber = '';
            });
    }
     handleSearchLoan(event){
        this.isLoading=false;
        this.LoanNumber = event.target.value;
        if (this.LoanNumber.length >0) {
            this.searchLoanMetadata();
        }
        else{

        }
    }
     searchLoanMetadata() {
         this.isLoading=false;
         
        getsearchloan({ searchLoanNumber: this.LoanNumber })
            .then(result => {
                this.Loans=result;
                this.error = undefined;
                this.LoanNumber = '';
            })
            .catch(error => {
                this.error = error.body.message;
                this.Loans = undefined;
                this.AccNumber = '';
            });
    }

 
 handleSaveAccount() {
        console.log('Save event received, closing modal.');
        this.showAccountCreation = false; // Close the modal popup
        this.showInsuranceCreation=false;
    }

    // Close modal when the modal's close button is clicked
    closeAccountForm() {
        this.showAccountCreation = false;
    }

    loadAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.accounts = [];
            });
    }
    handleOpenRightPanel() {
        console.log("Popover opening");
        this.isPopoverOpen = true;
        setTimeout(() => {
            const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
            if (popoverCard) {
                console.log("Popover card found");
                popoverCard.style.transform = "translateY(0%)";
                // popoverCard.style.height = "64%";
            }
        }, 500);
    }

    handleClosePopover() {
        this.isPopoverOpen = false;
        const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
        if (popoverCard) {
            popoverCard.style.transform = "translateY(-100%)";
            popoverCard.style.height = "0%";
        }
    }

 

    handleShowMore() {
        this.isTemplateVisible = true;
        this.showAccountCreation = false;
    this.showInsuranceCreation = false;
    this.showLoanCreation = false;
    this.showHome = false;
   this.showAccounts = false;
    this.showInsurance = false;
   this.showLoans = false;
    this.showWealth = false;
    }
    handleFilterChange(event) {
        const fieldName = event.currentTarget.dataset.fieldName;
        const value = event.target.value;

        if (fieldName === 'RecordType') {
            this.insurancerecordType = value || '';
        } else if (fieldName === 'PolicyEndDate') {
            this.PolEndDate = value || '';
        } else if (fieldName === 'Claimable') {
            this.claimable = value || '';
        }
    }

    handleFilterApply() {
        this.filterRecFunc();
        this.handleClosePopover();
    }

    filterRecFunc() {
        filterrecords({
            recordTypeId: this.insurancerecordType,
            Claimable: this.claimable,
            PolicyEndDate: this.PolEndDate
        })
            .then(result => {
                 this.Insurances = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.body.message;
                this.Insurances = undefined;
            });
    }

    clearFilterFields() {
        this.insurancerecordType = '';
        this.claimable = '';
        this.PolEndDate = '';
    }

    handleaddaccount() {
        this.showAccountCreation = true;
    }

    closeAccountForm() {
        this.showAccountCreation = false;
    }
    handleaddinsurance() {
        this.showInsuranceCreation = true;
    }
    closeInsuranceForm() {
        this.showInsuranceCreation = false;
    }
    render() {
        return FORM_FACTOR === 'Large' ? DesktopView : MobileView;
    }
    handleaddloan(){
         this.showLoanCreation = true;
    }
     closeLoanForm() {
        this.showLoanCreation = false;
    }


    // Method to load Insurances data
    loadInsurances() {
        getInsurances()
            .then(result => {
                this.Insurances = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.Insurances = [];
            });
    }

    // Method to load Loans data
    loadLoans() {
        getLoans()
            .then(result => {
                this.Loans = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.Loans = [];
            });
    }

    // Method to load Wealth data
    loadWealths() {
        getWealths()
            .then(result => {
                this.wealths = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.wealths = [];
            });
    }

    // Navigation handler for sidebar buttons
    handleNavigation(event) {
        this.isTemplateVisible=false;
        // Remove the 'nav_selected' class from all buttons
        this.template.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('nav_selected');
        });

        // Add the 'nav_selected' class to the clicked button
        event.currentTarget.classList.add('nav_selected');

        const section = event.currentTarget.dataset.section;
        this.showAccounts = section === 'accounts';
        this.showInsurance = section === 'insurance';
        this.showLoans = section === 'loans';
        this.showWealth = section === 'wealth';
        this.showHome = section === 'home';

     window.scrollTo({ top: 0, behavior: 'smooth' });

    const element = this.template.querySelector('.main-content');
    if (element) {
        console.log('element>>>', element);
        if (element.scrollTop === 0) {
            console.log('Scrolled to the top');
            
        } else if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
            console.log('Scrolled to the bottom');
        }

        // Reset scroll to the top
        element.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error('main-content element not found');
    }


    }

    // Handlers for View Analysis buttons
    handleReportNavigation() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '01ZJ40000008fJuMAI', // Replace with the actual Report ID
                actionName: 'view',
                objectApiName: 'Dashboard'
            }
        });
        console.log('Navigating to Accounts report');
    }

    handleinsurancenavigate() {
        // Logic to navigate to the Insurances report

        console.log('Navigating to Insurances report');
    }

    handleloanavigate() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '01ZJ40000008fWZMAY', // Replace with the actual Report ID
                actionName: 'view',
                objectApiName: 'Dashboard'
            }
        });
        console.log('Navigating to Loans report');
    }

    handleReportNavigat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '01ZJ40000008fXDMAY', // Replace with the actual Report ID
                actionName: 'view',
                objectApiName: 'Dashboard'
            }
        });
        console.log('Navigating to Wealth report');
    }
}