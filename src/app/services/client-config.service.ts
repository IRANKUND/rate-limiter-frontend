import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientConfig } from '../models/client-config.model';

@Injectable({
    providedIn: 'root'
})
export class ClientConfigService {
    private apiUrl = 'http://localhost:8080/api/configs';

    constructor(private http: HttpClient) { }

    getAllConfigs(): Observable<ClientConfig[]> {
        return this.http.get<ClientConfig[]>(this.apiUrl);
    }

    getConfig(clientId: string): Observable<ClientConfig> {
        return this.http.get<ClientConfig>(`${this.apiUrl}/${clientId}`);
    }

    createConfig(config: ClientConfig): Observable<ClientConfig> {
        return this.http.post<ClientConfig>(this.apiUrl, config);
    }

    updateConfig(clientId: string, config: ClientConfig): Observable<ClientConfig> {
        return this.http.put<ClientConfig>(`${this.apiUrl}/${clientId}`, config);
    }

    deleteConfig(clientId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
    }
}
