import { BranchService } from './branch.service';
export declare class BranchController {
    private branchService;
    constructor(branchService: BranchService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pinCode: string | null;
        phone: string | null;
        institutionId: string;
    }[]>;
    create(req: any, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pinCode: string | null;
        phone: string | null;
        institutionId: string;
    }>;
}
