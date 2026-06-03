import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    findOne(req: any): Promise<{
        id: string;
        updatedAt: Date;
        institutionId: string;
        academicYear: string;
        gradingSystem: string;
        timezone: string;
        currency: string;
    }>;
    update(req: any, body: any): Promise<{
        id: string;
        updatedAt: Date;
        institutionId: string;
        academicYear: string;
        gradingSystem: string;
        timezone: string;
        currency: string;
    }>;
}
