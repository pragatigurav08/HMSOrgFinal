public with sharing class PreviewPrescriptionInvoiceController {
    @AuraEnabled(cacheable=true)
    public static List<Prescription__c> getTodayPrescriptions(Id patientId) {
        return [
            SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, 
                   Patient_Registration__r.Age__c, Patient_Registration__r.Address__c,
                   Drug__r.Name, Dosage__c, Duration__c, Frequency__c, Intake__c, CreatedDate,
                   CreatedBy.Name, Patient_Registration__r.patientID__c
            FROM Prescription__c
            WHERE Patient_Registration__c = :patientId
            // AND CreatedDate = TODAY
            AND Invoice_Created__c = FALSE
        ];
    }

    @AuraEnabled(cacheable=true)
    public static String getFormattedNextVisitDate(Id patientId) {
        List<Medical_Record__c> medicalRecords = [
            SELECT Visit_Date__c
            FROM Medical_Record__c
            WHERE Patient_id__c = :patientId
            // AND CreatedDate = TODAY
        ];
        if (!medicalRecords.isEmpty()) {
            Date nextVisitDate = medicalRecords[0].Visit_Date__c;
            DateTime nextVisitDateTime = DateTime.newInstance(nextVisitDate, Time.newInstance(0, 0, 0, 0));
            return nextVisitDateTime.format('dd MMM yyyy');
        }
        return null;
    }

    @AuraEnabled(cacheable=true)
    public static String getFormattedCreatedDate(Id patientId) {
        List<Prescription__c> prescriptions = [
            SELECT CreatedDate
            FROM Prescription__c
            WHERE Patient_Registration__c = :patientId
            // AND CreatedDate = TODAY
        ];
        if (!prescriptions.isEmpty()) {
            DateTime createdDate = prescriptions[0].CreatedDate;
            return createdDate.format('dd MMM yyyy');
        }
        return 'Date not available';
    }
}