import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '../../services/account';

@Component({
  selector: 'app-add-account-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-account-dialog.html',
  styleUrl: './add-account-dialog.scss'
})
export class AddAccountDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddAccountDialogComponent>);
  private accountService = inject(AccountService);

  saving = false;
  error = '';

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.maxLength(100)]],
    bankName: [''],
    balance:  [0, [Validators.required, Validators.min(0)]],
    currency: ['EUR', Validators.required],
    iban:     ['', Validators.pattern(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/)],
  });

  currencies = ['EUR', 'USD', 'GBP', 'CHF'];

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';

    this.accountService.create(this.form.value as any).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.error = 'Errore durante il salvataggio. Riprova.';
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}