import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ClientConfig } from '../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  selectedClientId = '';
  clients: ClientConfig[] = [];
  config: ClientConfig | null = null;
  lastResponse = '';
  lastError = false;
  loading = false;
  log: { timestamp: string, message: string, error: boolean }[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAllClientConfigs().subscribe({
      next: (data) => {
        this.clients = data;
        if (this.clients.length > 0) {
          this.selectedClientId = this.clients[0].clientId;
          this.loadConfig();
        }
      },
      error: (err) => console.error('Failed to load clients', err)
    });
  }

  loadConfig() {
    this.apiService.getClientConfig(this.selectedClientId).subscribe({
      next: (data) => this.config = data,
      error: (err) => console.error('Failed to load config', err)
    });
  }

  sendRequest() {
    this.loading = true;
    this.apiService.sendNotification(this.selectedClientId).subscribe({
      next: (res) => {
        this.lastResponse = res;
        this.lastError = false;
        this.log.unshift({ timestamp: new Date().toLocaleTimeString(), message: 'Success: ' + res, error: false });
        this.loading = false;
      },
      error: (err) => {
        this.lastResponse = err.error || err.statusText;
        this.lastError = true;
        this.log.unshift({ timestamp: new Date().toLocaleTimeString(), message: 'Error: ' + this.lastResponse, error: true });
        this.loading = false;
      }
    });
  }

  async spamRequests() {
    for (let i = 0; i < 10; i++) {
      this.sendRequest();
      await new Promise(r => setTimeout(r, 200)); // Small delay to visualize
    }
  }
}
