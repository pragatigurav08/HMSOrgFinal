public class InvoiceService {
 public static void updatePrescriptionInvoiceStatus(List<Billing__c> newInvoices) {
        // Gather product IDs from the new invoices
        Set<Id> productIds = new Set<Id>();
        for (Billing__c invoice : newInvoices) {
            if (invoice.Products__c != null) {
                productIds.add(invoice.Products__c);
            }
        }

        // Find prescriptions associated with these products that have not been marked as invoiced
        List<Prescription__c> prescriptionsToUpdate = [
            SELECT Id, Drug__c
            FROM Prescription__c
            WHERE Drug__c IN :productIds
            AND Invoice_Created__c = false
        ];

        // Update the Invoice_Created__c checkbox
        for (Prescription__c prescription : prescriptionsToUpdate) {
            prescription.Invoice_Created__c = true;
        }
        
        // Update all modified prescriptions
        if (!prescriptionsToUpdate.isEmpty()) {
            update prescriptionsToUpdate;
        }
    }
}