import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { AccountDto, AccountStatus, AccountType } from '../../models/account/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAccountsByClientAndStatus(clientId: string, status: AccountStatus, type?: AccountType | null): Observable<AccountDto[]> {
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('status', status);

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<AccountDto[]>(`${this.apiUrl}/all-by-status-client`, { params });
  }

  createAccount(clientId: string, type: AccountType): Observable<AccountDto> {
    const params = new HttpParams()
      .set('clientId', clientId)
      .set('type', type);

    return this.http.post<AccountDto>(`${this.apiUrl}/create`, {}, { params });
  }

  changeAccountStatus(accountId: string, newStatus: AccountStatus): Observable<any> {
    const params = new HttpParams()
      .set('accountId', accountId)
      .set('newStatus', newStatus);
    return this.http.patch(`${this.apiUrl}/change-status`, {}, { params });
  }

  closeAccount(accountId: string): Observable<any> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.patch(`${this.apiUrl}/close`, {}, { params });
  }

  getAccountById(accountId: string): Observable<AccountDto> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.get<AccountDto>(`${this.apiUrl}/by-id`, { params });
  }
  
  getAllAccountsByStatus(status: AccountStatus, type?: AccountType | null): Observable<AccountDto[]> {
    let params = new HttpParams().set('status', status);
    
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<AccountDto[]>(`${this.apiUrl}/all-by-status`, { params });
  }

}