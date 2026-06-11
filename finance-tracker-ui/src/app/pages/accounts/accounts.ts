import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService, Account } from '../../services/account';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts implements OnInit {
  private accountService = inject(AccountService);

  accounts = signal<Account[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.accountService.getAll().subscribe({
      next: (data) => { this.accounts.set(data); this.loading.set(false); },
      error: () => { this.error.set('Errore nel caricamento dei conti.'); this.loading.set(false); }
    });
  }

  totalBalance(): number {
    return this.accounts().reduce((sum, a) => sum + a.balance, 0);
  }
}