import { VisitorService } from './visitor.service';
export declare class VisitorController {
    private visitorService;
    constructor(visitorService: VisitorService);
    getVisitors(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }[]>;
    createVisitor(req: any, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }>;
    checkOutVisitor(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }>;
}
