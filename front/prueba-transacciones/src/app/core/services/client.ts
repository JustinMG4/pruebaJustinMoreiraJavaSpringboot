import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { ClientDto, ClientStatus, RegisterClientDto, UpdateClientDto } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  getAllClients(status: ClientStatus): Observable<ClientDto[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<ClientDto[]>(`${this.apiUrl}/all`, { params });
  }

  createClient(dto: RegisterClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${this.apiUrl}/create`, dto);
  }

  getClientById(id: string): Observable<ClientDto> {
    const params = new HttpParams().set('id', id);
    return this.http.get<ClientDto>(`${this.apiUrl}/by-id`, { params });
  }

  updateClient(id: string, dto: UpdateClientDto): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.put(`${this.apiUrl}/update`, dto, { params });
  }

  changeStatus(id: string, status: ClientStatus): Observable<any> {
    const params = new HttpParams()
      .set('id', id)
      .set('status', status);

    return this.http.patch(`${this.apiUrl}/change-status`, {}, { params });
  }

  deleteClient(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.patch(`${this.apiUrl}/delete`, {}, { params });
  }

  verifyPassword(clientId: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('clientId', clientId);
    return this.http.post<boolean>(`${this.apiUrl}/verify-password`, password, { params });
  }
}