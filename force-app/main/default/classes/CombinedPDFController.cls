public with sharing class CombinedPDFController {
    public String patientId { get; set; }
    public String savedRecordIds { get; set; }
    
    // Prescription Data
    public List<Prescription__c> todayPrescriptions { get; set; }
    public String prescriptionDoctorName { get; set; }
    public Boolean hasPrescriptions { get; set; }
    public String prescriptionFormattedDate { get; set; }
    public String nextVisitDate { get; set; }

    // Billing Data
    public List<PatientBillController.BillingWrapper> todayInvoices { get; set; }
    public String invoiceDoctorName { get; set; }
    public Boolean hasInvoices { get; set; }
    public String invoiceFormattedDate { get; set; }
    public String formattedGrandTotal { get; set; }

    public CombinedPDFController() {
        // Retrieve parameters from the URL
        patientId = ApexPages.currentPage().getParameters().get('patientId');
        savedRecordIds = ApexPages.currentPage().getParameters().get('savedRecordIds');

        // Initialize collections
        todayPrescriptions = new List<Prescription__c>();
        todayInvoices = new List<PatientBillController.BillingWrapper>();

        // Load prescription data
        loadPrescriptions();

        // Load invoice data
        loadInvoices();
    }

    private void loadPrescriptions() {
        todayPrescriptions = [SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, 
                                     Patient_Registration__r.Age__c, Patient_Registration__r.Address__c,
                                     Drug__r.Name, Dosage__c, Duration__c, Frequency__c, Intake__c, CreatedDate,
                                     CreatedBy.Name, Patient_Registration__r.patientID__c
                              FROM Prescription__c
                              WHERE Patient_Registration__c = :patientId
                               AND Invoice_Created__c = FALSE];

        hasPrescriptions = !todayPrescriptions.isEmpty();
        
        if (hasPrescriptions) {
            prescriptionDoctorName = todayPrescriptions[0].CreatedBy.Name;
            prescriptionFormattedDate = todayPrescriptions[0].CreatedDate.format('dd MMM yyyy');
        } else {
            prescriptionDoctorName = 'No Prescriptions Available';
            prescriptionFormattedDate = 'Date not available';
        }

        // Fetch next visit date
        List<Medical_Record__c> medicalRecords = [
            SELECT Id, Visit_Date__c
            FROM Medical_Record__c
            WHERE Patient_id__c = :patientId
        ];

        if (!medicalRecords.isEmpty()) {
            Date nextVisit = medicalRecords[0].Visit_Date__c;
            DateTime nextVisitDateTime = DateTime.newInstance(nextVisit, Time.newInstance(0, 0, 0, 0));
            nextVisitDate = nextVisitDateTime.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
        } else {
            nextVisitDate = 'No Visit Date Found';
        }
    }

    private void loadInvoices() {
        if (savedRecordIds != null) {
            List<String> savedRecordIdList = new List<String>(savedRecordIds.split(','));
            List<Billing__c> invoices = [SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, Discount__c, 
                                         Patient_Registration__r.Age__c, Patient_Registration__r.phone_number__c,
                                         Quantity__c, Grand_Total__c, Total__c, Rate__c, Products__r.Name, CreatedDate,
                                         CreatedBy.Name, Patient_Registration__r.patientID__c
                                  FROM Billing__c
                                  WHERE Patient_Registration__c = :patientId
                                   AND Id IN :savedRecordIdList];

            Integer serialNumber = 1;
            for (Billing__c invoice : invoices) {
                todayInvoices.add(new PatientBillController.BillingWrapper(invoice, serialNumber));
                serialNumber++;
            }

            hasInvoices = !invoices.isEmpty();
            
            if (hasInvoices) {
                invoiceDoctorName = invoices[0].CreatedBy.Name;
                invoiceFormattedDate = invoices[0].CreatedDate.format('dd MMM yyyy');
                formattedGrandTotal = String.valueOf(invoices[0].Grand_Total__c.setScale(2, RoundingMode.HALF_UP));
            } else {
                invoiceDoctorName = 'No Invoices Available';
                invoiceFormattedDate = 'Date not available';
                formattedGrandTotal = '0.00';
            }
        }
    }
}