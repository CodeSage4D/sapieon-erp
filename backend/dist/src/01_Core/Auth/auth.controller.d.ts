import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        pass?: string;
        password?: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
            profileName: string;
            profileId: string;
            institutionId: string;
            institutionName: string;
            logoUrl: string | null;
            primaryColor: string;
        };
    }>;
}
