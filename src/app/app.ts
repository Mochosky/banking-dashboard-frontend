import { Component, ElementRef, OnInit, inject, afterRenderEffect, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BankingService } from './services/banking.services';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './app.html'
})
export class App implements OnInit {
  banking = inject(BankingService);

  chartRef = viewChild<ElementRef>('cashflowChart');
  chartInstance: Chart | null = null;

  constructor() {
    // Watches the signal and renders the chart automatically when data arrives
    afterRenderEffect(() => {
      const data = this.banking.cashflowSignal();
      const chartElement = this.chartRef();

      if (data && chartElement) {
        this.renderChart(data);
      }
    });
  }

  ngOnInit() {
    this.banking.loadSummary();
    this.banking.loadTransactions();
    this.banking.loadCashflow();
  }

  renderChart(data: any[]) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartRef()?.nativeElement.getContext('2d');
    if (!ctx) return;
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        // Format dates to short month/day (e.g., "Nov 12")
        labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
          {
            label: 'Income',
            data: data.map(d => d.income),
            borderColor: '#10b981', // Tailwind Emerald 500
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4 // Creates the smooth curve
          },
          {
            label: 'Expenses',
            data: data.map(d => d.expenses),
            borderColor: '#ef4444', // Tailwind Red 500
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}