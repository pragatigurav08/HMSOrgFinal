import { LightningElement, api, wire } from 'lwc';
import getAccountDataSummary from '@salesforce/apex/AccountRelatedDataController.getAccountDataSummary';
import { loadScript } from 'lightning/platformResourceLoader';
import GRAPH_CHART from '@salesforce/resourceUrl/graphChart';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountDoughnutChart extends LightningElement {
    @api accountId; // Ensure this is set correctly
    chart;
    isChartJsInitialized = false;

    chartData = {
        labels: ['Insurance Policies', 'Loans', 'Assets', 'Advisors'],
        datasets: [
            {
                data: [0, 0, 0, 0], // Initialize with zeros
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

      get validAccountId() {
        return this.accountId ? this.accountId : null; // Return null if not set
    }

    @wire(getAccountDataSummary, { accountId: '$validAccountId' })
    wiredSummary({ data, error }) {
        console.log('Wired Summary Data:', JSON.stringify(data));
        console.log('Wired Summary Error:', JSON.stringify(error));
        console.log('Current accountId:', this.validAccountId); // Log current accountId

        if (data) {
            this.chartData.datasets[0].data = [
                data.totalInsurancePolicies || 0,
                data.totalLoans || 0,
                data.totalAssets || 0,
                data.totalAdvisors || 0,
            ];
            console.log('Updated chart data:', this.chartData);
            this.updateChart(); // Update the chart with new data
        } else if (error) {
            console.error('Error fetching account data summary:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                })
            );
        }
    }

    renderedCallback() {
        if (this.isChartJsInitialized) return;

        const graphChartUrl = `${GRAPH_CHART}?cacheBuster=${Date.now()}`;
        loadScript(this, graphChartUrl)
            .then(() => {
                this.isChartJsInitialized = true;
                this.initializeChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart.js',
                        message: error.message,
                        variant: 'error',
                    })
                );
            });
    }

    initializeChart() {
        const canvas = this.template.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: this.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    }

    updateChart() {
        if (this.chart) {
            this.chart.update();
        }
    }
}