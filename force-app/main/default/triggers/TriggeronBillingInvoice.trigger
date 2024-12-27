trigger TriggeronBillingInvoice on Billing__c (after insert) {
 InvoiceService.updatePrescriptionInvoiceStatus(Trigger.new);
}