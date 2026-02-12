import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientConfigService } from '../../services/client-config.service';
import { ClientConfig } from '../../models/client-config.model';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    configs: ClientConfig[] = [];

    constructor(private configService: ClientConfigService) { }

    ngOnInit(): void {
        this.loadConfigs();
    }

    loadConfigs(): void {
        this.configService.getAllConfigs().subscribe(data => {
            this.configs = data;
        });
    }

    deleteConfig(clientId: string): void {
        if (confirm(`Are you sure you want to delete client ${clientId}?`)) {
            this.configService.deleteConfig(clientId).subscribe(() => {
                this.loadConfigs();
            });
        }
    }
}
