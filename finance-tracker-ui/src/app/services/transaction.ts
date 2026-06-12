import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  currency: string;
  notes?: string;
  accountId: string;
  account?: { id: string; name: string };
  categoryId?: string;
  category?: { id: string; name: string; icon: string; color: string };
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  currency: string;
  notes?: string;
  accountId: string;
  categoryId?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5097/api/transactions';

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  create(dto: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}