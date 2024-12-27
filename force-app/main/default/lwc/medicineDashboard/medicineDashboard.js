import { LightningElement, track, wire } from 'lwc';
import getMedicineTypeCounts from '@salesforce/apex/MedicineDataController.getMedicineTypeCounts';

export default class MedicineDashboard extends LightningElement {
    @track medicineData = []; // Only declare once

    @wire(getMedicineTypeCounts)
    wiredMedicineTypeCounts({ error, data }) {
        if (data) {
            // Define new maximum count for normalization
            const maxCount = 50; // Set to 50 as per your requirement
            const colors = [
                '#0070d2', '#54a0ff', '#10ac84', '#f368e0', '#ff9f43', '#5f27cd',
            ];

            // Prepare the data for the graph
            this.medicineData = Object.keys(data).map((key, index) => {
                const count = data[key];
                const height = Math.min(Math.round((count / maxCount) * 100), 100); // Height as percentage
                const color = colors[index % colors.length]; // Cycle through colors

                return {
                    label: key || 'Unknown', // Handle null labels
                    count: count,
                    height: height,
                    color: color,
                    style: `height: ${height}%; background-color: ${color};` // Add style property
                };
            });
        } else if (error) {
            console.error('Error fetching medicine data:', error);
        }
    }
}