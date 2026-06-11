import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  name: string;
  bankName?: string;
  balance: number;
  currency: string;
  createdAt: string;
  iban?: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5097/api/accounts';

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  create(account: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}