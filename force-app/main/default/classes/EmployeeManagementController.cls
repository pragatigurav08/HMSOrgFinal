public with sharing class EmployeeManagementController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Employee__c>> getCategorizedEmployees() {
        Date today = Date.today();
        Date oneWeekAgo = today.addDays(-7);

        // Query for New Employees based on their CreatedDate or Date_of_Joining__c
        List<Employee__c> newEmployees = [
            SELECT Id, Name, Employee_Name__c, Date_of_Joining__c, Status__c, Department__c, Role__c,Gender__c,Date_of_Birth__c
            FROM Employee__c
            WHERE (Date_of_Joining__c >= :oneWeekAgo OR CreatedDate >= :oneWeekAgo)
            ORDER BY Date_of_Joining__c DESC
        ];

        // Query for Existing Employees
        List<Employee__c> existingEmployees = [
            SELECT Id, Name, Employee_Name__c, Date_of_Joining__c, Status__c, Department__c, Role__c,Gender__c,Date_of_Birth__c
            FROM Employee__c
            WHERE Date_of_Joining__c < :oneWeekAgo AND CreatedDate < :oneWeekAgo
            ORDER BY Date_of_Joining__c DESC
        ];

        return new Map<String, List<Employee__c>> {
            'newEmployees' => newEmployees,
            'existingEmployees' => existingEmployees
        };
    }

    @AuraEnabled
    public static Employee__c createEmployee(Employee__c newEmployee) {
        insert newEmployee;
        return newEmployee;
    }
      @AuraEnabled(cacheable=true)
  public static List<Employee__c> getEmployeeStatuses() {
    return [SELECT Id, Employee_Name__c, Status__c FROM Employee__c];
  }
   @AuraEnabled(cacheable=true)
  public static List<Employee__c> getEmployeesWithBirthdays() {
    return [SELECT Id, Employee_Name__c, Date_of_Birth__c FROM Employee__c WHERE Date_of_Birth__c != NULL];
  }
}