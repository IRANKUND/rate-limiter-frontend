import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientConfigService } from '../../services/client-config.service';
import { ClientConfig, ChronoUnit } from '../../models/client-config.model';

@Component({
    selector: 'app-client-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
    configForm: FormGroup;
    isEditMode = false;
    clientId: string | null = null;
    chronoUnits = Object.values(ChronoUnit);

    constructor(
        private fb: FormBuilder,
        private configService: ClientConfigService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.configForm = this.fb.group({
            clientId: ['', Validators.required],
            clientName: ['', Validators.required],
            rules: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.clientId = this.route.snapshot.paramMap.get('id');
        if (this.clientId && this.clientId !== 'new') {
            this.isEditMode = true;
            this.loadConfig(this.clientId);
            this.configForm.get('clientId')?.disable(); // ID cannot be changed in edit mode
        } else {
            this.addRule(); // Add one empty rule by default for new clients
        }
    }

    get rules(): FormArray {
        return this.configForm.get('rules') as FormArray;
    }

    newRule(): FormGroup {
        return this.fb.group({
            limit: [100, [Validators.required, Validators.min(1)]],
            duration: [1, [Validators.required, Validators.min(1)]],
            unit: [ChronoUnit.MINUTES, Validators.required]
        });
    }

    addRule(): void {
        this.rules.push(this.newRule());
    }

    removeRule(index: number): void {
        this.rules.removeAt(index);
    }

    loadConfig(id: string): void {
        this.configService.getConfig(id).subscribe(config => {
            this.configForm.patchValue({
                clientId: config.clientId,
                clientName: config.clientName
            });

            this.rules.clear();
            if (config.rules) {
                config.rules.forEach(rule => {
                    const ruleGroup = this.newRule();
                    ruleGroup.patchValue(rule);
                    this.rules.push(ruleGroup);
                });
            }
        });
    }

    onSubmit(): void {
        if (this.configForm.invalid) return;

        // Get raw value to include disabled fields (clientId)
        const config: ClientConfig = this.configForm.getRawValue();

        if (this.isEditMode && this.clientId) {
            this.configService.updateConfig(this.clientId, config).subscribe(() => {
                this.router.navigate(['/clients']);
            });
        } else {
            this.configService.createConfig(config).subscribe(() => {
                this.router.navigate(['/clients']);
            }, error => {
                alert('Error creating client. ID might already exist.');
            });
        }
    }
}
