import { LightningElement, wire } from 'lwc';
import getExpenseIncomeData from '@salesforce/apex/ExpenseIncomeController.getExpenseIncomeData';
import { loadScript } from 'lightning/platformResourceLoader';
import GRAPH_CHART from '@salesforce/resourceUrl/graphChart';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class MobileExpenseChart extends LightningElement {
  chart; // Holds the chart instance
    chartData = []; // Data for the chart
    isDataAvailable = false; // Tracks if data is available for rendering
    isChartJsInitialized = false; // Tracks if Chart.js is loaded
    wiredData; // Tracks the wired service for refreshing

    @wire(getExpenseIncomeData)
    wiredExpenseIncomeData(response) {
        this.wiredData = response; // Save response for refresh
        const { error, data } = response;

        if (data) {
            const totalExpense = data?.TotalExpense || 0;
            const totalIncome = data?.TotalIncome || 0;
            const totalEarnings = data?.TotalEarnings || 0;

            // Prepare data for the chart
            this.chartData = [
                { label: 'Total Expense', value: totalExpense },
                { label: 'Total Income', value: totalIncome },
                { label: 'Total Earnings', value: totalEarnings }
            ];
            this.isDataAvailable = true;
            this.initializeChart(); // Initialize Chart.js after data is loaded
        } else if (error) {
            console.error('Error fetching data:', error);
            // Retry fetching data after a delay
            setTimeout(() => {
                refreshApex(this.wiredData);
            }, 2000);
        }
    }

    renderedCallback() {
        // Ensure Chart.js is only loaded once
        if (this.isChartJsInitialized) {
            return;
        }

        // Append cache-busting query parameter to the static resource URL
        const graphChartUrl = `${GRAPH_CHART}?cacheBuster=${Date.now()}`;

        // Load the Chart.js library from Static Resource
        loadScript(this, graphChartUrl)
            .then(() => {
                this.isChartJsInitialized = true;
                this.initializeChart(); // Initialize the chart once Chart.js is loaded
            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart.js',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeChart() {
        // Ensure Chart.js and data are both loaded before rendering the chart
        if (!this.isChartJsInitialized || !this.isDataAvailable) {
            return;
        }

        // Destroy existing chart if present
        if (this.chart) {
            this.chart.destroy();
        }

        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            const canvas = this.template.querySelector('canvas');
            if (!canvas) {
                console.error('Canvas not found.');
                return;
            }

            this.chart = new Chart(canvas, {
                type: 'doughnut', // Donut chart type
                data: {
                    labels: this.chartData.map(item => item.label), // Extract labels
                    datasets: [
                        {
                            data: this.chartData.map(item => item.value), // Extract data values
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Chart colors
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top' // Position the legend at the top
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    // Add currency symbol to tooltip values
                                    return `₹ ${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}