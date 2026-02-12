export enum ChronoUnit {
    SECONDS = 'SECONDS',
    MINUTES = 'MINUTES',
    HOURS = 'HOURS',
    DAYS = 'DAYS',
    MONTHS = 'MONTHS'
}

export interface RateLimitRule {
    id?: number;
    limit: number;
    duration: number;
    unit: ChronoUnit;
}

export interface ClientConfig {
    clientId: string;
    clientName: string;
    rules: RateLimitRule[];
}
