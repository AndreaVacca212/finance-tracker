import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Budget {
  id: string;
  limit: number;
  month: number;
  year: number;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface CreateBudgetDto {
  limit: number;
  month: number;
  year: number;
  categoryId: string;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5097/api/budgets';

  getAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  create(dto: CreateBudgetDto): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}