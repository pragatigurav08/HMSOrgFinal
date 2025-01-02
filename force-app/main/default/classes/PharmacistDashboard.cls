public class PharmacistDashboard {
    
    @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getMedicineList() {
        return [SELECT Id, Name FROM Medicine__c];
    }
    
    @AuraEnabled(cacheable=true)
    public static Medicine__c getMedicineDetails(Id medicineId) {
        return [
            SELECT Id, Batch_Number__c, Stock__c, Expiry_Date__c,Selling_Price__c
            FROM Medicine__c 
            WHERE Id = :medicineId 
            
        ];
    }
    
    @AuraEnabled(cacheable=true)
public static List<Prescription__c> getTodaysPrescriptionsByPatient(Id patientId) {
    List<Prescription__c> prescriptions = [
        SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, Patient_Registration__r.Age__c, 
               Drug__r.Name, Dosage__c, Duration__c, Frequency__c, Intake__c, CreatedDate
        FROM Prescription__c
        WHERE Patient_Registration__c = :patientId
        AND CreatedDate = TODAY AND Invoice_Created__c=FALSE
    ];

    // Return null if no records found
    return prescriptions.isEmpty() ? null : prescriptions;
}

    @AuraEnabled
public static List<Id> saveBillingRecords(List<Billing__c> billingRecords) {
    // Insert billing records
    insert billingRecords;
    List<Id> insertedRecordIds = new List<Id>();
     for (Billing__c record : billingRecords) {
    insertedRecordIds.add(record.Id);
     }
 System.debug('Inserted Billing Record IDs: ' + insertedRecordIds);
    // Map to track stock adjustments for each Medicine
    Map<Id, Decimal> medicineStockAdjustments = new Map<Id, Decimal>();

    // Sum quantities for each Medicine
    for (Billing__c record : billingRecords) {
        if (medicineStockAdjustments.containsKey(record.Products__c)) {
            medicineStockAdjustments.put(record.Products__c, 
                medicineStockAdjustments.get(record.Products__c) + record.Quantity__c);
        } else {
            medicineStockAdjustments.put(record.Products__c, record.Quantity__c);
        }
    }

    // Fetch and update each Medicine's stock
    List<Medicine__c> medicinesToUpdate = [SELECT Id, Stock__c FROM Medicine__c WHERE Id IN :medicineStockAdjustments.keySet()];
    for (Medicine__c medicine : medicinesToUpdate) {
        medicine.Stock__c -= medicineStockAdjustments.get(medicine.Id); // Adjust stock
    }
    update medicinesToUpdate;
     return insertedRecordIds;
}

@AuraEnabled(cacheable=true)
 public static List<Patient_Registration__c> getRegisteredPatients() {
 return [SELECT Id, Name, Email__c, phone_number__c,Age__c,blood_group__c,Gender__c FROM 
Patient_Registration__c order by CreatedDate DESC]; 
 }
    
     @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getCounts() {
        Map<String, Decimal> counts = new Map<String, Decimal>();

        // Fetch the total count for each custom object
        counts.put('TotalMedicines', [SELECT COUNT() FROM Medicine__c]);
        counts.put('TotalManufacturers', [SELECT COUNT() FROM Manufacturer__c]);
        counts.put('TotalInvoices', [SELECT COUNT() FROM Billing__c]);

        // Calculate the sum of Total__c from Billing__c records
        List<AggregateResult> totalSalesResult = [SELECT SUM(Total__c) total FROM Billing__c];
        Decimal totalSales = totalSalesResult.isEmpty() || totalSalesResult[0].get('total') == null ? 0 : (Decimal) totalSalesResult[0].get('total');
        
        counts.put('TotalSales', totalSales); // Put total sales in the map

        return counts;
    }
    
    @AuraEnabled
    public static Id saveMedicine(Medicine__c medicine) {
        try {
            insert medicine;
            return medicine.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving medicine record: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Manufacturer__c> getManufacturers() {
        try {
            // Query the Manufacturer__c object to get all manufacturers
            return [SELECT Id, Name FROM Manufacturer__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving manufacturers: ' + e.getMessage());
        }
    }
    
     @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getMedicines(String searchKey) {
        String searchTerm = '%' + searchKey + '%';
        return [
            SELECT Name, Generic_Name__c, Medicine_Type__c, Batch_Number__c, Expiry_Date__c,
                   Manufacturer__r.Name, Selling_Price__c, Manufacturer_Price__c, Stock__c, Unit__c
            FROM Medicine__c
            WHERE Name LIKE :searchTerm
            ORDER BY Name
            LIMIT 100
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Manufacturer__c> getManufacturer(String searchKey) {
        String searchPattern = '%' + searchKey + '%';
        return [
            SELECT Id, Name 
            FROM Manufacturer__c 
            WHERE Name LIKE :searchPattern
            ORDER BY Name
        ];
    }

    // Add a new Manufacturer
    @AuraEnabled
    public static void addManufacturer(String name) {
        Manufacturer__c newManufacturer = new Manufacturer__c(Name = name);
        insert newManufacturer;
    }
    @AuraEnabled
    public static String generateAndAttachPDF(String patientId) {
        try {
            // Generate the PDF content
            PageReference pdfPage = Page.PrintPrescription;
            pdfPage.getParameters().put('patientId', patientId);

            // Asynchronously get PDF content
            Blob pdfBlob = pdfPage.getContentAsPDF();

            // Create Attachment or ContentDocument
            Attachment attachment = new Attachment();
            attachment.ParentId = patientId;
            attachment.Name = 'Prescription_' +Datetime.now().format('dd/MM/yyyy_hh:mm a') + '.pdf';
            attachment.Body = pdfBlob;
            attachment.ContentType = 'application/pdf';
            insert attachment;

            return 'Prescription PDF successfully attached to the patient record.';
        } catch (Exception e) {
            return 'Error generating PDF: ' + e.getMessage();
        }
    }
    /* @AuraEnabled
    public static String generateAndAttachPDFF(String patientId) {
        try {
            // Generate the PDF content
            PageReference pdfPage = Page.printinvoice;
            pdfPage.getParameters().put('patientId', patientId);

            // Asynchronously get PDF content
            Blob pdfBlob = pdfPage.getContentAsPDF();

            // Create Attachment or ContentDocument
            Attachment attachment = new Attachment();
            attachment.ParentId = patientId;
            attachment.Name = 'Invoice_' + Date.today().format() + '.pdf';
            attachment.Body = pdfBlob;
            attachment.ContentType = 'application/pdf';
            insert attachment;

            return 'Prescription PDF successfully attached to the patient record.';
        } catch (Exception e) {
            return 'Error generating PDF: ' + e.getMessage();
        }
    }*/
    @AuraEnabled
public static String generateAndAttachPDFF(String patientId, String savedRecordIds) {
    if (String.isBlank(patientId)) {
        return 'Error: Patient ID is required.';
    }

    try {
        PageReference pdfPage = Page.printinvoice;
        pdfPage.getParameters().put('patientId', patientId);
        pdfPage.getParameters().put('savedRecordIds', savedRecordIds);
        System.debug('Patient ID: ' + patientId);
System.debug('Saved Record IDs: ' + savedRecordIds);


        System.debug('PDF Page URL: ' + pdfPage.getUrl());

        Blob pdfBlob = pdfPage.getContentAsPDF();

        Attachment attachment = new Attachment();
        attachment.ParentId = patientId;
       attachment.Name = 'Invoice_' + Datetime.now().format('dd/MM/yyyy_hh:mm a') + '.pdf';
        attachment.Body = pdfBlob;
        attachment.ContentType = 'application/pdf';
        insert attachment;

        return 'Invoice PDF successfully attached to the patient record.';
    } catch (Exception e) {
        System.debug('Error: ' + e.getMessage());
        throw new AuraHandledException('Error generating PDF: ' + e.getMessage());
    }
}

}