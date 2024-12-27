import { LightningElement, track, wire } from 'lwc';
import getRecordCounts from '@salesforce/apex/HomepageController.QuarterPieChartgetRecordCounts';

export default class Chart1 extends LightningElement {
 
    @track errorMessage = '';
    @track total = true;
    @track quarter = false; 
    @track isDropdownOpen = false;

    accountPercentage = 0;
    insurancesPercentage = 0;
    loansPercentage = 0;

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectTotalTrends() {
        this.total = true;
        this.quarter =false;
        this.isDropdownOpen = false;
        this.loadData();
    }
    selectQuarterTrends() {
        this.quarter = true; // Set quarter flag
        this.total = false;  // Reset total when selecting quarter
        this.isDropdownOpen = false;
        this.loadData();
    }


    selectWeeklyTrends() {
        this.total = false;
        this.isDropdownOpen = false;
        // Add logic for weekly trends
    }

    selectTodayTrends() {
        this.total = false;
        this.isDropdownOpen = false;
        // Add logic for today's trends
    }
    loadData() {
        // Trigger the data loading based on total or quarter
        this.getDataForPieChart();
    }

    

    @wire(getRecordCounts)
    wiredRecordCounts({ error, data }) {
        if (data) {
               console.log('pie chart>>>data');
            const total = data.Accounts + data.Insurances + data.Loans;
            this.accountPercentage = total ? Math.floor((data.Accounts / total) * 100) : 0;
            this.insurancesPercentage = total ? Math.floor((data.Insurances / total) * 100) : 0;
            this.loansPercentage = total ? Math.floor((data.Loans / total) * 100) : 0;

            console.log('this.accountPercentage'+this.accountPercentage);
            console.log('this.insurancesPercentage'+this.insurancesPercentage);
            console.log('this.loansPercentage'+this.loansPercentage);
            this.setPieChartBackground();
        } else if (error) {
            this.errorMessage = 'Failed to load data. Please try again later.';
            console.error('Error fetching record counts:', error);
        }
    }

    @wire(getRecordCounts, { isQuarter: '$quarter' })
    wiredRecordCounts({ error, data }) {
        if (data) {
            console.log('quarter chart>>>data');
            const total = data.Accounts + data.Insurances + data.Loans;
            this.accountPercentage = total ? Math.floor((data.Accounts / total) * 100) : 0;
            this.insurancesPercentage = total ? Math.floor((data.Insurances / total) * 100) : 0;
            this.loansPercentage = total ? Math.floor((data.Loans / total) * 100) : 0;
            console.log('this.accountPercentage'+this.accountPercentage);
            console.log('this.insurancesPercentage'+this.insurancesPercentage);
            console.log('this.loansPercentage'+this.loansPercentage);
            this.setPieChartBackground();
        } else if (error) {
            this.errorMessage = 'Failed to load data. Please try again later.';
            console.error('Error fetching record counts:', error);
        }
    }

    setPieChartBackground() {
        const pieChartElement = this.template.querySelector('[data-id="pieChart"]');
        console.log('pieChartElement>>>>>>>>>>>>');
        if (pieChartElement) {
            const gradient = `conic-gradient(
                #FF7900  0 ${this.accountPercentage}%, 
                #2196f3 ${this.accountPercentage}% ${this.accountPercentage + this.insurancesPercentage}%, 
                #4caf50 ${this.accountPercentage + this.insurancesPercentage}% 100%
            )`;
            pieChartElement.style.background = gradient;
        }
    }


  

  
    renderedCallback() {
        // Ensure the background is set on every render
        console.log('renderedCallback>>>>');
        this.setPieChartBackground();
    }
}


// import { LightningElement, track, wire } from 'lwc';
// import getRecordCounts from '@salesforce/apex/HomepageController.PieChartgetRecordCounts';

// export default class Chart1 extends LightningElement {
//     @track errorMessage = '';
//     @track total=true;
//      @track isDropdownOpen = false;
//     @track total = true;

//     toggleDropdown() {
//         this.isDropdownOpen = !this.isDropdownOpen;
//     }

//     selectTotalTrends() {
//         this.total = true;
//         this.isDropdownOpen = false;
//     }

//     selectWeeklyTrends() {
//         this.total = false;
//         this.isDropdownOpen = false;
//         // Add logic for weekly trends
//     }

//     selectTodayTrends() {
//         this.total = false;
//         this.isDropdownOpen = false;
//         // Add logic for today's trends
//     }

//     @wire(getRecordCounts)
//     wiredRecordCounts({ error, data }) {
//         if (data) {
//             const total = data.Accounts + data.Insurances + data.Loans;
//             console.log('data.Accounts'+data.Accounts);
//             console.log('data.Contacts'+ data.Insurances);
//             console.log('data.loans'+data.Loans);
//             const accountPercentage = total ? Math.floor((data.Accounts / total) * 100) : 0;
//             const insurancesPercentage = total ? Math.floor((data.Insurances / total) * 100) : 0;
//             const loansPercentage = total ? Math.floor((data.Loans / total) * 100) : 0;
//             console.log('accountPercentage>>>>'+accountPercentage);
//             console.log('insurancesPercentage>>>>'+insurancesPercentage);
//             console.log('loansPercentage>>>>'+loansPercentage);
//             this.setPieChartBackground(accountPercentage, insurancesPercentage, loansPercentage);
//                console.log('wire last>>>>');
//         } else if (error) {
//             this.errorMessage = 'Failed to load data. Please try again later.';
//             console.error('Error fetching record counts:', error);
//         }
//     }

//     setPieChartBackground(accountPercentage, insurancesPercentage, loansPercentage) {
//         const pieChartElement = this.template.querySelector('[data-id="pieChart"]');
//     console.log('pieChartElement>>' + JSON.stringify(pieChartElement));


//         if (pieChartElement) {
//             const gradient = `conic-gradient(
//                 #FF7900  0 ${accountPercentage}%, 
//                #2196f3 ${accountPercentage}% ${accountPercentage + insurancesPercentage}%, 
//                 #4caf50 ${accountPercentage + insurancesPercentage}% 100%
//             )`;
//             console.log('gradient>>>>'+gradient);
//             pieChartElement.style.background = gradient;
//         }
//     }
  
// }


// import { LightningElement,track,wire } from 'lwc';
// import getRecordCounts from '@salesforce/apex/HomepageController.PieChartgetRecordCounts';
// export default class Chart1 extends LightningElement {
//  @wire(getRecordCounts)
//     wiredRecordCounts({ error, data }) {
//         if (data) {
//             const total = data.Accounts + data.Insurances+data.Loans;
//                   console.log('data.Accounts'+data.Accounts);
//                   console.log(' data.Contacts'+ data.Insurances);
//                    console.log('data.loans'+data.Loans);
          
// const accountPercentage = total ? Math.floor((data.Accounts / total) * 100) : 0;
// const insurancesPercentage = total ? Math.floor((data.Insurances / total) * 100) : 0;
// const loansPercentage=total ? Math.floor((data.Loans / total) * 100) : 0;
//             console.log('accountPercentage>>>>'+accountPercentage);
//             console.log('insurancesPercentage>>>>'+insurancesPercentage);
//             console.log('loansPercentage>>>>'+loansPercentage);
//             this.setPieChartBackground(accountPercentage, insurancesPercentage,loansPercentage);
//             console.log('wire last>>>>');
//         } else if (error) {
//             console.error('Error fetching record counts:', error);
//         }
//     }

//     setPieChartBackground(accountPercentage, contactPercentage) {
//         const pieChartElement = this.template.querySelector('[data-id="pieChart"]');
//         console.log('pieChartElement>>'+pieChartElement);
//         if (pieChartElement) {
//             // const gradient = `conic-gradient(
//             //     green 0 ${accountPercentage}%, 
//             //     yellow ${accountPercentage}% ${accountPercentage + insurancesPercentage}%, 
//             //     gray ${accountPercentage + contactPercentage}% 100%
//             // )`;
//             const gradient = `conic-gradient(
//     green 0 ${accountPercentage}%, 
//     yellow ${accountPercentage}% ${accountPercentage + insurancesPercentage}%, 
//     gray ${accountPercentage + insurancesPercentage}% 100%
// )`;


//             pieChartElement.style.background = gradient;
//         }
//     }
// }