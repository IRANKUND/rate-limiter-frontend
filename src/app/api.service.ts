import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RateLimitRule {
  limit: number;
  duration: number;
  unit: string;
}

export interface ClientConfig {
  clientId: string;
  clientName: string;
  rules: RateLimitRule[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api/notifications';
  private configUrl = 'http://localhost:8080/api/configs';

  constructor(private http: HttpClient) { }

  getAllClientConfigs(): Observable<ClientConfig[]> {
    return this.http.get<ClientConfig[]>(this.configUrl);
  }

  getClientConfig(clientId: string): Observable<ClientConfig> {
    const headers = new HttpHeaders({ 'X-Client-Id': clientId });
    return this.http.get<ClientConfig>(`${this.apiUrl}/config`, { headers });
  }

  sendNotification(clientId: string): Observable<string> {
    const headers = new HttpHeaders({ 'X-Client-Id': clientId });
    const body = { to: 'user@example.com', message: 'Hello!' };
    return this.http.post(`${this.apiUrl}/send`, body, { headers, responseType: 'text' });
  }
}
