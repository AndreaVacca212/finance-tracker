import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AccountService, Account } from '../../services/account';
import { CurrencyPipe } from '@angular/common';
import { AddAccountDialogComponent } from './add-account-dialog';

@Component({
  selector: 'app-accounts',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts implements OnInit {
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);

  accounts = signal<Account[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading.set(true);
    this.accountService.getAll().subscribe({
      next: (data) => { this.accounts.set(data); this.loading.set(false); },
      error: () => { this.error.set('Errore nel caricamento dei conti.'); this.loading.set(false); }
    });
  }

  openAddDialog() {
    const ref = this.dialog.open(AddAccountDialogComponent, {
      width: '480px',
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) this.loadAccounts();
    });
  }

  totalBalance(): number {
    return this.accounts().reduce((sum, a) => sum + a.balance, 0);
  }
}