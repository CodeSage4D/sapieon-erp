import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    getInventory(req: any): Promise<{
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
    createInventoryItem(req: any, body: any): Promise<{
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
    updateInventoryItem(req: any, id: string, body: any): Promise<{
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
    deleteInventoryItem(req: any, id: string): Promise<{
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
