import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Banking extends NavigationMixin(LightningElement) {
    handleDepositClick() {
        // Action to perform when Deposits box is clicked
        console.log('Deposits clicked');
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/deposists'
            }
        });
    }

    handleWithdrawClick() {
        // Action to perform when Withdraw Money box is clicked
        console.log('Withdraw Money clicked');
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/withdrawal'
            }
        });
    }
}