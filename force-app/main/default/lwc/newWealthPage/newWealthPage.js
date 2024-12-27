import { LightningElement, track, wire, api } from 'lwc';
import newWealthPic from '@salesforce/resourceUrl/newWealthPic';
import insurancePic from '@salesforce/resourceUrl/insurancePic';
import LoanPic from '@salesforce/resourceUrl/LoanPic';
import advisorPic from '@salesforce/resourceUrl/advisorPic';
import accountPic from '@salesforce/resourceUrl/accountPic';
import backImg from '@salesforce/resourceUrl/backImg'; 
import Insuranceee from '@salesforce/resourceUrl/Insuranceee'; 
import advi from '@salesforce/resourceUrl/advi'; 
import homeAdvi from '@salesforce/resourceUrl/homeAdvi'; 
import profile from '@salesforce/resourceUrl/profile'; 
import assetsPic from '@salesforce/resourceUrl/assetsPic';
import assePic from '@salesforce/resourceUrl/assePic';
import endPage from '@salesforce/resourceUrl/endPage';
import suggestionPic from '@salesforce/resourceUrl/suggestionPic';
import BackButton from '@salesforce/resourceUrl/BackButton';
import searchAccounts from '@salesforce/apex/getAccountTable.searchAccounts';
import getLoanSummary from '@salesforce/apex/getAccountTable.getLoanSummary';
import getInsurancePolicies from '@salesforce/apex/WealthManagementInsuranceController.getInsurancePolicies';
import getLoansByAccountId from '@salesforce/apex/WealthLoan.getLoansByAccountId';
import getAssetsByAccountId from '@salesforce/apex/WealthLoan.getAssetsByAccountId';
import saveAsset from '@salesforce/apex/WealthLoan.saveAsset';
import getAdvisorsByAccountId from '@salesforce/apex/AdvisorController.getAdvisorsByAccountId';
import assignAdvisorToAccount from '@salesforce/apex/getAdvisor.assignAdvisorToAccount';
import getAllAdvi from '@salesforce/apex/getAdvisor.getAllAdvi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getAccountDataSummary from '@salesforce/apex/AccountRelatedDataController.getAccountDataSummary';
import getFinancialSuggestions from '@salesforce/apex/WealthController.getFinancialSuggestions';
import { loadScript } from 'lightning/platformResourceLoader';
import GRAPH_CHART from '@salesforce/resourceUrl/graphChart';
import MobileView from './newWealthMobile.html';
import DesktopView from './newWealthPage.html';


export default class NewWealthPage extends LightningElement {
       
   render() {
    const isLarge = window.innerWidth > 1024; 
    return isLarge ? DesktopView : MobileView;
    //return MobileView;
}

    wealthPicUrl = newWealthPic;
    insurancePicUrl=insurancePic;
    loanPicUrl=LoanPic;
    advisorPicUrl=advisorPic;
    backgroundImageUrl =backImg;
    accountPictureUrl= accountPic;
    suggestionUrl=suggestionPic;
    inPicUrl=Insuranceee;
    assetPicUrl=assetsPic;
    BackPicUrl=BackButton;
    adviPicUrl=advi;
    imageeeUrl=homeAdvi;
    profilePicUrl=profile;
    assUrl =assePic;
    imageeeeUrl=endPage;
    @track accounts = [];
    @track error;
    searchTerm = '';
    @track openTable = true;
    @track openActivity = false;
    @track selectedAccount = null;
    @track openDahboard = true;

    @api accountId; // Store the selected account's Id
    account;
    loan;
    personalDetailsProgress = 0;
    accountVerificationProgress = 0;
    loanDetailsProgress = 0;

    

    

    // Wire method for searching accounts
   @wire(searchAccounts, { searchText: '$searchTerm' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data; // Keep the original data as-is
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = [];
        }
    }

    
     getMonthlyIncome(annualIncome) {
        return annualIncome ? (annualIncome / 12).toFixed(2) : 0;
    }


    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
    }


    get filteredAccounts() {
        if (this.searchTerm) {
            return this.accounts.filter(account =>
                (account.Name && account.Name.toLowerCase().includes(this.searchTerm)) ||
                (account.FirstName__c && account.FirstName__c.toLowerCase().includes(this.searchTerm))
            );
        }
        return this.accounts;
    }

   


    // Triggered when user selects "More Actions" on an account
    handleMoreActions(event) {
        const accountName = event.target.dataset.name;
        this.selectedAccount = this.accounts.find(account => account.Name === accountName);

        if (this.selectedAccount) {
            this.accountId = this.selectedAccount.Id; // Set accountId to trigger wire
             this.fetchLoanSummary();
            this.fetchInsurancePolicies(); 
            this.fetchAdvisors();
            this.loadAdvisors() ;
            this.fetchAssets();
            const annualIncome = this.selectedAccount.Annual_Income__c || 0; // Replace with your field API name
        const totalBalance = this.selectedAccount.Total_Balance__c || 0; // Replace with your field API name

        this.getFinancialAdvice(annualIncome, totalBalance); // Pass values to get advice
        setTimeout(() => {
        const canvas = this.template.querySelector('canvas');
        if (canvas) {
            // Reset canvas dimensions to default
            canvas.style.width = '400px'; // Match CSS values
            canvas.style.height = '400px';

            // Destroy existing chart if it exists
            if (this.chart) {
                this.chart.destroy();
                console.log('Chart destroyed');
            }

            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Reinitialize the chart
                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: this.chartData || {
                        labels: [],
                        datasets: [{ data: [], backgroundColor: [] }],
                    },
                    options: {
                        responsive: false, // Disable responsive resizing
                        maintainAspectRatio: false,
                    },
                });
                console.log('Chart reinitialized');
            } else {
                console.error('Unable to get 2D context for canvas');
            }
        } else {
            console.error('Canvas not found');
        }
    }, 0); // Allow DOM to update before accessing canvas
            
           
        }

        this.openTable = false;
        this.openActivity = true;
        this.openDahboard = false;
        
    }
   @track financialSuggestion;
    getFinancialAdvice(annualIncome, totalBalance) {
    console.log('Annual Income:', annualIncome); // Log the annual income
    console.log('Total Balance:', totalBalance); // Log the total balance

    // Call the server-side method with both annualIncome and totalBalance
    getFinancialSuggestions({ annualIncome, totalBalance })
        .then((suggestion) => {
            console.log('Financial Suggestion:', suggestion); // Log the financial suggestion
            this.financialSuggestion = suggestion; // Store the financial suggestion
        })
        .catch((error) => {
            console.error('Error fetching financial suggestion: ', error);
        });
}



  chart; // Holds the Chart.js instance
    isChartJsInitialized = false;

    // Initial chart data
    chartData = null; // Set to null initially to show spinner

    // Computed property for valid Account ID
    get validAccountId() {
        return this.accountId && this.accountId.trim() ? this.accountId : null;
    }

    // Wire method to fetch account data summary
    @wire(getAccountDataSummary, { accountId: '$validAccountId' })
    wiredSummary({ data, error }) {
        if (data) {
            this.chartData = {
                labels: ['Insurance Policies', 'Loans', 'Assets', 'Advisors'],
                datasets: [
                    {
                        data: [
                            data.totalInsurancePolicies || 0,
                            data.totalLoans || 0,
                            data.totalAssets || 0,
                            data.totalAdvisors || 0,
                        ],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                    },
                ],
            };
            console.log('Updated Chart Data:', this.chartData);
            this.updateChart();
        } else if (error) {
            console.error('Error fetching account data:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to load account data',
                    variant: 'error',
                })
            );
        }
    }

    // Lifecycle hook to load Chart.js
  renderedCallback() {
    if (this.isChartJsInitialized) {
        // Ensure the chart is reinitialized when revisiting the component
        this.updateChart();
        return;
    }

    const graphChartUrl = `${GRAPH_CHART}?cacheBuster=${Date.now()}`;
    console.log('Loading Chart.js from:', graphChartUrl);

    loadScript(this, graphChartUrl)
        .then(() => {
            this.isChartJsInitialized = true;
            console.log('Chart.js loaded successfully');
            this.initializeChart();
        })
        .catch((error) => {
            console.error('Error loading Chart.js:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Chart.js',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
}

    // Initialize the doughnut chart
  initializeChart() {
    const canvas = this.template.querySelector('canvas');
    if (!canvas) {
        console.error('Canvas not found in DOM. Retrying...');
        setTimeout(() => this.initializeChart(), 100); // Retry after a short delay
        return;
    }

    console.log('Canvas found:', canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Unable to get 2D context for canvas');
        return;
    }

    // Destroy any existing chart instance to avoid conflicts
    if (this.chart) {
        this.chart.destroy();
        console.log('Existing chart instance destroyed');
    }

    this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: this.chartData || {
            labels: [],
            datasets: [{ data: [], backgroundColor: [] }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });

    console.log('Chart Initialized:', this.chart);
}


  updateChart() {
    if (this.chart && this.chartData) {
        this.chart.data = this.chartData;
        this.chart.update();
    } else {
        console.log('Chart instance not found or chart data is null. Reinitializing chart...');
        this.initializeChart();
    }
}

    handleBackToTable() {
        this.openTable = true;
        this.openActivity = false;
        this.selectedAccount = null;
        this.openDahboard = true;
        
    }

    //@track loans = [];
    @track totalLoanAmount = 0;
    @track totalAmountToBeRepaid = 0;
    @track accountId;

    //@track accounts = [];
    @track insurancePolicies = []; // Initialize as empty array
    @track loans = []; // Initialize as empty array
    @track error;
    @track insuranceDetailsVisible = false; // Toggle visibility for insurance
    @track loanDetailsVisible = false; // Tog
     // Fetch loan summary from Apex
    fetchLoanSummary() {
        getLoanSummary({ accountId: this.accountId })
            .then((data) => {
                if (data) {
                    this.loans = data.loans;
                    this.totalLoanAmount = data.totalLoanAmount;
                    this.totalAmountToBeRepaid = data.totalAmountToBeRepaid;
                }
            })
            .catch((error) => {
                console.error('Error fetching loan summary:', error);
                this.loans = [];
                this.totalLoanAmount = 0;
                this.totalAmountToBeRepaid = 0;
            });
    }
    @track noInsuranceResults = false; // Flag for empty results
    @track insuranceDetailsVisible = false; // Toggle visibility of insurance details

   

    // Fetch insurance policies for the given accountId
  fetchInsurancePolicies() {
    if (this.selectedAccount && this.selectedAccount.Id) { // Validate selectedAccount and Id
        getInsurancePolicies({ accountId: this.selectedAccount.Id })
            .then((result) => {
                console.log('Insurance Policies Retrieved:', result); // Log retrieved policies
                if (result && result.length > 0) {
                    this.insurancePolicies = result;
                    this.noInsuranceResults = false; // Reset flag
                } else {
                    console.log('No Insurance Policies Found for Account Id:', this.selectedAccount.Id);
                    this.insurancePolicies = [];
                    this.noInsuranceResults = true; // Set flag
                }
            })
            .catch((error) => {
                console.error('Error fetching insurance policies:', error);
                this.insurancePolicies = [];
                this.noInsuranceResults = true; // Handle errors
            });
    } else {
        console.error('Invalid or missing selectedAccount Id:', this.selectedAccount);
    }
}

    // Fetch loan information for the selected account
    fetchLoans() {
        if (this.selectedAccount.Id) {  // Use Id instead of Name for querying
            getLoansByAccountId({ accountId: this.selectedAccount.Id })  // Pass Id to Apex method
                .then((result) => {
                    if (result.length > 0) {
                        this.loans = result;
                         this.noLoanResults = this.loans.length === 0; // Set flag based on loans found
                
                    } else {
                        this.loans = []; // Clear if no loans found
                        this.noLoanResults = true; // Set flag if no loans
                    }
                })
                .catch((error) => {
                    console.error('Error fetching loans: ', error);
                    this.loans = []; // Clear on error
                    this.noLoanResults = true; // Set flag if error occurs
                });
        }
    }
   fetchAssets() {
        if (this.selectedAccount.Id) {
            getAssetsByAccountId({ accountId: this.selectedAccount.Id })
                .then((result) => {
                    if (result.length > 0) {
                        this.assets = result;
                        this.noassetsResults = false;
                    } else {
                        this.assets = [];
                        this.noassetsResults = true;
                    }
                })
                .catch((error) => {
                    console.error('Error fetching assets: ', error);
                    this.assets = [];
                    this.noassetsResults = true;
                });
        }
    }
    toggleInsuranceDetails() {
    this.insuranceDetailsVisible = !this.insuranceDetailsVisible;
    this.loanDetailsVisible = false;
    this.advisorDetailsVisible = false;
    this.openActivity = false;
    if (this.insuranceDetailsVisible) {
            const scrollContainer = this.template.querySelector('.insurancescroll');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0; // Scroll to the top of the container
            }
        }
     if (this.isChartJsInitialized) {
        // Ensure the chart is reinitialized when revisiting the component
        this.updateChart();
        return;
    }
        
}


    toggleLoanDetails() {
        this.loanDetailsVisible = !this.loanDetailsVisible;
        this.insuranceDetailsVisible=false;
        this.advisorDetailsVisible = false;
          this.openActivity=false;
         if (this.loanDetailsVisible) {
            const scrollContainer = this.template.querySelector('.insurancescroll');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0; // Scroll to the top of the container
            }
        }
         if (this.isChartJsInitialized) {
        // Ensure the chart is reinitialized when revisiting the component
        this.updateChart();
        return;
    }
    }
    @track isAdvisorModalOpen = false; // Modal visibility flag

   

    // Open the modal
    openAdvisorModal() {
        this.isAdvisorModalOpen = true;
    }

      // Close the modal
    closeAdvisorModal() {
        this.advisorName='';
        this.emailAddress='';
        this.specialization='';
        this.isAdvisorModalOpen = false;
    }

       fetchAdvisors() {
        if (this.selectedAccount && this.selectedAccount.Id) {
            getAdvisorsByAccountId({ accountId: this.selectedAccount.Id })
                .then((result) => {
                  
                    this.advisors = result; // Store fetched advisors
                    this.noAdvisorResults = this.advisors.length === 0; // Check if no advisors found
        //              this.advisorTableVisible=true;
        //   this.advisorDetailsVisible=true;
                    
                })
                .catch((error) => {
                    console.error('Error fetching advisors:', error);
                    this.advisors = []; // Clear advisors on error
                    this.noAdvisorResults = true; // Set flag indicating no advisors due to error
                });
        }
    }

   

    @track advisorDetailsVisible = false;
    assignedAdvi(){
        this.advisorDetailsVisible = !this.advisorDetailsVisible; // Toggle visibility
    this.loanDetailsVisible =false;
        this.insuranceDetailsVisible=false;
        this.openActivity=false;
    }



toggleAdvisorDetails() {
    this.advisorDetailsVisible = !this.advisorDetailsVisible; // Toggle visibility
    this.loanDetailsVisible =false;
        this.insuranceDetailsVisible=false;
        this.openActivity=false;
           if (this.advisorDetailsVisible) {
            const scrollContainer = this.template.querySelector('.insurancescroll');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0; // Scroll to the top of the container
            }
        }
     if (this.isChartJsInitialized) {
        // Ensure the chart is reinitialized when revisiting the component
        this.updateChart();
        return;
    }
       
}
toggleAssetDetails(){
     this.assetsDetailsVisible = !this.assetsDetailsVisible;
         this.loanDetailsVisible =false;
        this.insuranceDetailsVisible=false;
        this.openActivity=false;
         if (this.assetsDetailsVisible) {
            const scrollContainer = this.template.querySelector('.insurancescroll');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0; // Scroll to the top of the container
            }
        }
         if (this.isChartJsInitialized) {
        // Ensure the chart is reinitialized when revisiting the component
        this.updateChart();
        return;
    }

}

 @track advisors = []; // List of advisors
    @track assignedAdvisors = []; // Advisors assigned to the selected account
    @track selectedAdvisorId = null; // Currently selected advisor for assignment
    @track noAdvisorResults = false;
    @track isAdvisorModalOpen = false;


    // Open advisor modal
    openAdvisorModal() {
        this.isAdvisorModalOpen = true;
        this.fetchAllAdvisors();
    }

    // Close advisor modal
    closeAdvisorModal() {
        this.isAdvisorModalOpen = false;
    }

    // Handle advisor selection
    handleAdvisorSelect(event) {
        this.selectedAdvisorId = event.target.value;
    }

    // Show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }

backy() {
    this.openActivity = true;
    this.insuranceDetailsVisible = false;
    this.loanDetailsVisible = false;
    this.advisorDetailsVisible = false;
    this.advisorTableVisible = false;
    this.assetsDetailsVisible = false;
    this.openAssetsss = false;

    setTimeout(() => {
        const canvas = this.template.querySelector('canvas');
        if (canvas) {
            // Reset canvas dimensions to default
            canvas.style.width = '400px'; // Match CSS values
            canvas.style.height = '400px';

            // Destroy existing chart if it exists
            if (this.chart) {
                this.chart.destroy();
                console.log('Chart destroyed');
            }

            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Reinitialize the chart
                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: this.chartData || {
                        labels: [],
                        datasets: [{ data: [], backgroundColor: [] }],
                    },
                    options: {
                        responsive: false, // Disable responsive resizing
                        maintainAspectRatio: false,
                    },
                });
                console.log('Chart reinitialized');
            } else {
                console.error('Unable to get 2D context for canvas');
            }
        } else {
            console.error('Canvas not found');
        }
    }, 0); // Allow DOM to update before accessing canvas
}





 @track advisorTableVisible=false;
  openAdviTable(){
    this.advisorTableVisible=true;
    this.openActivity=false;
    this.insuranceDetailsVisible=false;
    this.loanDetailsVisible=false;
    this.advisorDetailsVisible=false;
  }

   @track advisors = [];
  @track error;

  loadAdvisors() {
    getAllAdvi({ newAccountId: this.selectedAccount.Id })
      .then((result) => {
        this.advisorss = result;
        this.error = undefined;
        //  this.advisorTableVisible=true;
        //   this.advisorDetailsVisible=true;
      })
      .catch((error) => {
        this.error = error;
        this.advisors = [];
      });
  }

 handleAssign(event) {
    const advisorId = event.target.dataset.id; // Get the advisor ID from data-id
    const accountId = this.selectedAccount.Id; // Get the currently selected account ID

    if (!advisorId || !accountId) {
        this.showToast('Error', 'Advisor or Account information is missing.', 'error');
        return;
    }

    // Call the Apex method to assign the advisor
    assignAdvisorToAccount({ advisorId, newAccountId: accountId })
        .then(() => {
            this.showToast('Success', 'Advisor successfully assigned!', 'success');

              //this.advisors = this.advisors.filter(advisor => advisor.id !== advisorId);
            this.loadAdvisors();
        })
        .catch((error) => {
            console.error('Error assigning advisor:', error);
            this.showToast('Error', 'Failed to assign advisor. Please try again.', 'error');
        });
}

// Helper method to show a toast message
showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title,
        message,
        variant,
    });
    this.dispatchEvent(event);
}

 assetDetails = {
    assetName: '',
    purchaseDate: ''
};

handleInputChange(event) {
    const fieldName = event.target.name; // Get the name of the field
    const fieldValue = event.target.value; // Get the value of the field
    this.assetDetails = { ...this.assetDetails, [fieldName]: fieldValue }; // Update the corresponding field
}

handleSaveAsset(event) {
    event.preventDefault();

    // Validate form input to ensure Asset Name is provided
    if (!this.assetDetails.assetName) {
        alert('Asset Name is required.');
        return;
    }

    // Prepare data to save the asset
    const assetToSave = {
        Asset_Name__c: this.assetDetails.assetName, // Required field
        Purchase_Date__c: this.assetDetails.purchaseDate,
        Account__c: this.selectedAccount.Id // Ensure Account ID is passed here
    };

    // Call Apex to save the asset
    saveAsset({ asset: assetToSave })
        .then(() => {
            alert('Asset saved successfully!');
            this.resetForm();
            this.fetchAssets();
        })
        .catch((error) => {
            console.error('Error saving asset:', error);
            alert('Failed to save asset. ' + error.body.message);
        });
}

resetForm() {
    this.assetDetails = { assetName: '', purchaseDate: '' }; // Reset form details
}



    @track openAssetsss=false;
    handleOpenAssets(){
        this.openAssetsss=true;
         this.openActivity=false;
    this.insuranceDetailsVisible=false;
    this.loanDetailsVisible=false;
    this.advisorDetailsVisible=false;
    this.assetsDetailsVisible=false;
    }



}