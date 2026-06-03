import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, pass: string): Promise<{
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
