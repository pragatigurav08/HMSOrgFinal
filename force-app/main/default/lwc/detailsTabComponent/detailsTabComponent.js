import { LightningElement } from 'lwc';

export default class DetailsTabComponent extends LightningElement {

    value = ['option1'];

    get options() {
        return [
            { label: '' },
           
        ];
    }
    
    personalDetails = {
        firstName: 'John',
        lastName: 'Doe',
        // Add more personal details fields
    };

    accountDetails = {
        accountNumber: 'A-0456789271',
        panCardNo: 'VIR4567897',
        verificationStatus: 'Verified',
        openDate: '18/10/2024',
        modeOfOperation: 'Self',
        firstJointApp: '',
        secondJointApp: '',
        thirdJointApp: ''
    };

    // Options for checkbox group
    cardOptions = [
        { label: 'Credit Card', value: 'credit' },
        { label: 'Debit Card', value: 'debit' }
    ];

    selectedCards = ['credit'];
}