import { LightningElement, track, wire } from 'lwc';
import getAccountDetails from '@salesforce/apex/InsuranceEligibilityController.getAccountDetails';
import getRecordTypes from '@salesforce/apex/InsuranceDetailsController.getRecordTypes';

import searchAccounts from '@salesforce/apex/InsuranceEligibilityController.searchAccounts'; // Import your search method
import { NavigationMixin } from 'lightning/navigation';
import selfImage from '@salesforce/resourceUrl/spousemom';
import spouseImage from '@salesforce/resourceUrl/spouseman';
import sonImage from '@salesforce/resourceUrl/son';
import daughterImage from '@salesforce/resourceUrl/daughter';
import fatherImage from '@salesforce/resourceUrl/father';
import motherImage from '@salesforce/resourceUrl/mother';
import fatherInLawImage from '@salesforce/resourceUrl/father';
import motherInLawImage from '@salesforce/resourceUrl/mother';
import carImage from '@salesforce/resourceUrl/car';
import busImage from '@salesforce/resourceUrl/bus';
import truckImage from '@salesforce/resourceUrl/truck';
import autoImage from '@salesforce/resourceUrl/auto';
import bikeImage from '@salesforce/resourceUrl/bike';
import TotalPremimum from '@salesforce/resourceUrl/totalpremimum';


export default class InsuranceEligibility extends NavigationMixin(LightningElement) {
    @track accountId;
    @track annualIncome;
    @track insuranceAmount;
    @track requiredIncome;
    @track isEligible = false;
    @track errorMessage = '';
    @track firstName; // Add a trackable property for FirstName
    @track dateOB;
    @track aadharNo;
    @track searchKey = '';
    @track accounts = [];
    @track myaccount = [];
    @track selectedAccount = '';
    @track accountDetails;
    @track isStepOne = true;
    @track openself = true;
    @track madeandmodel;
    progressWidth = 50;
    @track isModalOpen = false;
    @track islifeinsurance = false;
    @track isautomobileinsurance = false;
    @track ispropertyinsurance = false;
    @track isdisabilityinsurance = false;
    @track ishealthinsurance = false;
    @track recordTypeOptions = [];
    @track displayedFamilyMembers = [];
    @track firstselected;
    @track recordType;
    @track gender;
    @track steps = [
        { label: 'Step 1: Eligibility Check', value: 'step1' },
        { label: 'Step 2:Insurance Form', value: 'step2' },
        { label: 'Step 3:Planpage', value: 'step3' },
        { label: 'Step 4:Finalform', value: 'step4' },

    ];
    @track currentStep = 'step1';
    familyMembers = [
        { id: 'self', name: 'Self', imageUrl: selfImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'spouse', name: 'Spouse', imageUrl: spouseImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'son', name: 'Son', imageUrl: sonImage, dob: '',AadharNo:'', fullname: '', isSelected: false, canAddMore: false, count: 0 },
        { id: 'daughter', name: 'Daughter', imageUrl: daughterImage, dob: '',AadharNo:'', fullname: '', isSelected: false, canAddMore: false, count: 0 },
        { id: 'father', name: 'Father', imageUrl: fatherImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'mother', name: 'Mother', imageUrl: motherImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'fatherInLaw', name: 'FatherIn Law', imageUrl: fatherInLawImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'motherInLaw', name: 'MotherIn Law', imageUrl: motherInLawImage, dob: '',AadharNo:'', fullname: '', isSelected: false }
    ];
    familyMember = [
        { id: 'self', name: 'Self', imageUrl: spouseImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'spouse', name: 'Spouse', imageUrl: selfImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'son', name: 'Son', imageUrl: sonImage, dob: '',AadharNo:'', fullname: '', isSelected: false, canAddMore: false, count: 0 },
        { id: 'daughter', name: 'Daughter', imageUrl: daughterImage, dob: '',AadharNo:'', fullname: '', isSelected: false, canAddMore: false, count: 0 },
        { id: 'father', name: 'Father', imageUrl: fatherImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'mother', name: 'Mother', imageUrl: motherImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'fatherInLaw', name: 'FatherIn Law', imageUrl: fatherInLawImage, dob: '',AadharNo:'', fullname: '', isSelected: false },
        { id: 'motherInLaw', name: 'MotherIn Law', imageUrl: motherInLawImage, dob: '',AadharNo:'', fullname: '', isSelected: false }
    ];
    TypesOfVehicles = [
        { id: 'two-wheelers', name: ' Two-wheelers', imageUrl: bikeImage, VehicleRegistrationNumber: '', VehicleModel: '', VehicleIdentificationNumber: '', YearofManufacture: '', isSelected: false },
        //{ id: 'autos', name: 'Autos', imageUrl: autoImage, VehicleRegistrationNumber: '', isSelected: false },
        { id: 'Private cars', name: 'Private cars', imageUrl: carImage, VehicleRegistrationNumber: '', VehicleModel: '', VehicleIdentificationNumber: '', YearofManufacture: '', isSelected: false },
        { id: 'commercial vehicles', name: 'Commercial vehicles', imageUrl: busImage, VehicleRegistrationNumber: '', VehicleModel: '', VehicleIdentificationNumber: '', YearofManufacture: '', isSelected: false },
        //{ id: 'trucks', name: 'Trucks', imageUrl: truckImage, VehicleRegistrationNumber: '', isSelected: false}
    ];


    //step3............
    @track coveragep1 = 5;
    @track coveragep2 = 5;
    @track p1 = true;
    @track p2 = false;
    @track coverageamt = 7;
    @track coverageamtp2 = 7;
    @track premimumAmount = 41890;
    @track premAmount = 35500;
    @track premAmounts = 16400;
    @track premimumAmounts = 1935;
    @track gstp1 = 6390;
    @track gstp2 = 2952;
    @track openbill = false;
    @track selectedTenure = 1;
    @track selectedTenurep2 = 1;
    @track monthlyamount = 2958;
    @track monthlyamountp2 = 1366;
    @track planyears;
    @track planyear;
    Totalbreakdown = TotalPremimum;
    plan1Original = 35500;
    plan2Original = 71000;
    plan2Discounted = 68160;
    plan3Original = 106500;
    plan3Discounted = 100110;


    p2y1 = 16400;
    p2y2o = 32800;
    p2y2d = 31488;
    p2y3o = 49200;
    p2y3d = 46248;
    //end step3..............

    //step motor insurance
    @track RegistrationNo;
    @track selectedMembers = [];
    @track selectedVehicle = [];
    @track t1=true;
    @track t2=false;
    @track t3=false;
    @track VINumber='';
    @track coverageamtt1 = 7;
    @track coverageamtt2 = 5;
    @track coverageamtt3 = 2;
    @track coveraget1=5;
    @track coveragept2;
    @track coveragept3;

    get isStep1() {

        return this.currentStep === 'step1';
    }

    get isStep2() {
        return this.currentStep === 'step2';
    }
    get isStep3() {
        return this.currentStep === 'step3';
    }
    get isStep4() {
        return this.currentStep === 'step4';
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
    handleKnowPolicyPlansClick() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleNextButton() {
        console.log('handleNext called, current step:', this.currentStep);
        // Validate that at least one member is selected
        const selectedVehicles = this.selectedVehicle;
        const selectedMembers = this.selectedMembers;
        if (!selectedMembers.length) {
            console.log('Cannot proceed, at least one member must be selected.');
            this.errorMessage = 'Please select at least one member.';
            return;
        }
        // Validate that all selected members have a dob
        const membersWithMissingDob = selectedMembers.filter(
            (member) => !member.dob || member.dob.trim() === ''
        );

        if (membersWithMissingDob.length) {
            const missingDobMemberNames = membersWithMissingDob.map((member) => member.name).join(', ');
            alert(`Cannot proceed, the following members are missing date of birth: ${missingDobMemberNames}`);
            this.errorMessage = `The following members are missing date of birth: ${missingDobMemberNames}. Please provide DOB for all selected members.`;
            return;
        }

        if (this.recordType == '012J400000008bwIAA') {
            if (!selectedVehicles.length) {
                alert('Cannot proceed, at least one Vehicle must be selected.');
                this.errorMessage = 'Please select at least one Vehicle.';
                return;
            }
        }

        // If there's an error message, don't proceed
        if (this.errorMessage) {
            console.log('Cannot proceed, resolve errors first:', this.errorMessage);
            return;
        }

        // Proceed to the next step if validation passes
        const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            this.currentStep = this.steps[currentIndex + 1].value;

            // Add logic to refresh or reset properties when moving to the next step
            if (this.currentStep === 'step2') {
                this.refreshStepTwo();
            }
        }
    }

    handleNextButtonClick() {
        console.log('handleNext called, current step:', this.currentStep);
        this.selectedMembers = [];
        this.displayedFamilyMembers.forEach((member) => {
            if (member.id == 'self') {
                member.isSelected = true;
                member.dob = this.dateOB;
                member.fullname = this.firstName;
                member.AadharNo=this.aadharNo;
                this.openself = false;
            }
            else {
                this.openself = true;
            }
        });

        // Store the selected members into the selectedMembers array
        this.selectedMembers = this.displayedFamilyMembers.filter((member) => member.isSelected);
        this.firstselected = this.displayedFamilyMembers.filter((member) => member.isSelected);
        // Proceed to the next step if validation passes
        const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            this.currentStep = this.steps[currentIndex + 1].value;
            if (this.currentStep === 'step1') {
                this.selectFamilyMember(firstselected);
            }
        }
    }
    //  connectedCallback() {
    //     this.selectFamilyMember(firstselected);
    // }

    handleNextClick() {
        console.log('handleNext called, current step:', this.currentStep);

        const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            this.currentStep = this.steps[currentIndex + 1].value;
        }
    }

    //     // Handle Next button click
    //     handleNextButtonClick() {
    //     console.log('handleNext called, current step:', this.currentStep);
    //     // Proceed to the next step if validation passes
    //     const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
    //     if (currentIndex < this.steps.length - 1) {
    //         this.currentStep = this.steps[currentIndex + 1].value;
    //     }

    // }
    refreshStepTwo() {
        this.recordType = null;
        this.islifeinsurance = false;
        this.isautomobileinsurance = false;
        this.ispropertyinsurance = false;
        this.isdisabilityinsurance = false;
        this.ishealthinsurance = false;
    }
    handlePreviousButtonClick() {
        console.log('handlePrevioius called, current step:', this.currentStep);
        // Proceed to the next step if validation passes
        const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length + 1) {
            this.currentStep = this.steps[currentIndex - 1].value;
        }
    }

    handleRecordTypeChange(event) {
        this.recordType = event.detail.value;
        const selectedType = event.detail.value;
        console.log('selected recoredtype :', selectedType);
        // Check if the selected type is "Life Insurance"
        if (selectedType == '012J400000008cVIAQ') {
            this.islifeinsurance = true;
            this.isautomobileinsurance = false;
            this.ispropertyinsurance = false;
            this.isdisabilityinsurance = false;
            this.ishealthinsurance = false;
        }
        else if (selectedType == '012J400000008bwIAA') {
            this.ispropertyinsurance = false;
            this.isautomobileinsurance = true;
            this.islifeinsurance = false;
            this.isdisabilityinsurance = false;
            this.ishealthinsurance = false;
        }
        else if (selectedType == '012J400000008cGIAQ') {
            this.ispropertyinsurance = true;
            this.isautomobileinsurance = false;
            this.islifeinsurance = false;
            this.isdisabilityinsurance = false;
            this.ishealthinsurance = false;
        }
        else if (selectedType == '012J400000008d4IAA') {
            this.isdisabilityinsurance = true;
            this.ispropertyinsurance = false;
            this.isautomobileinsurance = false;
            this.islifeinsurance = false;
            this.ishealthinsurance = false;
        }
        else if (selectedType == '012J400000008cuIAA') {
            this.ishealthinsurance = true;
            this.ispropertyinsurance = false;
            this.isautomobileinsurance = false;
            this.islifeinsurance = false;
            this.isdisabilityinsurance = false;
        }
    }


    handleAnnualIncomepersnoal() {
        if (this.accountDetails) {
            this.annualIncome = this.accountDetails.Annual_Income__c;
            console.log('Annual income in handle:', this.annualIncome);
        } else {
            console.log('Account details are not available.');
        }
    }
    get isNextButtonDisabled() {
        return !this.isEligible;
    }

    get isNextButtonDisabl() {
        return !!this.errorMessage;
    }
    // Handle search term change for account lookup
    handleSearchTermChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 2) {
            // Call the Apex method when input is 3 characters or more
            searchAccounts({ searchTerm: this.searchKey })
                .then(result => {
                    this.accounts = result;
                    console.log('accounts>>' + this.accounts);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.accounts = [];  // Clear results when input is less than 3 characters
        }
    }
    get selectedMembers() {
        return this.displayedFamilyMembers.filter((member) => member.isSelected);
    }

    // addMember(event) {
    //     const memberId = event.currentTarget.dataset.id;

    //     this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
    //         if (member.id === memberId && member.canAddMore) {
    //             return { ...member, count: member.count + 1 };
    //         }
    //         return member;
    //     });
    // }

    selectFamilyMember(event) {
        const memberId = event.currentTarget.dataset.id;

        if (memberId === 'son' || memberId === 'daughter') {
            // Update base member's count in `displayedFamilyMembers`
            this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
                if (member.id === memberId) {
                    return {
                        ...member,
                        count: member.count + 1,
                        canAddMore: true,
                        isSelected: true, // Ensure the base member is marked as selected
                        darkBorder: 'dark' // Apply the 'dark' border class
                    };
                }
                return member;
            });

            // Add a new entry in `selectedMembers` for this selection
            const baseMember = this.displayedFamilyMembers.find(member => member.id === memberId);
            const newCount = baseMember.count; // Use updated count
            const newId = `${memberId}-${newCount}`;
            const newMember = {
                ...baseMember,
                id: newId,
                name: `${baseMember.name} ${newCount}`,
                isSelected: true,
                canAddMore: true,
                count: 0,
                darkBorder: 'dark' // New members also have the 'dark' border class
            };

            // Add the new member to `selectedMembers`
            this.selectedMembers = [...this.selectedMembers, newMember];
        } else {
            // Toggle selection for other family members
            this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
                if (member.id === memberId) {
                    const isSelected = !member.isSelected;
                    return {
                        ...member,
                        isSelected,
                        darkBorder: isSelected ? 'dark' : 'null'
                    };
                }
                return member;
            });

            // Update `selectedMembers` list for other family members
            this.selectedMembers = this.displayedFamilyMembers.filter((member) => member.isSelected);
        }
    }

    removeMember(event) {
        const memberId = event.currentTarget.dataset.id;

        if (memberId.startsWith('son-') || memberId.startsWith('daughter-')) {
            // Remove the specific dynamic member from `selectedMembers`
            this.selectedMembers = this.selectedMembers.filter(member => member.id !== memberId);

            // Remove the specific dynamic member from `displayedFamilyMembers`
            this.displayedFamilyMembers = this.displayedFamilyMembers.filter(member => member.id !== memberId);

            // Update the parent member's count
            const parentId = memberId.split('-')[0]; // Extract "son" or "daughter"
            this.displayedFamilyMembers = this.displayedFamilyMembers.map(member => {
                if (member.id === parentId) {
                    const newCount = Math.max(member.count - 1, 0);
                    return {
                        ...member,
                        count: newCount, // Decrement the count, ensure it doesn't go below 0
                        darkBorder: newCount === 0 ? 'null' : 'dark' // Update darkBorder based on count
                    };
                }
                return member;
            });
        }
        else {
            // Original logic for static members
            this.displayedFamilyMembers = this.displayedFamilyMembers.map(member => {
                if (member.id === memberId) {
                    if (member.canAddMore && member.count > 0) {
                        return { ...member, count: member.count - 1 };
                    }

                    // Reset static member's properties
                    return {
                        ...member,
                        isSelected: false,
                        count: 0,
                        dob: null,
                        fullname: null,
                        darkBorder: null
                    };
                }
                return member;
            });

            // Update the selectedMembers list for static members
            this.selectedMembers = this.displayedFamilyMembers.filter(member => member.isSelected);
        }
    }

    updateDob(event) {
        const memberId = event.currentTarget.dataset.id;
        const newDob = event.target.value;

        this.selectedMembers = this.selectedMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, dob: newDob };
            }
            return member;
        });

        this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, dob: newDob };
            }
            return member;
        });

        this.validateDob();
    }

    updateaadhar(event) {
        const memberId = event.currentTarget.dataset.id;
        const aadharno = event.target.value;

        this.selectedMembers = this.selectedMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, AadharNo: aadharno };
            }
            return member;
        });

        this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, AadharNo: aadharno };
            }
            return member;
        });

        this.validateaadhar(aadharno);
    }


    updateName(event) {
        const memberId = event.currentTarget.dataset.id;
        const newName = event.target.value;

        this.selectedMembers = this.selectedMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, fullname: newName };
            }
            return member;
        });

        this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) => {
            if (member.id === memberId) {
                return { ...member, fullname: newName };
            }
            return member;
        });
    }

validateaadhar(aadharno) {
    let errorMessage = '';
    // Regular expression to match exactly 12 digits
    const aadharRegex = /^\d{12}$/;

    if (!aadharRegex.test(aadharno)) {
        // Handle invalid Aadhar number (e.g., show an error message)
        errorMessage='Invalid Aadhar number. It must contain exactly 12 digits.';
        console.error('Invalid Aadhar number. It must contain exactly 12 digits.');
        // You can also set an error property or dispatch an event for UI updates
    } else {
        // Handle valid Aadhar number
        console.log('Valid Aadhar number.');
        errorMessage = ''; // Clear the error message if valid
    }
     if (errorMessage) {
            this.errorMessage = errorMessage;
        } else {
            this.errorMessage = ''; // Clear error message if validation passes
        }
}



    validateDob() {
        let errorMessage = '';

        const self = this.displayedFamilyMembers.find((member) => member.id === 'self');
        const spouse = this.displayedFamilyMembers.find((member) => member.id === 'spouse');
        const son = this.displayedFamilyMembers.find((member) => member.id === 'son');
        const daughter = this.displayedFamilyMembers.find((member) => member.id === 'daughter');
        const father = this.displayedFamilyMembers.find((member) => member.id === 'father');
        const mother = this.displayedFamilyMembers.find((member) => member.id === 'mother');
        const fatherInLaw = this.displayedFamilyMembers.find((member) => member.id === 'fatherInLaw');
        const motherInLaw = this.displayedFamilyMembers.find((member) => member.id === 'motherInLaw');

        // Helper function to calculate age
        const calculateAge = (dob) => {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        // Validate Self and Spouse are at least 17 years old
        if (self.dob && calculateAge(self.dob) < 17) {
            errorMessage = 'Self must be at least 17 years old.';
        }
        if (spouse.dob && calculateAge(spouse.dob) < 17) {
            errorMessage = 'Spouse must be at least 17 years old.';
        }
        if (mother.dob && calculateAge(self.dob) < 17) {
            errorMessage = 'mother must be at least 17 years old.';
        }
        if (self.dob && calculateAge(father.dob) < 17) {
            errorMessage = 'father must be at least 17 years old.';
        }
        if (self.dob && calculateAge(fatherInLaw.dob) < 17) {
            errorMessage = 'fatherInLaw must be at least 17 years old.';
        }
        if (self.dob && calculateAge(motherInLaw.dob) < 17) {
            errorMessage = 'motherInLaw must be at least 17 years old.';
        }

        // Validate Self and Spouse are elder than Son and Daughter
        const childDobs = [son, daughter]
            .filter((child) => child.dob)
            .map((child) => ({ name: child.name, dob: child.dob }));
        childDobs.forEach((child) => {
            if (self.dob && new Date(self.dob) >= new Date(child.dob)) {
                errorMessage = `Self must be elder than ${child.name}.`;
            }
            if (spouse.dob && new Date(spouse.dob) >= new Date(child.dob)) {
                errorMessage = `Spouse must be elder than ${child.name}.`;
            }
        });

        // Validate Parents are elder than Self and Spouse
        const parentDobs = [father, mother, fatherInLaw, motherInLaw]
            .filter((parent) => parent.dob)
            .map((parent) => ({ name: parent.name, dob: parent.dob }));
        parentDobs.forEach((parent) => {
            if (self.dob && new Date(self.dob) <= new Date(parent.dob)) {
                errorMessage = `${parent.name} must be elder than Self.`;
            }
            if (spouse.dob && new Date(spouse.dob) <= new Date(parent.dob)) {
                errorMessage = `${parent.name} must be elder than Spouse.`;
            }
        });

        // If there's an error, show an error message
        if (errorMessage) {
            this.errorMessage = errorMessage;
        } else {
            this.errorMessage = ''; // Clear error message if validation passes
        }
    }


    // updateDob(event) {
    //     const memberId = event.currentTarget.dataset.id;
    //     const newDob = event.target.value;
    //     this.displayedFamilyMembers = this.displayedFamilyMembers.map((member) =>
    //         member.id === memberId ? { ...member, dob: newDob } : member
    //     );
    // }

    // Handle account selection from the search results
    handleAccountSelect(event) {
        const selectedAccountId = event.currentTarget.dataset.id;
        const selectedAccountName = event.currentTarget.innerText;
        this.selectedAccount = selectedAccountId;
        console.log('inside selectedaccount>>' + selectedAccountId);
        console.log('inside selectedname>>' + selectedAccountName);
        // Fire an event with the selected account details
        const selectedEvent = new CustomEvent('accountselect', {
            detail: { accountId: selectedAccountId, accountName: selectedAccountName }
        });

        this.dispatchEvent(selectedEvent);

        // Clear the account list after selection
        this.accounts = [];
        this.searchKey = selectedAccountName;  // Set the input value to the selected account name

        this.accountId = selectedAccountId; // Set accountId to the selected account
        this.fetchAccountDetails(selectedAccountId); // Fetch the account details after selection
    }

    // Fetch Account Details (Annual Income) for the selected account
    fetchAccountDetails(accountId) {
        if (accountId) {
            getAccountDetails({ accountId: accountId })
                .then(result => {
                    this.myaccount = result;
                    this.annualIncome = result.Annual_Income__c;
                    this.firstName = result.FirstName__c; // Populate FirstName__c
                    this.gender = result.Gender__c;
                    this.dateOB = result.DateOfBirth__c;
                    this.aadharNo=result.Aadhar_Number__c;
                    this.errorMessage = '';
                    this.updateDisplayedFamilyMembers();
                    this.calculateEligibility();  // Recalculate eligibility whenever account details are fetched
                    console.log('gender>>' + this.gender);
                })
                .catch(error => {
                    this.errorMessage = 'Error fetching account details. Please check the Account ID.';
                    this.annualIncome = null;
                    this.firstName = null; // Clear the firstName on error

                });
        }
    }

    updateDisplayedFamilyMembers() {
        const accountHolder = this.myaccount;
        // Assuming only one account holder for simplicity
        // if (this.accounts.length > 0) {
        //     const accountHolder = this.accounts[0]; // Get the first account
        //     this.displayedFamilyMembers =
        //         accountHolder.Gender__c == 'male' ? this.familyMember : this.familyMembers;
        //     console.log('displayedFamilyMembers>>' + this.displayedFamilyMembers);
        // }
        if (this.gender === 'Male') {
            this.displayedFamilyMembers = this.familyMember;
            console.log('gender in if>>' + this.gender);
        }
        else if (this.gender === 'Female') {
            this.displayedFamilyMembers = this.familyMembers;
            console.log('gender in else>>' + this.gender);
        }
    }

    // Handle Insurance Amount change and calculate eligibility
    // handleInsuranceAmountChange(event) {
    //     this.insuranceAmount = event.target.value;
    //     this.calculateEligibility();
    // }



    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    // Handle changes to the insurance amount
    handleInsuranceAmountChange(event) {
        this.insuranceAmount = event.target.value;
        this.calculateEligibility();
    }

    // Calculate Eligibility based on insurance amount, annual income, and policy type
    calculateEligibility() {
        console.log('Insurance Amount:', this.insuranceAmount);
        console.log('Annual Income:', this.annualIncome);
        console.log('Record Type:', this.recordType);

        if (this.insuranceAmount && this.annualIncome && this.recordType) {
            const insuranceAmount = parseFloat(this.insuranceAmount);
            const annualIncome = parseFloat(this.annualIncome);
            const policyType = this.recordType;
            // Determine eligibility based on policy type and annual income
            let eligibleInsuranceAmount = 0;

            if (policyType == '012J400000008cVIAQ') {//life insurance
                console.log('inside life insurance');
                if (annualIncome < 150000 || insuranceAmount < 100000) {
                    console.log('inside life insurance if');
                    this.isEligible = false;
                    this.errorMessage = '';
                }
                else if (annualIncome >= 150000 && insuranceAmount >= 100000) {
                    console.log('inside life insurance if');
                    this.isEligible = true;
                    this.errorMessage = '';
                    //     eligibleInsuranceAmount = 100000;
                    //     console.log("eligibleInsuranceAmount for life>>" + eligibleInsuranceAmount);
                    // } else if (annualIncome >= 250000) {
                    //     console.log('inside life insurance else if');
                    //     eligibleInsuranceAmount = 200000;
                    //     console.log("eligibleInsuranceAmount for life>>" + eligibleInsuranceAmount);
                }
            } else if (policyType == '012J400000008cuIAA') {//health insurance
                if (annualIncome < 100000 || insuranceAmount < 100000) {
                    this.isEligible = false;
                    this.errorMessage = '';
                    //     eligibleInsuranceAmount = 100000;
                    //     console.log("eligibleInsuranceAmount for health>>" + eligibleInsuranceAmount);
                }
                else if (annualIncome >= 100000 && insuranceAmount >= 100000) {
                    this.isEligible = true;
                    this.errorMessage = '';
                    // eligibleInsuranceAmount = 250000;
                    // console.log("eligibleInsuranceAmount for health>>" + eligibleInsuranceAmount);
                }
            } else if (policyType == '012J400000008cGIAQ') {//property insurance
                if (annualIncome < 300000 || insuranceAmount < 100000) {
                    this.isEligible = false;
                    this.errorMessage = '';
                }
                else if (annualIncome >= 300000 && insuranceAmount >= 100000) {
                    this.isEligible = true;
                    this.errorMessage = '';
                    //     eligibleInsuranceAmount = 150000;
                    //     console.log("eligibleInsuranceAmount for property>>" + eligibleInsuranceAmount);
                    // } else if (annualIncome >= 600000) {
                    //     eligibleInsuranceAmount = 300000;
                    //     console.log("eligibleInsuranceAmount for property>>" + eligibleInsuranceAmount);
                }
            } else if (policyType == '012J400000008d4IAA') {//disability insurance
                if (annualIncome < 100000 || insuranceAmount < 100000) {
                    this.isEligible = false;
                    this.errorMessage = '';
                }
                else if (annualIncome >= 100000 && insuranceAmount >= 100000) {
                    this.isEligible = true;
                    this.errorMessage = '';
                    //     eligibleInsuranceAmount = 100000;
                    //     console.log("eligibleInsuranceAmount for disability>>" + eligibleInsuranceAmount);
                    // } else if (annualIncome >= 250000) {
                    //     eligibleInsuranceAmount = 250000;
                    //     console.log("eligibleInsuranceAmount for disability>>" + eligibleInsuranceAmount);
                }
            }
            else if (policyType == '012J400000008bwIAA') {//automobile insurance
                if (annualIncome < 150000 || insuranceAmount < 100000) {
                    this.isEligible = false;
                    this.errorMessage = '';
                }
                else if (annualIncome >= 150000 && insuranceAmount >= 100000) {
                    this.isEligible = true;
                    this.errorMessage = '';
                    //     eligibleInsuranceAmount = 100000;
                    //     console.log("eligibleInsuranceAmount for automobile>>" + eligibleInsuranceAmount);
                    // } else if (annualIncome >= 250000) {
                    //     eligibleInsuranceAmount = 200000;
                    //     console.log("eligibleInsuranceAmount for automobile>>" + eligibleInsuranceAmount);
                }
            }
            else {
                this.isEligible = false;
                this.errorMessage = `For an annual income of Rs ${annualIncome}, you are only eligible for ${policyType} up to Rs ${eligibleInsuranceAmount}.`;
                console.log('Error Message:', this.errorMessage);
            }

            // // Check if the entered insurance amount is eligible
            // if (insuranceAmount <= eligibleInsuranceAmount) {
            //     this.isEligible = true;
            //     this.errorMessage = ''; // Clear error if eligible
            // } 

        } else {
            // Missing required inputs
            this.isEligible = false;
            this.errorMessage = 'Please enter a valid insurance amount, annual income, and select a policy type.';
            console.log('Error Message:', this.errorMessage);
        }
    }

    //start of step 3..........
    handleCoverageChange(event) {
        this.coveragep1 = event.target.value;
    }

    handleCoverageChange2(event) {
        this.coveragep2 = event.target.value;
    }
    // selectTenure(event) {
    //     const selectedTenure = event.currentTarget.dataset.tenure;
    //     alert(`You selected the ${selectedTenure} year plan.`);
    // }
    plan1() {
        this.p1 = true;
        this.p2 = false;
        this.resetPlanDefaults(2);
    }

    plan2() {
        this.p1 = false;
        this.p2 = true;
        this.resetPlanDefaults(1);
    }
    get card1Class() {
        return this.p1 ? 'card highlight' : 'card';
    }

    get card2Class() {
        return this.p2 ? 'card highlight' : 'card';
    }
    calculatePremium(coverageamt, duration) {
        let basePremium = 15500; // Base premium for 5 lacs coverage and 1-year plan

        // Adjust premium based on coverage
        if (coverageamt === 7) {
            basePremium += 20000;
        } else if (coverageamt === 10) {
            basePremium += 25000;
        }

        let totalPremium = basePremium * duration;

        // Apply discount for 2-year or 3-year plans
        let discountPercentage = 0;
        if (duration === 2) {
            discountPercentage = 4;
        } else if (duration === 3) {
            discountPercentage = 6;
        }

        const discount = (totalPremium * discountPercentage) / 100;
        const discountedPremium = totalPremium - discount;

        return {
            original: totalPremium,
            discounted: discountedPremium
        };

    }

    calculatePremiump2(coverageamt, duration) {
        let basePremium = 11400; // Base premium for 5 lacs coverage and 1-year plan

        // Adjust premium based on coverage
        if (coverageamt === 7) {
            basePremium += 5000;
        } else if (coverageamt === 10) {
            basePremium += 10000;
        }
        else if (coverageamt === 15) {
            basePremium += 15000;
        }
        else if (coverageamt === 20) {
            basePremium += 20000;
        }

        let totalPremium = basePremium * duration;

        // Apply discount for 2-year or 3-year plans
        let discountPercentage = 0;
        if (duration === 2) {
            discountPercentage = 4;
        } else if (duration === 3) {
            discountPercentage = 6;
        }

        const discount = (totalPremium * discountPercentage) / 100;
        const discountedPremium = totalPremium - discount;

        return {
            original: totalPremium,
            discounted: discountedPremium
        };

    }

    setCoveragep1(event) {
        this.coveragep1 = event.currentTarget.dataset.value;
        this.coverageamt = parseInt(event.currentTarget.getAttribute('coverage-amount'));

        // Calculate premiums for each plan
        const plan1 = this.calculatePremium(this.coverageamt, 1);
        const plan2 = this.calculatePremium(this.coverageamt, 2);
        const plan3 = this.calculatePremium(this.coverageamt, 3);

        // Store calculated premiums in variables
        this.plan1Original = plan1.original;
        this.plan2Original = plan2.original;
        this.plan2Discounted = plan2.discounted;
        this.plan3Original = plan3.original;
        this.plan3Discounted = plan3.discounted;
    }
    setCoveragep2(event) {
        this.coveragep2 = event.currentTarget.dataset.value;
        this.coverageamtp2 = parseInt(event.currentTarget.getAttribute('coverage-amount'));

        // Calculate premiums for each plan
        const plan1 = this.calculatePremiump2(this.coverageamtp2, 1);
        const plan2 = this.calculatePremiump2(this.coverageamtp2, 2);
        const plan3 = this.calculatePremiump2(this.coverageamtp2, 3);

        // Store calculated premiums in variables
        this.p2y1 = plan1.original;
        this.p2y2o = plan2.original;
        this.p2y2d = plan2.discounted;
        this.p2y3o = plan3.original;
        this.p2y3d = plan3.discounted;
    }
    resetPlanDefaults(plan) {
        if (plan === 1) {
            this.plan1Original = 35500;
            this.plan2Original = 71000;
            this.plan2Discounted = 68160;
            this.plan3Original = 106500;
            this.plan3Discounted = 100110;
            this.coveragep1 = 5;
            this.coverageamt = 7;
            this.selectedTenure = 1;
            this.premimumAmount = 41890;
            this.monthlyamount = 2958;
            this.planyears = 0;
        } else if (plan === 2) {
            this.p2y1 = 16400;
            this.p2y2o = 32800;
            this.p2y2d = 31488;
            this.p2y3o = 49200;
            this.p2y3d = 46248;
            this.coveragep2 = 5;
            this.coverageamtp2 = 7;
            this.selectedTenurep2 = 1;
            this.premimumAmounts = 1935;
            this.monthlyamountp2 = 1366;
            this.planyear = 0;
        }
    }
    selectTenure(event) {
        const tenure = event.target.dataset.tenure;
        this.planyear = tenure;
        // alert(`You selected ${tenure} years.`);
        if (tenure == "1") {
            this.premimumAmounts = Math.round((this.p2y1 * 0.18) + this.p2y1);
            this.premAmounts = Math.round(this.p2y1);
            this.gstp2 = Math.round(this.p2y1 * 0.18);
            this.selectedTenurep2 = 1;
            this.monthlyamountp2 = Math.round(this.p2y1 / 12);
        }
        else if (tenure == "2") {
            this.premimumAmounts = Math.round((this.p2y2d * 0.18) + this.p2y2d);
            this.premAmounts = Math.round(this.p2y2d);
            this.gstp2 = Math.round(this.p2y2d * 0.18);
            this.selectedTenurep2 = 2;
            this.monthlyamountp2 = Math.round(this.p2y2d / 12);;
        }
        else if (tenure == "3") {
            this.premimumAmounts = Math.round((this.p2y3d * 0.18) + this.p2y3d);
            this.premAmounts = Math.round(this.p2y3d);
            this.gstp2 = Math.round(this.p2y3d * 0.18);
            this.selectedTenurep2 = 3;
            this.monthlyamountp2 = Math.round(this.p2y3d / 12);;
        }
    }
    selectTenures(event) {
        const tenure = event.target.dataset.tenure;
        this.planyears = tenure;
        // alert(`You selected ${tenure} years.`);
        if (tenure == "1") {
            this.premimumAmount = Math.round((this.plan1Original * 0.18) + this.plan1Original);
            this.premAmount = Math.round(this.plan1Original);
            this.gstp1 = Math.round(this.plan1Original * 0.18);
            this.selectedTenure = 1;
            this.monthlyamount = Math.round(this.plan1Original / 12);
        }
        else if (tenure == "2") {
            this.premimumAmount = Math.round((this.plan2Discounted * 0.18) + this.plan2Discounted);
            this.premAmount = Math.round(this.plan2Discounted);
            this.gstp1 = Math.round(this.plan2Discounted * 0.18);
            this.selectedTenure = 2;
            this.monthlyamount = Math.round(this.plan2Discounted / 12);
        }
        else if (tenure == "3") {
            this.premimumAmount = Math.round((this.plan3Discounted * 0.18) + this.plan3Discounted);
            this.premAmount = Math.round(this.plan3Discounted);
            this.gstp1 = Math.round(this.plan3Discounted * 0.18);
            this.selectedTenure = 3;
            this.monthlyamount = Math.round(this.plan3Discounted / 12);
        }
    }

    get tenure1Class() {
        return this.selectedTenure === 1 ? 'tenure-card highlight' : 'tenure-card';
    }

    get tenure2Class() {
        return this.selectedTenure === 2 ? 'tenure-card highlight' : 'tenure-card';
    }

    get tenure3Class() {
        return this.selectedTenure === 3 ? 'tenure-card highlight' : 'tenure-card';
    }

    get tenurep1Class() {
        return this.selectedTenurep2 === 1 ? 'tenure-card highlight' : 'tenure-card';
    }

    get tenurep2Class() {
        return this.selectedTenurep2 === 2 ? 'tenure-card highlight' : 'tenure-card';
    }

    get tenurep3Class() {
        return this.selectedTenurep2 === 3 ? 'tenure-card highlight' : 'tenure-card';
    }




    togglePremiumBill() {
        this.openbill = !this.openbill;
    }

    // Computes the accordion class dynamically
    get accordionClass() {
        return this.openbill
            ? "slds-grid slds-grid_vertical billcard open"
            : "slds-grid slds-grid_vertical billcard closed";
    }
    // end of step 3......................


    //Automobile insurance
    //  selectVehicleType(event) {
    //         const VehicleId = event.currentTarget.dataset.id;
    //             // Toggle selection for other family members
    //             this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
    //                 if (Vehicle.id === VehicleId) {
    //                     const isSelected = !Vehicle.isSelected;
    //                     return {
    //                         ...Vehicle,
    //                         isSelected,
    //                         darkBorder: isSelected ? 'dark' : 'null'
    //                     };
    //                 }
    //                 return Vehicle;
    //             });

    //             this.selectedVehicle = this.TypesOfVehicles.filter((Vehicle) => Vehicle.isSelected);

    //     }

    selectVehicleType(event) {
        const VehicleId = event.currentTarget.dataset.id;

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            // Determine if the current vehicle should be selected
            const isSelected = Vehicle.id === VehicleId ? !Vehicle.isSelected : false;

            // Update the vehicle's state
            return {
                ...Vehicle,
                isSelected,
                darkBorder: isSelected ? 'dark' : null,
                VehicleRegistrationNumber: isSelected ? Vehicle.VehicleRegistrationNumber : '' // Clear VehicleRegistrationNumber on deselection
            };
        });

        // Update selectedVehicle to contain only the currently selected vehicle
        this.selectedVehicle = this.TypesOfVehicles.filter((Vehicle) => Vehicle.isSelected);

        // If no vehicle is selected, clear the global RegistrationNo
        if (this.selectedVehicle.length === 0) {
            this.RegistrationNo = '';
        } else {
            // Set RegistrationNo to the selected vehicle's registration number
            this.RegistrationNo = this.selectedVehicle[0].VehicleRegistrationNumber;
        }
    }
    updateRegistrationNo(event) {
        const VehicleId = event.currentTarget.dataset.id;
        const RegistrationNo = event.target.value;
        this.RegistrationNo = RegistrationNo;

        this.selectedVehicle = this.selectedVehicle.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleRegistrationNumber: RegistrationNo };
            }
            return Vehicle;
        });

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleRegistrationNumber: RegistrationNo };
            }
            return Vehicle;
        });

        this.ValidateRegistrationNumber();
    }

    ValidateRegistrationNumber() {
        const registrationPattern = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;
        if (!registrationPattern.test(this.RegistrationNo)) {
            console.error(
                `Invalid Registration Number: ${this.RegistrationNo}. It should match the format "MH XX AB 1234".`
            );
            // Optionally, you can set an error message or flag to display in the UI
            this.errorMessage = 'Invalid Registration Number. Format should be "MH XX AB 1234".';
        } else {
            console.log(`Valid Registration Number: ${this.RegistrationNo}`);
            this.errorMessage = ''; // Clear any existing error message
        }
    }
    handleNextButtonAutomobile() {
        // Check if a vehicle is selected
        if (!this.selectedVehicle || this.selectedVehicle.length === 0) {
            this.errorMessage = 'Please select a vehicle before proceeding to the next step.';
            console.error(this.errorMessage);
            return; // Stop execution if no vehicle is selected
        }

        // Check if the registration number is valid
        const registrationPattern = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;
        if (!registrationPattern.test(this.RegistrationNo)) {
            this.errorMessage = 'Invalid Registration Number. Format should be "MH XX AB 1234".';
            alert('Invalid Registration Number. Format should be "MH XX AB 1234".');
            return; // Stop execution if registration number is invalid
        }
        const isValid = /^[A-HJ-NPR-Z0-9]{17}$/;
        if(!isValid.test(this.VINumber)){
             this.errorMessage = 'Please select valid VINumber. Format should be "1HGCM82633A123456(17)"';
            alert('Please select valid VINumber. Format should be "1HGCM82633A123456(17)"');
            return;
        }

        // Proceed to the next step if validation passes
        const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            this.currentStep = this.steps[currentIndex + 1].value;
            this.errorMessage = ''; // Clear any previous error message
            console.log(`Moved to the next step: ${this.currentStep}`);
        }
    }

    updateYearofManufacture(event) {
        const VehicleId = event.currentTarget.dataset.id;
        const MFY = event.target.value;
        this.YearofManufacture = MFY;

        this.selectedVehicle = this.selectedVehicle.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, YearofManufacture: MFY };
            }
            return Vehicle;
        });

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, YearofManufacture: MFY };
            }
            return Vehicle;
        });

    }
    updateVehicleModel(event) {
        const VehicleId = event.currentTarget.dataset.id;
        const vehmodel = event.target.value;
        this.madeandmodel = vehmodel;

        this.selectedVehicle = this.selectedVehicle.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleModel: vehmodel };
            }
            return Vehicle;
        });

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleModel: vehmodel };
            }
            return Vehicle;
        });

    }
    updateYearofManufacture(event) {
        const VehicleId = event.currentTarget.dataset.id;
        const MFY = event.target.value;
        this.YearofManufacture = MFY;

        this.selectedVehicle = this.selectedVehicle.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, YearofManufacture: MFY };
            }
            return Vehicle;
        });

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, YearofManufacture: MFY };
            }
            return Vehicle;
        });

    }
    updateVIN(event) {
        const VehicleId = event.currentTarget.dataset.id;
        const VIN = event.target.value;
        this.VINumber = VIN;

        this.selectedVehicle = this.selectedVehicle.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleIdentificationNumber: VIN };
            }
            return Vehicle;
        });

        this.TypesOfVehicles = this.TypesOfVehicles.map((Vehicle) => {
            if (Vehicle.id === VehicleId) {
                return { ...Vehicle, VehicleIdentificationNumber: VIN };
            }
            return Vehicle;
        });
        this.ValidateVIN();

    }

    ValidateVIN(VIN) {
        // Check if VIN is 17 characters long and alphanumeric
        const isValid = /^[A-HJ-NPR-Z0-9]{17}$/.test(VIN); // Excludes I, O, Q to avoid confusion with numbers

        if (!isValid) {
            alert('Invalid VIN! A valid VIN must be 17 characters long and alphanumeric. Example: 1HGCM82633A123456.');
            return false;
        }

        console.log('VIN is valid:', VIN);
        return true;
    }
    get type1Class() {
        return this.t1 ? 'card highlight' : 'card';
    }
    get type2Class() {
        return this.t2 ? 'card highlight' : 'card';
    }
    get type3Class() {
        return this.t3 ? 'card highlight' : 'card';
    }
    type1() {
        // this.defaultslid=true;
        this.t1 = true;
        this.t2 = false;
        this.t3=false;
    }
    type2() {
        // this.defaultslid=true;
        this.t1 = false;
        this.t2 = true;
        this.t3=false;
    }
    type3() {
        // this.defaultslid=true;
        this.t1 = false;
        this.t2 = false;
        this.t3=true;
    }
    
    // handleCoverageChanget1(event) {
    //     this.coveraget1 = event.target.value;
    // }
    // handleCoverageChanget2(event) {
    //     this.coveraget2 = event.target.value;
    // }
    // handleCoverageChanget3(event) {
    //     this.coveraget3 = event.target.value;
    // }
    setCoveraget1(event) {
        this.coveraget1 = event.currentTarget.dataset.value;
        this.coverageamtt1 = parseInt(event.currentTarget.getAttribute('coverage-amount'));

        // // Calculate premiums for each plan
        // const plan1 = this.calculatePremium(this.coverageamtt1, 1);
        // const plan2 = this.calculatePremium(this.coverageamtt1, 2);
        // const plan3 = this.calculatePremium(this.coverageamtt1, 3);

        // // Store calculated premiums in variables
        // this.plan1Original = plan1.original;
        // this.plan2Original = plan2.original;
        // this.plan2Discounted = plan2.discounted;
        // this.plan3Original = plan3.original;
        // this.plan3Discounted = plan3.discounted;
    }
    setCoveraget2(event) {
        this.coveraget2 = event.currentTarget.dataset.value;
        this.coverageamtt2 = parseInt(event.currentTarget.getAttribute('coverage-amount'));

        // // Calculate premiums for each plan
        // const plan1 = this.calculatePremium(this.coverageamtt1, 1);
        // const plan2 = this.calculatePremium(this.coverageamtt1, 2);
        // const plan3 = this.calculatePremium(this.coverageamtt1, 3);

        // // Store calculated premiums in variables
        // this.plan1Original = plan1.original;
        // this.plan2Original = plan2.original;
        // this.plan2Discounted = plan2.discounted;
        // this.plan3Original = plan3.original;
        // this.plan3Discounted = plan3.discounted;
    }
    setCoveraget3(event) {
        this.coveraget3 = event.currentTarget.dataset.value;
        this.coverageamtt3 = parseInt(event.currentTarget.getAttribute('coverage-amount'));

        // // Calculate premiums for each plan
        // const plan1 = this.calculatePremium(this.coverageamtt1, 1);
        // const plan2 = this.calculatePremium(this.coverageamtt1, 2);
        // const plan3 = this.calculatePremium(this.coverageamtt1, 3);

        // // Store calculated premiums in variables
        // this.plan1Original = plan1.original;
        // this.plan2Original = plan2.original;
        // this.plan2Discounted = plan2.discounted;
        // this.plan3Original = plan3.original;
        // this.plan3Discounted = plan3.discounted;
    }
    handleNextClickinsurancestep4(){
         const currentIndex = this.steps.findIndex(step => step.value === this.currentStep);
        if (currentIndex < this.steps.length - 1) {
            this.currentStep = this.steps[currentIndex + 1].value;
            this.errorMessage = ''; // Clear any previous error message
            console.log(`Moved to the next step: ${this.currentStep}`);
        }
    }
}