import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionService, Transaction } from '../../services/transaction';
import { AccountService, Account } from '../../services/account';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';
import { AddTransactionDialogComponent } from './add-transaction-dialog';

@Component({
  selector: 'app-transactions',
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSelectModule, MatFormFieldModule, MatChipsModule,
    CurrencyPipe, DatePipe
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  transactions = signal<Transaction[]>([]);
  accounts = signal<Account[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  // Filtri
  filterType = signal<'All' | 'Income' | 'Expense'>('All');
  filterAccountId = signal<string>('');
  filterMonth = signal<string>('');   // formato 'YYYY-MM'

  filteredTransactions = computed(() => {
    let list = this.transactions();

    if (this.filterType() !== 'All')
      list = list.filter(t => t.type === this.filterType());

    if (this.filterAccountId())
      list = list.filter(t => t.accountId === this.filterAccountId());

    if (this.filterMonth())
      list = list.filter(t => t.date.startsWith(this.filterMonth()));

    return list;
  });

  availableMonths = computed(() => {
    const months = new Set(
      this.transactions().map(t => t.date.substring(0, 7))
    );
    return Array.from(months).sort().reverse();
  });

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.accountService.getAll().subscribe(data => this.accounts.set(data));
    this.transactionService.getAll().subscribe({
      next: (data) => { this.transactions.set(data); this.loading.set(false); },
      error: () => { this.error.set('Errore nel caricamento.'); this.loading.set(false); }
    });
  }

  resetFilters() {
    this.filterType.set('All');
    this.filterAccountId.set('');
    this.filterMonth.set('');
  }

  deleteTransaction(t: Transaction) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Elimina transazione',
        message: `Sei sicuro di voler eliminare "${t.description}"?`,
        confirmLabel: 'Elimina'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.deletingId.set(t.id);
      this.transactionService.delete(t.id).subscribe({
        next: () => {
          this.deletingId.set(null);
          this.snackBar.open('Transazione eliminata', 'Chiudi', { duration: 3000 });
          this.loadAll();
        },
        error: () => {
          this.deletingId.set(null);
          this.snackBar.open('Errore durante l\'eliminazione', 'Chiudi', { duration: 3000 });
        }
      });
    });
  }

  formatMonth(ym: string): string {
    const [year, month] = ym.split('-');
    const date = new Date(+year, +month - 1);
    return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  }

  totalIncome(): number {
    return this.filteredTransactions()
      .filter(t => t.type === 'Income')
      .reduce((s, t) => s + t.amount, 0);
  }

  totalExpense(): number {
    return this.filteredTransactions()
      .filter(t => t.type === 'Expense')
      .reduce((s, t) => s + t.amount, 0);
  }

  openAddDialog() {
  const ref = this.dialog.open(AddTransactionDialogComponent, {
    width: '500px',
    disableClose: true
  });
  ref.afterClosed().subscribe(result => {
    if (result === true) this.loadAll();
  });
  }
}