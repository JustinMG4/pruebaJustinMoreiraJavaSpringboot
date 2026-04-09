import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { NewTransactionDto, NewTransactionResponseDto, TransactionDto } from '../../models/transaction/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  createTransaction(accountId: string, data: NewTransactionDto): Observable<NewTransactionResponseDto> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.post<NewTransactionResponseDto>(`${this.apiUrl}/create`, data, { params });
  }

  getAllTransactions(accountId: string, startDate?: string, endDate?: string): Observable<TransactionDto[]> {
    let params = new HttpParams().set('accountId', accountId);
    
    // Si hay fechas, las agregamos (Spring Boot espera YYYY-MM-DD)
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionDto[]>(`${this.apiUrl}/all-filtered`, { params });
  }
}