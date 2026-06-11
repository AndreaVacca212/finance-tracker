import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { AccountService, Account } from '../../services/account';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private accountService = inject(AccountService);

  accounts = signal<Account[]>([]);
  loading = signal(true);

  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#60a5fa', '#34d399', '#f472b6', '#fb923c', '#a78bfa'] }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit() {
    this.accountService.getAll().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.chartData = {
          labels: data.map(a => a.name),
          datasets: [{
            data: data.map(a => a.balance),
            backgroundColor: ['#60a5fa', '#34d399', '#f472b6', '#fb923c', '#a78bfa']
          }]
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  totalBalance(): number {
    return this.accounts().reduce((sum, a) => sum + a.balance, 0);
  }
}