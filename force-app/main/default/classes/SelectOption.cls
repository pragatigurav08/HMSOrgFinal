/**
* @File Name : SelectOption.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 14, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 14, 2024 |   | Initial Version
**/

public class SelectOption {
    public String value { get; set; }
    public String label { get; set; }

    public SelectOption(String value, String label) {
        this.value = value;
        this.label = label;
    }
}