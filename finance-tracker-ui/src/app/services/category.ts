import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category
{
    id: string;
  name: string;
  icon: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService
{
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5097/api/categories';

  getAll() : Observable<Category[]> {
    return this.http.get< Category[] > (this.apiUrl);
        }
    }