import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';
import { BudgetService, Budget as BudgetModel } from '../../services/budget';
import { AddBudgetDialogComponent } from './add-budget-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-budget',
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatProgressBarModule,
    MatSelectModule, CurrencyPipe
  ],
  templateUrl: './budget.html',
  styleUrl: './budget.scss'
})
export class Budget implements OnInit {
  private budgetService = inject(BudgetService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  budgets = signal<BudgetModel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  filterMonth = signal(this.currentMonth);
  filterYear = signal(this.currentYear);

  months = [
    { value: 1,  label: 'Gennaio' },
    { value: 2,  label: 'Febbraio' },
    { value: 3,  label: 'Marzo' },
    { value: 4,  label: 'Aprile' },
    { value: 5,  label: 'Maggio' },
    { value: 6,  label: 'Giugno' },
    { value: 7,  label: 'Luglio' },
    { value: 8,  label: 'Agosto' },
    { value: 9,  label: 'Settembre' },
    { value: 10, label: 'Ottobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Dicembre' },
  ];
  years = [this.currentYear - 1, this.currentYear, this.currentYear + 1];

  filteredBudgets = computed(() =>
    this.budgets().filter(b =>
      b.month === this.filterMonth() && b.year === this.filterYear()
    )
  );

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.loading.set(true);
    this.budgetService.getAll().subscribe({
      next: (data) => { this.budgets.set(data); this.loading.set(false); },
      error: () => { this.error.set('Errore nel caricamento.'); this.loading.set(false); }
    });
  }

  openAddDialog() {
    const ref = this.dialog.open(AddBudgetDialogComponent, {
      width: '460px',
      disableClose: true
    });
    ref.afterClosed().subscribe(result => {
      if (result === true) this.loadBudgets();
    });
  }

  deleteBudget(b: BudgetModel) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Elimina budget',
        message: `Sei sicuro di voler eliminare il budget per "${b.category.name}"?`,
        confirmLabel: 'Elimina'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.deletingId.set(b.id);
      this.budgetService.delete(b.id).subscribe({
        next: () => {
          this.deletingId.set(null);
          this.snackBar.open('Budget eliminato', 'Chiudi', { duration: 3000 });
          this.loadBudgets();
        },
        error: () => {
          this.deletingId.set(null);
          this.snackBar.open('Errore durante l\'eliminazione', 'Chiudi', { duration: 3000 });
        }
      });
    });
  }

  progressValue(b: BudgetModel): number {
    return Math.min((b.spent / b.limit) * 100, 100);
  }

  progressColor(b: BudgetModel): 'primary' | 'warn' {
    return b.isOverBudget ? 'warn' : 'primary';
  }
}