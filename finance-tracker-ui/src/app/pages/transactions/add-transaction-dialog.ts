import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionService } from '../../services/transaction';
import { AccountService, Account } from '../../services/account';
import { CategoryService, Category } from '../../services/category';

@Component({
  selector: 'app-add-transaction-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
  templateUrl: './add-transaction-dialog.html',
  styleUrl: './add-transaction-dialog.scss'
})
export class AddTransactionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddTransactionDialogComponent>);
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);

  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);
  saving = false;
  error = '';

  form = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(200)]],
    amount:      [null as number | null, [Validators.required, Validators.min(0.01)]],
    type:        ['Expense', Validators.required],
    date:        [new Date(), Validators.required],
    accountId:   ['', Validators.required],
    categoryId:  [''],
    notes:       [''],
  });

  ngOnInit() {
    this.accountService.getAll().subscribe(data => this.accounts.set(data));
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';

    const value = this.form.value;
    const dto = {
      description: value.description!,
      amount:      value.amount!,
      type:        value.type as 'Income' | 'Expense',
      date:        (value.date as Date).toISOString(),
      currency:    'EUR',
      accountId:   value.accountId!,
      categoryId:  value.categoryId || undefined,
      notes:       value.notes || undefined,
    };

    this.transactionService.create(dto).subscribe({
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