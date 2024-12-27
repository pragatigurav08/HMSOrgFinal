import { LightningElement, track, wire } from 'lwc';
import getMonthlySales from '@salesforce/apex/MonthlySales.getMonthlySales';

export default class MonthlySalesDashboard extends LightningElement {
    @track monthlyData = []; // Data for monthly sales

    @wire(getMonthlySales)
    wiredMonthlySales({ error, data }) {
        if (data) {
            console.log('Monthly Sales Data:', data); // Log the data received from Apex
            
            const colors = ['#0070d2', '#54a0ff', '#10ac84', '#f368e0', '#ff9f43', '#5f27cd'];

            this.monthlyData = Object.keys(data).map((key, index) => {
                const sales = data[key];

                // Normalize height based on maximum expected sales value
                const maxSales = 10000; // Adjust this value based on your actual maximum sales
                const height = Math.round((sales / maxSales) * 100); // Height as a percentage

                return {
                    label: key, // Month name from Apex
                    sales: sales,
                    style: `height: ${height}%; background-color: ${colors[index % colors.length]};`
                };
            });

            console.log('Processed Monthly Data:', this.monthlyData); // Log processed data
        } else if (error) {
            console.error('Error fetching monthly sales data:', error);
        }
    }
}






// import { LightningElement, track, wire } from 'lwc';
// import getMonthlySales from '@salesforce/apex/MonthlySales.getMonthlySales';

// export default class MonthlySalesDashboard extends LightningElement {
//     // @track monthlyData = [
//     //     { label: 'January', sales: 5000, style: 'height: 50%; background-color: #0070d2;' },
//     //     { label: 'February', sales: 7000, style: 'height: 70%; background-color: #54a0ff;' },
//     //     { label: 'March', sales: 3000, style: 'height: 30%; background-color: #10ac84;' },
//     //     { label: 'April', sales: 9000, style: 'height: 90%; background-color: #f368e0;' },
//     //     { label: 'May', sales: 6000, style: 'height: 60%; background-color:#ff9f43;' },
//     //     { label:'June', sales :8000 ,style:'height :80%;background-color:#5f27cd'}
//     // ];
//     @track monthlyData = []; // Data for monthly sales
//     @wire(getMonthlySales)
//     wiredMonthlySales({ error, data }) {
//         if (data) {
//             console.log('wire data>>>>');

//             console.log('Monthly Sales Data:', data); // Log the data received from Apex
//             const colors = ['#0070d2', '#54a0ff', '#10ac84', '#f368e0', '#ff9f43', '#5f27cd'];

//             this.monthlyData = Object.keys(data).map((key, index) => {
//                 const sales = data[key];
//                 const height = Math.round((sales / 10000) * 100); // Normalize height based on max value (10,000)

//                 return {
//                     label: key,
//                     sales: sales,
//                     style: `height: ${height}%; background-color: ${colors[index % colors.length]};`
//                 };
//             });

//             console.log('Processed Monthly Data:', this.monthlyData); // Log processed data
//         } else if (error) {
//             console.error('Error fetching monthly sales data:', error);
//         }
//     }
// }