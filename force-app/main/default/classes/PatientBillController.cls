public with sharing class PatientBillController {
    public Id patientId { get; set; }
    public List<Appointment__c> todayAppointments { get; set; }
    public List<BillingWrapper> todayInvoices { get; set; }
    public Boolean hasRecords { get; set; }
    public Boolean hasAppointments { get; set; }
    public String doctorName { get; set; }
     public String username { get; set; }

    public PatientBillController() {
        patientId = ApexPages.currentPage().getParameters().get('patientId');
         List<String> savedRecordIds = new List<String>(ApexPages.currentPage().getParameters().get('savedRecordIds').split(','));
        
        // Initialize todayInvoices list with wrapper class
        todayInvoices = new List<BillingWrapper>();

        // Fetch billing records from the database
        List<Billing__c> invoices = [SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, Discount__c, 
                                     Patient_Registration__r.Age__c, Patient_Registration__r.phone_number__c,
                                     Quantity__c, Grand_Total__c, Total__c, Rate__c, Products__r.Name, CreatedDate,
                                     CreatedBy.Name, Patient_Registration__r.patientID__c
                              FROM Billing__c
                              WHERE Patient_Registration__c = :patientId
                              AND CreatedDate = TODAY  AND Id IN :savedRecordIds];

        Integer serialNumber = 1;
        for (Billing__c invoice : invoices) {
            // Add each invoice to the wrapper list with a serial number
            todayInvoices.add(new BillingWrapper(invoice, serialNumber));
            serialNumber++;
        }
        hasRecords = !Invoices.isEmpty();
        
        // If there are records, get the doctor's name from the first record's creator
        if (hasRecords) {
            username = Invoices[0].CreatedBy.Name;
        } else {
            username = '';
        }

        todayAppointments = [SELECT Id, Patient__r.Name, Start_Time__c, End_Time__c, Date__c, Status__c, Dr__r.Name
                             FROM Appointment__c
                             WHERE Patient__c = :patientId
                             AND Date__c = TODAY];

        hasAppointments = !todayAppointments.isEmpty();
        
        // If there are appointments, get the doctor's name from the first appointment record
        if (hasAppointments) {
            //username = todayInvoices[0].CreatedBy.Name;
            doctorName = todayAppointments[0].Dr__r.Name; // Assuming the doctor is referenced in the Dr__r field
        } else {
            doctorName = '';
        }
    }

    public String getFormattedCreatedDate() {
        if (todayInvoices != null && !todayInvoices.isEmpty()) {
            DateTime createdDate = todayInvoices[0].billing.CreatedDate;
            return createdDate.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
        }
        return 'Date not available';
    }
    public String getFormattedGrandTotal() {
    if (todayInvoices != null && !todayInvoices.isEmpty() && todayInvoices[0].billing.Grand_Total__c != null) {
         return String.valueOf(todayInvoices[0].billing.Grand_Total__c.setScale(2, RoundingMode.HALF_UP));
    }
    return '0.00';
}

    // Wrapper class to hold Billing__c data and serial number
    public class BillingWrapper {
        public Billing__c billing { get; set; }
        public Integer serialNumber { get; set; }

        public BillingWrapper(Billing__c billing, Integer serialNumber) {
            this.billing = billing;
            this.serialNumber = serialNumber;
        }
    }
    
     
}