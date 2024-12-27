import { LightningElement, track } from 'lwc';

export default class AgriculturalLoanForm extends LightningElement {
    @track farmerName;
    @track cultivationArea;
    @track cropCost;
    @track marginMoney;
    @track interestRate;
    @track loanDuration;
    @track projectedIncome;
    @track nonFarmIncome;
    @track loanAmount;
    @track emi;

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    calculateLoan() {
        const totalCropCost = this.cultivationArea * this.cropCost;
        const eligibleLoanAmount = totalCropCost - this.marginMoney;
        this.loanAmount = eligibleLoanAmount;

        const monthlyInterestRate = this.interestRate / (12 * 100);
        const totalMonths = this.loanDuration * 12;

        this.emi = (
            (eligibleLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
            (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
        ).toFixed(2);
    }
}