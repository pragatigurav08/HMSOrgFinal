import { LightningElement, track,api } from 'lwc';
import savePolicyData from '@salesforce/apex/DisabilityInsurancePolicyController.savePolicyData';
//import CreateDisabilityInsurance from '@salesforce/apex/DisabilityInsurancePolicyController.CreateDisabilityInsurance';
import { NavigationMixin } from 'lightning/navigation';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InsuranceDisabilityForm extends NavigationMixin(LightningElement) {
    @track isModalOpen = false; // State variable to control modal visibility

    @api accountId;
    @api recordId;
    @track newAccount = '';
    @track firstName = '';
    @track lastName = '';
    @track customerEmail = '';
    @track phoneNo = '';
    @track gender = '';
    @track nominee = '';
    @track policyBeneficiary = '';
    @track policyPremiumAmount = null;
    @track coverageAmount = null;
    @track status = '';
    @track paymentFrequency = '';
    @track underwritingStatus = '';
    @track policyStartDate = '';
    @track policyEndDate = '';
    @track claimable = false;
    @track disabilityType = '';
    @track benefitPeriod = '';
    @track incomeReplacementPercentage = '';
    @track residualBenefits = false;
    @track waitingPeriod = '';
    @track occupationClass = '';
    @track maxMonthlyBenefit = '';
    @track ownOccupationCoverage = false;
    @track accountDetails;


    genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Third Gender', value: 'Third Gender' }
    ];

    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'Expired' },
        { label: 'Lapsed', value: 'Lapsed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Pending', value: 'Pending' }
    ];

    paymentOptions = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annually', value: 'Annually' }
    ];

    underwritingStatusOptions = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Declined', value: 'Declined' }
    ];

    claimableOptions = [
        { label: 'Yes', value: 'yes' }
    ];

    //Sample options for picklists
    disabilityOptions = [
        { label: 'Short-term', value: 'Short-term' },
        { label: 'Long-term', value: 'Long-term' }
    ];


    benefitOptions = [
        { label: '1 Year', value: '1 Year' },
        { label: '2 Years', value: '2 Years' },
        { label: '5 Years', value: '5 Years' },
        { label: 'Lifetime', value: 'Lifetime' }
    ];


    occupationOptions = [
        { label: 'Class 1', value: 'Class 1' },
        { label: 'Class 2', value: 'Class 2' },
        { label: 'Class 3', value: 'Class 3' },
        { label: 'Class 4', value: 'Class 4' }
    ];
    connectedCallback() {
        this.fetchAccountDetails();
        if (this.accountId) {
            console.log('Received Account ID:', this.accountId);
        }
    }
    fetchAccountDetails() {
        getAccountDetails({ accountId: this.accountId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
                this.assingpersnoal();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetails = undefined;
            });
    }
    assingpersnoal() {
        this.newAccount = this.accountDetails.Id;
        this.firstName = this.accountDetails.FirstName__c;
        this.lastName = this.accountDetails.Last_Name__c;
        this.phoneNo = this.accountDetails.Phone_number__c;
        this.gender = this.accountDetails.Gender__c;
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    }

    handleSave() {
        // Open the modal and pass the form data
        this.isModalOpen = true;
    }
    handleCloseModal() {
        // Close the modal
        this.isModalOpen = false;
    }
    handleCommit() {
        const accountIds = this.newAccount;

        console.log('Data committed:', {
            newAccountId: this.newAccount,
            firstName: this.firstName,
            lastName: this.lastName,
            customerEmail: this.customerEmail,
            phoneNo: this.phoneNo,
            gender: this.gender,
            nominee: this.nominee,
            policyBeneficiary: this.policyBeneficiary,
            policyPremiumAmount: parseFloat(this.policyPremiumAmount),
            coverageAmount: parseFloat(this.coverageAmount),
            status: this.status,
            paymentFrequency: this.paymentFrequency,
            underwritingStatus: this.underwritingStatus,
            policyStartDate: this.policyStartDate,
            policyEndDate: this.policyEndDate,
            claimable: this.claimable,
            disabilityType: this.disabilityType,
            benefitPeriod: this.benefitPeriod,
            incomeReplacementPercentage: parseFloat(this.incomeReplacementPercentage),
            residualBenefits: this.residualBenefits,
            waitingPeriod: parseFloat(this.waitingPeriod),
            occupationClass: this.occupationClass,
            maxMonthlyBenefit: parseFloat(this.maxMonthlyBenefit),
            ownOccupationCoverage: this.ownOccupationCoverage
        });

        savePolicyData({
            newAccountId: this.newAccount,
            firstName: this.firstName,
            lastName: this.lastName,
            customerEmail: this.customerEmail,
            phoneNo: this.phoneNo,
            gender: this.gender,
            nominee: this.nominee,
            policyBeneficiary: this.policyBeneficiary,
            policyPremiumAmount: parseFloat(this.policyPremiumAmount),
            coverageAmount: parseFloat(this.coverageAmount),
            status: this.status,
            paymentFrequency: this.paymentFrequency,
            underwritingStatus: this.underwritingStatus,
            policyStartDate: this.policyStartDate,
            policyEndDate: this.policyEndDate,
            claimable: this.claimable,
            disabilityType: this.disabilityType,
            benefitPeriod: this.benefitPeriod,
            incomeReplacementPercentage: parseFloat(this.incomeReplacementPercentage),
            residualBenefits: this.residualBenefits,
            waitingPeriod: parseFloat(this.waitingPeriod),
            occupationClass: this.occupationClass,
            maxMonthlyBenefit: parseFloat(this.maxMonthlyBenefit),
            ownOccupationCoverage: this.ownOccupationCoverage
        })
            .then(() => {
                try {
                    // Display success message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Record saved successfully!',
                            variant: 'success'
                        })
                    );

                    // Reset the form fields
                    this.resetForm();
                    this.handleCloseModal(); // Close the modal if needed

                    // this[NavigationMixin.Navigate]({
                    //     type: 'standard__webPage',
                    //     attributes: {
                    //         url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-policy/${accountIds}`
                    //     }
                    // });
                } catch (err) {
                    console.error('Error during post-save operations:', err);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Error during post-save operations: ' + err.message,
                            variant: 'error'
                        })
                    );
                }
            })
        .catch(error => {
            // Only show the error message if there is a valid error message
            if (error && error.body && error.body.message) {
                console.error('Error saving policy:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Failed to save record: ' + error.body.message,
                        variant: 'error'
                    })
                );
            }
        });
    }

    resetForm() {
        this.newAccount = '';
        this.firstName = '';
        this.lastName = '';
        this.customerEmail = '';
        this.phoneNo = '';
        this.gender = '';
        this.nominee = '';
        this.policyBeneficiary = '';
        this.policyPremiumAmount = null;
        this.coverageAmount = null;
        this.status = '';
        this.paymentFrequency = '';
        this.underwritingStatus = '';
        this.policyStartDate = '';
        this.policyEndDate = '';
        this.claimable = false;
        this.disabilityType = '';
        this.benefitPeriod = '';
        this.incomeReplacementPercentage = null;
        this.residualBenefits = false;
        this.waitingPeriod = null;
        this.occupationClass = '';
        this.maxMonthlyBenefit = null;
        this.ownOccupationCoverage = false;
    }


}