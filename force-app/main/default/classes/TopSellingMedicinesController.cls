public with sharing class TopSellingMedicinesController {
    // Custom Apex class to hold the medicine data
    public class MedicineData {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String Name { get; set; }
        @AuraEnabled public Decimal TotalSold { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<MedicineData> getTopSellingMedicines() {
        // Query the Billing__c object for total sales of each medicine
        List<AggregateResult> aggregateResults = [
            SELECT Products__c, SUM(Quantity__c) TotalSold
            FROM Billing__c
            GROUP BY Products__c
            ORDER BY SUM(Quantity__c) DESC
            LIMIT 3
        ];

        // Collect the product IDs from the aggregate query
        Set<Id> productIds = new Set<Id>();
        for (AggregateResult result : aggregateResults) {
            productIds.add((Id) result.get('Products__c'));
        }

        // Query the product names separately using the collected IDs
        Map<Id, String> productNames = new Map<Id, String>();
        for (Medicine__c product : [
            SELECT Id, Name FROM Medicine__c WHERE Id IN :productIds
        ]) {
            productNames.put(product.Id, product.Name);
        }

        // Build the result list
        List<MedicineData> topSellingMedicines = new List<MedicineData>();
        for (AggregateResult result : aggregateResults) {
            Id productId = (Id) result.get('Products__c');
            Decimal totalSold = (Decimal) result.get('TotalSold');

            MedicineData medicine = new MedicineData();
            medicine.Id = productId;
            medicine.Name = productNames.get(productId);
            medicine.TotalSold = totalSold;

            topSellingMedicines.add(medicine);
        }

        return topSellingMedicines;
    }
}