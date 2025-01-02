import { LightningElement, track,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getMedicineList from '@salesforce/apex/PharmacistDashboard.getMedicineList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getMedicineDetails from '@salesforce/apex/PharmacistDashboard.getMedicineDetails';
import saveBillingRecords from '@salesforce/apex/PharmacistDashboard.saveBillingRecords';
//import getMedicines from '@salesforce/apex/PrescriptionController.getMedicines';
//import getMedicineDetails from '@salesforce/apex/PrescriptionController.getMedicineDetails';
//import saveBillingRecords from '@salesforce/apex/PrescriptionController.saveBillingRecords';
import getTodaysPrescriptionsByPatient from '@salesforce/apex/PharmacistDashboard.getTodaysPrescriptionsByPatient';
import getRegisteredPatients from'@salesforce/apex/PharmacistDashboard.getRegisteredPatients';
import getCounts from '@salesforce/apex/PharmacistDashboard.getCounts';
import saveMedicine from '@salesforce/apex/PharmacistDashboard.saveMedicine';
import getManufacturers from '@salesforce/apex/PharmacistDashboard.getManufacturers';
import getMedicines from '@salesforce/apex/PharmacistDashboard.getMedicines';
import getManufacturer from '@salesforce/apex/PharmacistDashboard.getManufacturer';
import addManufacturer from '@salesforce/apex/PharmacistDashboard.addManufacturer';
import sunIcon from '@salesforce/resourceUrl/sunIcon';
import moonIcon from '@salesforce/resourceUrl/moonIcon';
import sunsetIcon from '@salesforce/resourceUrl/sunsetIcon';
import getExpenseIncomeData from '@salesforce/apex/ExpenseIncomeController.getExpenseIncomeData';
import { loadScript } from 'lightning/platformResourceLoader';
import GRAPH_CHART from '@salesforce/resourceUrl/graphChart';
import getMedicineTypeCounts from '@salesforce/apex/MedicineDataController.getMedicineTypeCounts';
import getMonthlySales from '@salesforce/apex/MonthlySales.getMonthlySales';
import receptionRightSiteBar from '@salesforce/resourceUrl/receptionRightSiteBar';
import receptionProfile from '@salesforce/resourceUrl/receptionProfile';
import receptionClinic from '@salesforce/resourceUrl/receptionClinic';
import pharmacy from '@salesforce/resourceUrl/pharmacy';
import MobileView from './pharmacistMobile.html';
import DesktopView from './pharmacistDashboard.html';
import getSalesData from '@salesforce/apex/SalesDataController.getSalesData';
import getTopSellingMedicines from "@salesforce/apex/TopSellingMedicinesController.getTopSellingMedicines";
import medicine from '@salesforce/resourceUrl/medicine';
import generateAndAttachPDF from '@salesforce/apex/PharmacistDashboard.generateAndAttachPDF';
import generateAndAttachPDFF from '@salesforce/apex/PharmacistDashboard.generateAndAttachPDFF';
// import MonthlySalesDashboard from 'c/monthlySalesDashboard/monthlySalesDashboard';


const COLUMNS = [
    { label: 'Medicine Name', fieldName: 'Name', type: 'text' },
    { label: 'Generic Name', fieldName: 'Generic_Name__c', type: 'text' },
    { label: 'Medicine Type', fieldName: 'Medicine_Type__c', type: 'text' },
    { label: 'Batch Number', fieldName: 'Batch_Number__c', type: 'text' },
    { label: 'Expiry Date', fieldName: 'Expiry_Date__c', type: 'date' },
    { label: 'Manufacturer', fieldName: 'ManufacturerName', type: 'text' },
    { label: 'Selling Price', fieldName: 'Selling_Price__c', type: 'currency' },
    { label: 'Manufacturer Price', fieldName: 'Manufacturer_Price__c', type: 'currency' },
    { label: 'Stock', fieldName: 'Stock__c', type: 'number' },
    { label: 'Unit', fieldName: 'Unit__c', type: 'text' }
];

export default class PharmacistDashboard extends NavigationMixin(LightningElement){

    render() {
    const isLarge = window.innerWidth > 1024; 
    return isLarge ? DesktopView : MobileView;
//    return MobileView;
}

    @track medicines = [];
    @track columns = COLUMNS;
    @track error;
    @track searchKey = '';
    @track isModalOpen1 = false;
    @track openDashboard=true;
     receptionImageUrl = receptionRightSiteBar;
      receptionProfile=receptionProfile;
      receptionClinic=receptionClinic;
      pharmacy=pharmacy;
    
    @track selectedView = 'dashboard'; // Default selected view
   @track homepage = true;
   @track hospital = true;
   @track patientName1;
   @track ReferredBy1=[];
   @track nextVisits = [];
   @track patientGender=[];
   @track patientAge=[];
 
   
     @track selectedView = 'dashboard';

    handleNavigationChange(event) {
        // Get the view name from the data-view attribute
        this.selectedView = event.currentTarget.getAttribute('data-view');
        console.log("Current selected view:", this.selectedView);
    }

    // Computed properties to determine which view is active
    get isDashboard() {
        return this.selectedView === 'dashboard';
    }
      get welcomeMessage() {
        return this.isDoctor ? `Welcome, ${this.userName}` : 'Welcome, guest';
    }

    get isPrescription() {
        return this.selectedView === 'prescription';
    }

    get isMedicine() {
        return this.selectedView === 'medicine';
    }

    get ismanufacturer() {
        console.log(this.selectedView);  // Log the value of selectedView
        return this.selectedView === 'purchase';
    }
    

    get isSales() {
        return this.selectedView === 'sales';
    }
    handleNavigationChange(event) {
        this.selectedView = event.target.value;
    }
        

    // Helper method to get the CSS class for each label based on selected view
    getLabelClass(viewName) {
        return this.selectedView === viewName
            ? 'slds-nav-vertical__action custom-selected'
            : 'slds-nav-vertical__action';
    }

    
    columns1 = [
        {
            label: 'Name',
            fieldName: 'Name',
            type: 'button',
            typeAttributes: {
                label: { fieldName: 'Name' },
                name: 'viewProfile',
                variant: 'base'
            }
        },
        { label: 'Age', fieldName: 'Age__c' },
        { label: 'Mobile Number', fieldName: 'phone_number__c' },
        { label: 'Gender', fieldName: 'Gender__c' },
        {
            label: 'View Prescription',
            type: 'button',
            typeAttributes: {
                label: 'View Prescription',
                name: 'View Prescription',
                variant: 'brand',
                title: 'View Prescription',
                disabled: false,
                value: 'View Prescriptionte',
                iconPosition: 'left'
            }
        }
       /* {
            label: 'Edit Patient',
            type: 'button',
            typeAttributes: {
                label: 'Edit',
                name: 'Edit',
                variant: 'brand',
                title: 'Edit',
                disabled: false,
                value: 'Edit',
                iconPosition: 'left'
            }
        }*/
    ];
    
    
@track filteredPatients = [];
@wire(getRegisteredPatients)
wiredPatients(result) {
    this.wiredPatientsResult = result; // Store the entire result object for refreshApex
    if (result.data) {
        this.patients = result.data;
        this.filteredPatients = [...this.patients];
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error;
        this.patients = undefined;
    }
}

@track searchQuery = '';

 // Handler for search input
 handleSearchChange(event) {
    this.searchQuery = event.target.value.toLowerCase(); // Store search query in lowercase
    console.log('this.searchQuery>>>'+this.searchQuery);
//this.search=true;
    // Filter patients based on search query for multiple fields like Name, Email, Mobile Number
    if (this.searchQuery) {
        this.filteredPatients = this.patients.filter(patient => {
            this.patientName1 =patient.Name
          //  console.log('patientName1::'+ patientName1);
            console.log('patientName::'+patient.Name);
            console.log('patientEmail::'+patient.Email__c);
            console.log('patientMobile::'+patient.phone_number__c);
               if( patient.Name.toLowerCase().includes(this.searchQuery) || 
                patient.Email__c.toLowerCase().includes(this.searchQuery)||
                patient.phone_number__c.includes(this.searchQuery)){
                    console.log('Inside if>>>');
            return patient; // Numbers don't need to be converted to lowercase

                }
               /* else{
                    console.log('Inside else>>>');
                    this.filteredPatients=[];
                }*/
        });
    } else {
        this.filteredPatients = [...this.patients]; // Reset if no search query
    }
}

@track patientId; // Patient ID passed as a parameter
prescriptions;
@track nocontents =false;
error;

/*@wire(getTodaysPrescriptionsByPatient, { patientId: '$patientId' })
    wiredPrescriptions({ data, error }) {
        if (data) {
            // Add serial numbers to each prescription
            this.prescriptions = data.map((prescription, index) => {
                return { ...prescription, serialNumber: index + 1 };
            });
            this.patientNames = data.map(prescription => prescription.Patient_Registration__r.Name);
            this.nextVisits = data.map(prescription => prescription.Next_Visit__c);
            this.ReferredBy1 = data.map(prescription => prescription.Referred_By__r.Name);
            console.log('Selected Patient Id:', this.ReferredBy1);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.prescriptions = [];
        }
    }*/
        /*@wire(getTodaysPrescriptionsByPatient, { patientId: '$patientId' })
        wiredPrescriptions({ data, error }) {
            if (data) {
                // Add serial numbers to each prescription
                this.prescriptions = data.map((prescription, index) => {
                    return { ...prescription, serialNumber: index + 1 };
                });
                this.patientNames = data.map(prescription => prescription.Patient_Registration__r.Name);
                this.nextVisits = data.map(prescription => prescription.Next_Visit__c);
                //this.nextVisits = data.length > 0 ? data[0].prescription.Next_Visit__c : null;
                // Store only the first record's Referred_By__r.Name in this.ReferredBy1
                this.ReferredBy1 = data.length > 0 ? data[0].Referred_By__r.Name : null;
        
                console.log('Selected Patient Id:', this.ReferredBy1);
                this.error = undefined;
            } else if (error) {
                this.error = error;
                this.prescriptions = [];
            }
        }*/
        contents = false;
           @wire(getTodaysPrescriptionsByPatient, { patientId: '$patientId' })
wiredPrescriptions({ data, error }) {
    if (data) {

        // Add serial numbers to each prescription
        this.prescriptions = data.map((prescription, index) => {
            return { ...prescription, serialNumber: index + 1 };
        });
       this.contents = true;
       this.nocontents = false;
        // Set patient information from the first prescription (if exists)
        this.patientNames = data.length > 0 ? data[0].Patient_Registration__r.Name : null;
        this.patientAge = data.length > 0 ? data[0].Patient_Registration__r.Age__c : null;
        this.patientGender = data.length > 0 ? data[0].Patient_Registration__r.Gender__c : null;

        // Set next visit and referred by information from the first prescription
        //this.nextVisits = data.length > 0 ? data[0].Next_Visit__c : null;
        //this.ReferredBy1 = data.length > 0 ? data[0].Referred_By__r.Name : null;

        // Set nocontents to false because we have data
        //this.nocontents = data.length === 0;
        
        // Clear any previous error
        this.error = undefined;

        console.log('Prescription data:', data);
    } else if (error) {
        // Log and handle the error
        console.error('Error fetching prescription data:', error);
        this.error = error;
        this.prescriptions = [];
        this.nocontents = true;
        this.contents = false;  // Set nocontents to true if there is an error
    } else if (data === null) {
        // If data is explicitly null, set nocontents to true
        this.nocontents = true;
        this.contents = false;
        this.prescriptions = [];
    }
}

       
 @track patientId;  // Use track if patientId is bound to the UI

    handleRowAction1(event) {
        const patientId = event.target.dataset.id; // Use event.target to access the data-id
        if (patientId) {
            this.patientId = patientId;
            this.isModalOpen1 = true;
            this.homepage = false;
            this.openDashboard = false;

            console.log('Selected Patient Id:', this.patientId);
        } else {
            console.error('No patientId found on the button element');
        }
    }
openModal(){
    this.homepage=true;
    this.isModalOpen1 = false;
    this.openDashboard=true;
}
openModalss(){
        this.homepage=true;
    this.isModalOpen1 = false;
    this.openDashboard=true;
}
get referredByFirst() {
    // Check if the array has elements to avoid errors
    return this.referredBy1.length > 0 ? this.referredBy1[0] : '';
}

@track products = [
    {
        id: Date.now(),  // unique identifier for the initial row
        selectedProductId: null,
        availableQuantity: '',
        batchNo: '',
        expiryDate: '',
        discount: '',
        rate: '',
        quantity: '',
        total: ''
    }
];
@track productOptions = [];
@track totalTax = 0;
@track discountOnBill = 0;
@track discount = 0;

// Fetch the list of products (medicines) from Salesforce and populate productOptions
@wire(getMedicineList)
wiredMedicines1({ error, data }) {
    if (data) {
        this.productOptions = data.map(medicine => ({
            label: medicine.Name,
            value: medicine.Id
            
        }));
    } else if (error) {
        console.error('Error fetching medicine list:', error);
    }
}
@track value = true;
// Add a new empty product row
addNewItem() {
    this.products = [
        ...this.products,
        {
            id: Date.now(),
            selectedProductId: '',
            availableQuantity: '',
            batchNo: '',

            expiryDate: '',
            quantity: 0,
            rate: 0,
            discount: 0,
            total: 0
        }
    ];
}

// Handle product selection change
handleProductChange(event) {
    const productId = event.detail.value;
    const rowId = event.target.dataset.id;
    console.log('id',productId);
    console.log('rowId',rowId);
    getMedicineDetails({ medicineId: productId })
        .then(result => {
            console.log('id',result);
           
            this.products = this.products.map(product => {
                console.log('product.id',product.id);
                if (product.id == rowId) {
                    console.log('id',result.Stock__c);
                    console.log('id',result.Batch_Number__c);
                    console.log('id',result.Expiry_Date__c);
                    return {
                        ...product,
                        selectedProductId: productId,
                        availableQuantity: result.Stock__c,
                        batchNo: result.Batch_Number__c,
                          rate :result.Selling_Price__c,
                        expiryDate: result.Expiry_Date__c
                    };

                }
                console.log('id',product);
                return product;
                
            });
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

// Handle changes to quantity, rate, or discount, and update total
/*handleQuantityChange(event) {
    this.updateProductField(event.target.dataset.id, 'quantity', event.detail.value);
}*/

/*handleQuantityChange(event) {
    const quantity1 = event.detail.value;
    const rowId = event.target.dataset.id;
    //const ghsy = event.target.value;
    console.log('quantity1',quantity1);
    console.log('rowId',rowId);
    console.log('ghsy',ghsy);
   // console.log('product.id',product.id);
//console.log('quantity',quantity1);
    // Find the product in the products array and update its quantity
    const productIndex = this.products.findIndex(product => product.id == productId);
    //console.log('product.id',product.id);
    console.log('productIndex',productIndex);
    if (productIndex !== -1) {
        this.products[productIndex].quantity = quantity1;
        console.log('quantity', this.products[productIndex].quantity);
    }
}*/
/*handleQuantityChange(event) {
    // Retrieve the ID from the data attribute
    const productId = event.target.dataset.id;
    console.log('productId:', productId);

    // Find the index of the product and update its quantity
    const productIndex = this.products.findIndex(product => product.id === parseInt(productId, 10));
    if (productIndex !== -1) {
        this.products[productIndex].quantity = Number(event.target.value); // Store the updated quantity
        
        // Log the updated quantity for the specific product
        console.log('Updated Quantity for product ID', productId, ':', this.products[productIndex].quantity);
    }

    // Optionally, log the entire products array to see all updated quantities
    console.log('Updated Products:', this.products);
}*/

handleQuantityChange(event) {
    // Retrieve the ID from the data attribute
    const productId = event.target.dataset.id;
    const quantity = Number(event.target.value);

    // Find the index of the product and update its quantity and total
    const productIndex = this.products.findIndex(product => product.id === parseInt(productId, 10));
    if (productIndex !== -1) {
        this.products[productIndex].quantity = quantity;

        // Calculate total
        const { rate, discount } = this.products[productIndex];
        this.products[productIndex].total = (quantity * rate) * (1 - discount / 100);

        console.log('Updated Quantity:', quantity);
        console.log('Updated Total for product ID', productId, ':', this.products[productIndex].total);
    }

    console.log('Updated Products:', this.products);
}

handleRateChange(event) {
    const productId = event.target.dataset.id;
    const rate = Number(event.target.value);

    const productIndex = this.products.findIndex(product => product.id === parseInt(productId, 10));
    if (productIndex !== -1) {
        this.products[productIndex].rate = rate;

        // Calculate total
        const { quantity, discount } = this.products[productIndex];
        this.products[productIndex].total = (quantity * rate) * (1 - discount / 100);

        console.log('Updated Rate:', rate);
        console.log('Updated Total for product ID', productId, ':', this.products[productIndex].total);
    }

    console.log('Updated Products:', this.products);
}

handleDiscountChange(event) {
    const productId = event.target.dataset.id;
    const discount = Number(event.target.value);

    const productIndex = this.products.findIndex(product => product.id === parseInt(productId, 10));
    if (productIndex !== -1) {
        this.products[productIndex].discount = discount;

        // Calculate total
        const { quantity, rate } = this.products[productIndex];
        this.products[productIndex].total = (quantity * rate) * (1 - discount / 100);

        console.log('Updated Discount:', discount);
        console.log('Updated Total for product ID', productId, ':', this.products[productIndex].total);
    }

    console.log('Updated Products:', this.products);
}


/*updateProductField(rowId, field, value) {
    this.products = this.products.map(product => {
        if (product.id === rowId) {
            product[field] = value;
            product.total = this.calculateTotal(product);
        }
        return product;
    });
}*/

/*calculateTotal(product) {
    const subtotal = product.quantity * product.rate;
    const discountAmount = (subtotal * product.discount) / 100;
    return subtotal - discountAmount;
}*/



/*saveBillingRecords() {
    const records = this.products.map(product => ({
        Products__c: product.selectedProductId,
        Quantity__c: product.quantity,
        Patient_Registration__c: this.patientId,
        Rate__c: product.rate,
        Discount__c: product.discount,
        Expiry__c:product.expiryDate,
        Batch_No__c:product.batchNo,
        Total__c: product.total
    }));
    console.log('results',records);
    saveBillingRecords({ billingRecords: records })
        .then(() => {
            this.showToast('Success', 'Records saved successfully', 'success');
        })
        .catch(error => {
            this.showToast('Error', 'Error saving records: ' + error.body.message, 'error');
        });
}*/
get grandTotal() {
    return this.products
        .filter(product => product.selectedProductId && product.quantity) // Only include valid products
        .reduce((sum, product) => sum + (product.total || 0), 0); // Sum up all totals
}

@track savedRecordIds; // Array to store saved record IDs

    saveBillingRecords() {
        console.log('hello');        // Check if there are any products in the list
        if (this.products.length === 0) {
            this.showToast('Error', 'Please add at least one product before saving.', 'error');
            return;
        }

        // Filter out products with null or empty selectedProductId (product) or quantity
        const records = this.products
            .filter(product => product.selectedProductId && product.quantity) // Only include products with valid product and quantity
            .map(product => ({
                Products__c: product.selectedProductId,
                Quantity__c: product.quantity,
                Patient_Registration__c: this.patientId,
                Rate__c: product.rate,
                Discount__c: product.discount,
                Expiry__c: product.expiryDate,
                Batch_No__c: product.batchNo,
                Total__c: product.total,
                Grand_Total__c: this.grandTotal
            }));

        // Check if there are valid records to save
        if (records.length === 0) {
            this.showToast('Error', 'Please ensure all products and quantities are filled before saving.', 'error');
            return;
        }

        // Call Apex to save the records and retrieve IDs
        saveBillingRecords({ billingRecords: records })
            .then((recordIds) => {
                this.savedRecordIds = recordIds; // Store the IDs in the savedRecordIds array
                console.log('Saved Record IDs:', JSON.stringify(this.savedRecordIds));
 
                this.showToast('Success', 'Records saved successfully', 'success');
                console.log('Saved Record IDs:', JSON.stringify(this.savedRecordIds)) // Log the saved record IDs for verification
            })
            .catch(error => {
                this.showToast('Error', 'Error saving records: ' + error.body, 'error');
            });
    }


// Show a toast message
showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    this.dispatchEvent(event);
}

handleDelete(event) {
    const productId = event.target.dataset.id;
    console.log('Delete product with ID:', productId);

    // Remove the product from the products array
    this.products = this.products.filter(product => product.id !== parseInt(productId, 10));
    
    console.log('Updated Products after deletion:', this.products);
}
@track todayDate;

connectedCallback() {
    this.setTodayDate();
}

setTodayDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    this.todayDate = date.toLocaleDateString(undefined, options); // Formats date like "November 8, 2024"
}
@track totalMedicines = 0;
@track totalManufacturers = 0;
@track totalInvoices = 0;
@track totalSales = 0; // New property for Total Sale

@wire(getCounts)
wiredCounts({ error, data }) {
    if (data) {
        this.totalMedicines = data.TotalMedicines;
        this.totalManufacturers = data.TotalManufacturers;
        this.totalInvoices = data.TotalInvoices;
        this.totalSales = data.TotalSales; // Set Total Sale value
    } else if (error) {
        console.error('Error retrieving counts', error);
    }
}
openModal(){
    this.homepage=true;
    this.isModalOpen1 = false;
    this.openDashboard=true;
}
get referredByFirst() {
    // Check if the array has elements to avoid errors
    return this.referredBy1.length > 0 ? this.referredBy1[0] : '';
}

@track openMedical=false;
@track opendiv=true;
handleImportClick() {
   // Set openMedical to true and all other views to false
   // this.isDashboard = false;
   // this.isPrescription = false;
   // this.isMedicine = false;
   // this.isPurchase = false;
   // this.isSales = false;
   this.opendiv=false;
   this.openMedical = true;
   this.homepage=false;
   this.isModalOpen1=false;
   this.openDashboard=false;
}


// Track form fields to bind data to the Apex controller
@track medicineRecord = {
   Name: '',
   Generic_Name__c: '',
   Medicine_Type__c: '',
   Expiry_Date__c: null,
   Manufacturer__c: '',
   Unit__c: '',
   Selling_Price__c: 0,
   Manufacturer_Price__c: 0,
   Stock__c: 0
};

// Medicine Type options
medicineTypeOptions = [
   { label: 'Tablet', value: 'Tablet' },
   { label: 'Capsule', value: 'Capsule' },
   { label: 'Syrup', value: 'Syrup' },
   { label: 'Sachets', value: 'Sachets' },
   { label: 'Injections', value: 'Injections' },
   { label: 'Inhaler', value: 'Inhaler' }
];

// Unit options
unitOptions = [
   { label: '5 mg', value: '5 mg' },
   { label: '10 mg', value: '10 mg' },
   { label: '20 mg', value: '20 mg' },
   { label: '40 mg', value: '40 mg' },
   { label: '50 mg', value: '50 mg' },
   { label: '25 mcg', value: '25 mcg' },
   { label: '50 mcg', value: '50 mcg' },
   { label: '100 mcg', value: '100 mcg' },
   { label: '400 mg', value: '400 mg' },
   { label: '500 mg', value: '500 mg' },
   { label: '650 mg', value: '650 mg' },
   { label: '5 mg/mL', value: '5 mg/mL' },
   { label: '10 mg/mL', value: '10 mg/mL' },
   { label: '100 mg/mL', value: '100 mg/mL' },
   { label: '125 mg/5 mL', value: '125 mg/5 mL' },
   { label: '250 mg/5 mL', value: '250 mg/5 mL' },
   { label: '40 IU/mL', value: '40 IU/mL' },
   { label: 'N/A', value: 'N/A' }
];

// Manufacturer options (to be populated dynamically)
@track manufacturerOptions = [];

// Wire method to fetch manufacturers dynamically
/*@wire(getManufacturers)
wiredManufacturers({ error, data }) {
    console.log('Fetched manufacturer data:', data);
    if (data) {
        console.log('Fetched manufacturer data:', data);
        this.manufacturerOptions = data.map(manufacturer => {
            return { label: manufacturer.Name, value: manufacturer.Id };
        });
        console.log('manufacturerOptions:', this.manufacturerOptions);
    } else if (error) {
        const errorMessage = error?.body?.message || 'Unknown error occurred';
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading manufacturers',
                message: errorMessage,
                variant: 'error',
            })
        );
    }
}*/
@wire(getManufacturers)
wiredManufacturers({ error, data }) {
    console.log('Fetched manufacturer data:', data);
    if (data) {
        console.log('Fetched manufacturer data:', data);
        this.manufacturerOptions = data.map(manufacturer => {
            return { label: manufacturer.Name, value: manufacturer.Id };
        });
        console.log('manufacturerOptions:', this.manufacturerOptions);
    } else if (error) {
        const errorMessage = error?.body?.message || 'Unknown error occurred';
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading manufacturers',
                message: errorMessage,
                variant: 'error',
            })
        );
    }
}


handleChange(event) {
   // Update the medicineRecord object when a field is modified
   const field = event.target.name;
   this.medicineRecord[field] = event.target.value;
}

/*handleSave1() {
    saveMedicine({ medicine: this.medicineRecord })
    .then(result => {
        // Show success message
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Medicine record created successfully!',
                variant: 'success',
            })
        );
        
        // Reset the form
        this.resetForm();
        
        // Update selectedView instead of setting isMedicine directly
        this.selectedView = 'medicine';
    })
    .catch(error => {
        // Handle errors
        const errorMessage = error?.body?.message || error.message || 'Unknown error occurred';
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: errorMessage,
                variant: 'error',
            })
        );
    });
}*/
handleSave1() {
    // Define required fields with display names
    const fieldLabels = {
        Name: 'Medicine Name',
        Generic_Name__c: 'Generic Name',
        Medicine_Type__c: 'Medicine Type',
        Manufacturer_Price__c: 'Manufacturer Price',
        Manufacturer__c: 'Manufacturer',
        Unit__c: 'Unit',
        Selling_Price__c: 'Selling Price'
    };

    // Check if all required fields are populated
    const missingFields = Object.keys(fieldLabels).filter(field => !this.medicineRecord[field]);

    if (missingFields.length > 0) {
        // Generate custom error message for missing fields
        const missingFieldLabels = missingFields.map(field => fieldLabels[field]);
        
        // Show error message with custom labels
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: `Please fill in all required fields`,
                variant: 'error',
            })
        );
        return; // Stop execution if fields are missing
    }

    // Proceed with saving if all fields are populated
    saveMedicine({ medicine: this.medicineRecord })
        .then(result => {
            // Show success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Medicine record created successfully!',
                    variant: 'success',
                })
            );
            
            // Reset the form
            this.resetForm();
            
            // Update selectedView instead of setting isMedicine directly
            this.selectedView = 'medicine';
        })
        .catch(error => {
            // Handle errors
            const errorMessage = error?.body?.message || error.message || 'Unknown error occurred';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: errorMessage,
                    variant: 'error',
                })
            );
        });
}

handleback(){
   this.opendiv=true;
   this.isModalOpen1=false;
   this.openMedical=false;
   this.homepage=true;
   this.openDashboard=true;
}

resetForm() {
   // Reset form fields after successful save
   this.template.querySelectorAll('lightning-input').forEach(input => {
       input.value = null;
   });
}

    // Wire the Apex method and fetch data
    @wire(getMedicines, { searchKey: '$searchKey' })
    wiredMedicines({ error, data }) {
        if (data) {
            // Map the manufacturer name from the lookup relationship
            this.medicines = data.map(medicine => ({
                ...medicine,
                ManufacturerName: medicine.Manufacturer__r ? medicine.Manufacturer__r.Name : ''
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.medicines = [];
        }
    }
     // Handle search input change
     handleSearch(event) {
        this.searchKey = event.target.value;
    }
    
    
    @track searchKey = '';
    @track manufacturers = [];
    @track showModal = false;
    @track newManufacturerName = '';

    @wire(getManufacturer, { searchKey: '$searchKey' })
    wiredManufacturerss({ error, data }) {
        if (data) {
            this.manufacturers = data;
        } else if (error) {
            this.showToast('Error', 'Failed to fetch manufacturers', 'error');
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    // Renamed openModal to showAddManufacturerModal
    showAddManufacturerModal() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.newManufacturerName = '';
    }

    handleNameChange(event) {
        this.newManufacturerName = event.target.value;
    }

    addManufacturer() {
        if (this.newManufacturerName) {
            addManufacturer({ name: this.newManufacturerName })
                .then(() => {
                    this.showToast('Success', 'Manufacturer added successfully', 'success');
                    this.closeModal();
                    return refreshApex(this.manufacturers); // Refresh the manufacturer list
                })
            .catch(error => {
           //this.showToast('Error', 'Failed to add manufacturer', 'error');
                });
        } else {
            this.showToast('Error', 'Please enter a manufacturer name', 'error');
        }
    }

   /* showToast(title, message, variant) {
        const evt = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(evt);
    }*/
    // Method to open the Visualforce page for printing
/*Printprescription() {
    console.log('patient id', this.patientId);
    const vfPageUrl = `/apex/PrintPrescription?patientId=${this.patientId}`;
    window.open(vfPageUrl, '_blank');
}*/
Printprescription() {
    console.log('patient id', this.patientId);
    const vfPageUrl = `/apex/PrintPrescription?patientId=${this.patientId}`;
    window.open(vfPageUrl, '_blank');
    
     /*if (!this.patientId) {
            this.showToast('Error', 'Patient ID is missing.', 'error');
            return;
        }

        console.log('Generating PDF for patient ID:', this.patientId);

        // Call Apex method
        generateAndAttachPDF({ patientId: this.patientId })
            .then((result) => {
                console.log(result); // Log success message
                this.showToast('Success', result, 'success');
            })
            .catch((error) => {
                console.error(error); // Log error details
                this.showToast('Error', error.body.message, 'error');
            });*/
             if (!this.patientId) {
            this.showToast('Error', 'Patient ID is missing.', 'error');
            return;
            }

        console.log('Generating PDF for patient ID:', this.patientId);

        // Call Apex method
        generateAndAttachPDF({ patientId: this.patientId })
            .then((result) => {
                console.log(result); // Log success message
                this.showToast('Success', result, 'success');
            })
            .catch((error) => {
                console.error(error); // Log error details
                this.showToast('Error', error.body.message, 'error');
            });
    }
  
   showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }  
   
/*PrintInvoice(){
    console.log('patient id', this.patientId);
    const vfPageUrl = `/apex/printinvoice?patientId=${this.patientId}&savedRecordIds=${this.savedRecordIds.join(',')}`;

    window.open(vfPageUrl, '_blank');
    if (!this.patientId) {
        this.showToast('Error', 'Patient ID is missing.', 'error');
        return;
        }

    console.log('Generating PDF for patient ID:', this.patientId);

    // Call Apex method
    generateAndAttachPDFF({ patientId: this.patientId })
        .then((result) => {
            console.log(result); // Log success message
            this.showToast('Success', result, 'success');
        })
        .catch((error) => {
            console.error(error); // Log error details
            this.showToast('Error', error.body.message, 'error');
        });
}

showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(event);
}*/
PrintInvoice() {
    if (!this.patientId) {
        this.showToast('Error', 'Patient ID is missing.', 'error');
        return;
    }

    if (!this.savedRecordIds || this.savedRecordIds.length === 0) {
        this.showToast('Error', 'No saved record IDs provided.', 'error');
        return;
    }

    // Convert savedRecordIds array to a comma-separated string
    const savedRecordIdsString = this.savedRecordIds.join(',');

    console.log('Patient ID:', this.patientId);
    console.log('Saved Record IDs as String:', savedRecordIdsString);

    // Open VF Page for preview
    const vfPageUrl = `/apex/printinvoice?patientId=${this.patientId}&savedRecordIds=${savedRecordIdsString}`;
    window.open(vfPageUrl, '_blank');

    // Call Apex method to generate and attach PDF
    generateAndAttachPDFF({
        patientId: this.patientId,
        savedRecordIds: savedRecordIdsString
    })
        .then((result) => {
            console.log('Apex Success:', result);
            this.showToast('Success', result, 'success');
        })
        .catch((error) => {
            console.error('Apex Error:', error);
            this.showToast('Error', error.body.message, 'error');
        });
}






// Sunset Component

greetingMessage = 'Good Morning'; // Default message
  iconUrl = ''; // Default icon
  formattedDate = ''; // Placeholder for date
  formattedTime = ''; // Placeholder for time

  connectedCallback() {
    this.updateGreeting(); // Set initial greeting when component loads
    this.startClock(); // Start the clock to update time dynamically
  }

  updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    // Determine greeting and icon based on time
    if (hour >= 6 && hour < 12) {
      this.greetingMessage = 'Good Morning';
      this.iconUrl = sunIcon;
    } else if (hour >= 12 && hour < 16) {
      this.greetingMessage = 'Good Afternoon';
      this.iconUrl = sunsetIcon;
    } else {
      this.greetingMessage = 'Good Evening';
      this.iconUrl = moonIcon;
    }

    // Format date
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    this.formattedDate = now.toLocaleDateString('en-US', options);
  }

  startClock() {
    setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      this.formattedTime = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

// ******ExpenseIncomeChartJS*********

chart; // Holds the chart instance
    chartData = []; // Data for the chart
    isDataAvailable = false; // Tracks if data is available for rendering
    isChartJsInitialized = false; // Tracks if Chart.js is loaded
    wiredData; // Tracks the wired service for refreshing

    @wire(getExpenseIncomeData)
    wiredExpenseIncomeData(response) {
        this.wiredData = response; // Save response for refresh
        const { error, data } = response;

        if (data) {
            const totalExpense = data?.TotalExpense || 0;
            const totalIncome = data?.TotalIncome || 0;
            const totalEarnings = data?.TotalEarnings || 0;

            // Prepare data for the chart
            this.chartData = [
                { label: 'Total Expense', value: totalExpense },
                { label: 'Total Income', value: totalIncome },
                { label: 'Total Earnings', value: totalEarnings }
            ];
            this.isDataAvailable = true;
            this.initializeChart(); // Initialize Chart.js after data is loaded
        } else if (error) {
            console.error('Error fetching data:', error);
            // Retry fetching data after a delay
            setTimeout(() => {
                refreshApex(this.wiredData);
            }, 2000);
        }
    }

    renderedCallback() {
        // Ensure Chart.js is only loaded once
        if (this.isChartJsInitialized) {
            return;
        }

        // Append cache-busting query parameter to the static resource URL
        const graphChartUrl = `${GRAPH_CHART}?cacheBuster=${Date.now()}`;

        // Load the Chart.js library from Static Resource
        loadScript(this, graphChartUrl)
            .then(() => {
                this.isChartJsInitialized = true;
                this.initializeChart(); // Initialize the chart once Chart.js is loaded
            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart.js',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeChart() {
        // Ensure Chart.js and data are both loaded before rendering the chart
        if (!this.isChartJsInitialized || !this.isDataAvailable) {
            return;
        }

        // Destroy existing chart if present
        if (this.chart) {
            this.chart.destroy();
        }

        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            const canvas = this.template.querySelector('canvas');
            if (!canvas) {
                console.error('Canvas not found.');
                return;
            }

            this.chart = new Chart(canvas, {
                type: 'doughnut', // Donut chart type
                data: {
                    labels: this.chartData.map(item => item.label), // Extract labels
                    datasets: [
                        {
                            data: this.chartData.map(item => item.value), // Extract data values
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Chart colors
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' // Position the legend at the top
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    // Add currency symbol to tooltip values
                                    return `₹ ${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        });
    }

// ********MedicineDashboardJS**********
@track medicineData = []; // Only declare once

    @wire(getMedicineTypeCounts)
    wiredMedicineTypeCounts({ error, data }) {
        if (data) {
            // Define new maximum count for normalization
            const maxCount = 50; // Set to 50 as per your requirement
            const colors = [
                '#0070d2', '#54a0ff', '#10ac84', '#f368e0', '#ff9f43', '#5f27cd',
            ];

            // Prepare the data for the graph
            this.medicineData = Object.keys(data).map((key, index) => {
                const count = data[key];
                const height = Math.min(Math.round((count / maxCount) * 100), 100); // Height as percentage
                const color = colors[index % colors.length]; // Cycle through colors

                return {
                    label: key || 'Unknown', // Handle null labels
                    count: count,
                    height: height,
                    color: color,
                    style: `height: ${height}%; background-color: ${color};` // Add style property
                };
            });
        } else if (error) {
            console.error('Error fetching medicine data:', error);
        }
    }

// *********MonthlySalesDashboard*********
@track monthlyData = []; // Data for monthly sales

    @wire(getMonthlySales)
    wiredMonthlySales({ error, data }) {
        if (data) {
            console.log('Monthly Sales Data:', data); // Log the data received from Apex
            
            const colors = ['#0070d2', '#54a0ff', '#10ac84', '#f368e0', '#ff9f43', '#5f27cd'];

            this.monthlyData = Object.keys(data).map((key, index) => {
                const sales = data[key];

                // Normalize height based on maximum expected sales value
                const maxSales = 10000; // Adjust this value based on your actual maximum sales
                const height = Math.round((sales / maxSales) * 100); // Height as a percentage

                return {
                    label: key, // Month name from Apex
                    sales: sales,
                    style: `height: ${height}%; background-color: ${colors[index % colors.length]};`
                };
            });

            console.log('Processed Monthly Data:', this.monthlyData); // Log processed data
        } else if (error) {
            console.error('Error fetching monthly sales data:', error);
        }
    }


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

     medicines;
    error;
medicineurl=medicine;
    // Default image placeholder for medicines
    // defaultImage = "https://via.placeholder.com/100";

    // Wire the Apex method
    @wire(getTopSellingMedicines)
    wiredMedicines3({ data, error }) {
        if (data) {
            this.medicines1 = data;
            this.error = undefined;
        } else if (error) {
            this.medicines1 = undefined;
            this.error = error.body.message;
        }
    }
















}