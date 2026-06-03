import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getInventory(institutionId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        status: string;
        category: string;
        quantity: number;
        unit: string;
        vendor: string | null;
    }[]>;
    createInventoryItem(institutionId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        status: string;
        category: string;
        quantity: number;
        unit: string;
        vendor: string | null;
    }>;
    updateInventoryItem(institutionId: string, id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        status: string;
        category: string;
        quantity: number;
        unit: string;
        vendor: string | null;
    }>;
    deleteInventoryItem(institutionId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        status: string;
        category: string;
        quantity: number;
        unit: string;
        vendor: string | null;
    }>;
}
