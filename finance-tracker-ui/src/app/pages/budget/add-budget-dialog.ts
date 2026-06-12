import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BudgetService } from '../../services/budget';
import { CategoryService, Category } from '../../services/category';

@Component({
  selector: 'app-add-budget-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-budget-dialog.html',
  styleUrl: './add-budget-dialog.scss'
})
export class AddBudgetDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddBudgetDialogComponent>);
  private budgetService = inject(BudgetService);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  saving = false;
  error = '';

  currentYear = new Date().getFullYear();
  years = [this.currentYear - 1, this.currentYear, this.currentYear + 1];
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

  form = this.fb.group({
    categoryId: ['', Validators.required],
    limit:      [null as number | null, [Validators.required, Validators.min(1)]],
    month:      [new Date().getMonth() + 1, Validators.required],
    year:       [this.currentYear, Validators.required],
  });

  ngOnInit() {
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';

    const value = this.form.value;
    this.budgetService.create({
      categoryId: value.categoryId!,
      limit:      value.limit!,
      month:      value.month!,
      year:       value.year!,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.error = 'Errore durante il salvataggio. Riprova.';
        this.saving = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}