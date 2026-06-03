import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class UploadService {
    private prisma;
    private readonly uploadDir;
    constructor(prisma: PrismaService);
    saveFile(file: any): Promise<string>;
    getFile(filename: string, user: any): Promise<string>;
}
