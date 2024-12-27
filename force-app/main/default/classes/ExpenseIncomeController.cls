public with sharing class ExpenseIncomeController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getExpenseIncomeData() {
        Map<String, Decimal> resultMap = new Map<String, Decimal>();
        Decimal totalExpense = 0;
        Decimal totalIncome = 0;

        // Query all records from Medicine__c object
        List<Medicine__c> medicines = [SELECT Manufacturer_Price__c, Stock__c, Selling_Price__c FROM Medicine__c];

        // Calculate Total Expense and Total Income
        if (!medicines.isEmpty()) {
            for (Medicine__c medicine : medicines) {
                totalExpense += (medicine.Manufacturer_Price__c != null ? medicine.Manufacturer_Price__c : 0) * 
                                (medicine.Stock__c != null ? medicine.Stock__c : 0);
                totalIncome += (medicine.Selling_Price__c != null ? medicine.Selling_Price__c : 0) * 
                               (medicine.Stock__c != null ? medicine.Stock__c : 0);
            }
        }

        Decimal totalEarnings = totalIncome - totalExpense;

        // Add results to the map
        resultMap.put('TotalExpense', totalExpense);
        resultMap.put('TotalIncome', totalIncome);
        resultMap.put('TotalEarnings', totalEarnings);

        // Debug output
        System.debug('Result Map: ' + resultMap);

        return resultMap;
    }
}