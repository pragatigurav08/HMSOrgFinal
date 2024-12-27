public with sharing class MedicineFinancials {
    @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getFinancialData() {
        Decimal totalExpense = 0;
        Decimal totalIncome = 0;

        // Query all Medicine records
        List<Medicine__c> medicines = [SELECT Manufacturer_Price__c, Selling_Price__c, Stock__c FROM Medicine__c];

        for (Medicine__c medicine : medicines) {
            // Calculate individual expenses and incomes
            Decimal expense = medicine.Manufacturer_Price__c * medicine.Stock__c;
            Decimal income = medicine.Selling_Price__c * medicine.Stock__c;

            // Accumulate totals
            totalExpense += expense;
            totalIncome += income;
        }

        // Calculate total earnings
        Decimal totalEarnings = totalIncome - totalExpense;

        // Prepare the result map
        Map<String, Decimal> financialData = new Map<String, Decimal>{
            'Total Expense' => totalExpense,
            'Total Income' => totalIncome,
            'Total Earnings' => totalEarnings
        };

        return financialData;
    }
}