public class FieldLevelSecurityUpdater {
 public static void updateFLSForAllFields(String objectApiName) {
        Map<String, Schema.SObjectField> fields = Schema.getGlobalDescribe().get(objectApiName).getDescribe().fields.getMap();
        Profile sysAdminProfile = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1];

        // Prepare a list to store FieldPermissions records
        List<FieldPermissions> permissionsToInsert = new List<FieldPermissions>();

        // Loop through each field and create/update FLS records for System Administrator profile
        for (String fieldName : fields.keySet()) {
            FieldPermissions permission = new FieldPermissions(
                SObjectType = objectApiName,
                Field = objectApiName + '.' + fieldName,
                ParentId = sysAdminProfile.Id,
                PermissionsRead = true,
                PermissionsEdit = true
            );
            permissionsToInsert.add(permission);

            // Batch insert for every 200 records to avoid DML limits
            if (permissionsToInsert.size() == 200) {
                insert permissionsToInsert;
                permissionsToInsert.clear();
            }
        }
        
        // Insert remaining permissions
        if (!permissionsToInsert.isEmpty()) {
            insert permissionsToInsert;
        }
    }
}