import { LightningElement, wire } from 'lwc';
import getFinancialData from '@salesforce/apex/MedicineFinancials.getFinancialData';

export default class FinancialDonutChart extends LightningElement {
    @wire(getFinancialData)
    financialData({ error, data }) {
        if (data) {
            console.log('Financial Data:', JSON.stringify(data));
            this.renderDonutChart(data);
        } else if (error) {
            console.error('Error fetching financial data:', error);
        }
    }

    renderDonutChart(data) {
        const totalExpense = data['Total Expense'] || 0;
        const totalIncome = data['Total Income'] || 0;
        const totalEarnings = data['Total Earnings'] || 0;

        const canvas = this.template.querySelector('canvas.donut');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = 400;
        canvas.height = 400;

        const total = totalExpense + totalIncome + totalEarnings;
        const radius = Math.min(canvas.width, canvas.height) / 2;

        // Draw the donut chart
        let startAngle = 0;

        // Define colors for each segment
        const colors = ['#FF6384', '#36A2EB', '#FFCE56'];

        // Draw each segment
        const values = [totalExpense, totalIncome, totalEarnings];
        
        values.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI; // Calculate slice angle
            ctx.beginPath();
            ctx.moveTo(radius, radius); // Move to center of the circle
            ctx.arc(radius, radius, radius - 20, startAngle, startAngle + sliceAngle); // Draw arc
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            startAngle += sliceAngle; // Update starting angle for next segment
        });

        // Draw the center text with totals
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(`Total Expense: ${totalExpense}`, radius, radius - 20);
        ctx.fillText(`Total Income: ${totalIncome}`, radius, radius);
        ctx.fillText(`Total Earnings: ${totalEarnings}`, radius, radius + 20);
    }
}