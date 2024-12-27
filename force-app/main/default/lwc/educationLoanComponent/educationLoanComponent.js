export default class EducationLoanComponent extends NavigationMixin(LightningElement) {
    navigateToLoanApplicationPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__LoanApplicationComponent'
            }
        });
    }
}