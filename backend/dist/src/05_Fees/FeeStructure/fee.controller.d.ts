import { FeeService } from './fee.service';
export declare class FeeController {
    private feeService;
    constructor(feeService: FeeService);
    getStructures(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        description: string | null;
        amount: number;
        dueDate: Date;
    }[]>;
    createStructure(req: any, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        description: string | null;
        amount: number;
        dueDate: Date;
    }>;
    getAllocations(req: any, classId?: string, status?: string): Promise<({
        student: {
            id: string;
            firstName: string;
            lastName: string;
            class: {
                name: string;
            };
            scholarNumber: string;
            rollNumber: string;
        };
        feeStructure: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            institutionId: string;
            description: string | null;
            amount: number;
            dueDate: Date;
        };
        payments: {
            id: string;
            createdAt: Date;
            remarks: string | null;
            amount: number;
            paymentDate: Date;
            paymentMethod: string;
            receiptNumber: string;
            allocationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        studentId: string;
        amountDue: number;
        amountPaid: number;
        feeStructureId: string;
    })[]>;
    allocateBulk(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        studentId: string;
        amountDue: number;
        amountPaid: number;
        feeStructureId: string;
    }[]>;
    recordPayment(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        remarks: string | null;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        receiptNumber: string;
        allocationId: string;
    }>;
    getPaymentsHistory(req: any): Promise<({
        allocation: {
            student: {
                firstName: string;
                lastName: string;
                scholarNumber: string;
                rollNumber: string;
            };
            feeStructure: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            studentId: string;
            amountDue: number;
            amountPaid: number;
            feeStructureId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        remarks: string | null;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        receiptNumber: string;
        allocationId: string;
    })[]>;
    getOverview(req: any): Promise<{
        totalDue: number;
        totalPaid: number;
        totalPending: number;
        collectedRate: number;
        countPaid: number;
        countPartial: number;
        countUnpaid: number;
    }>;
    getFinanceOverview(req: any): Promise<{
        totalRevenue: number;
        totalExpenses: number;
        totalSalaries: number;
        netProfit: number;
        profitMargin: number;
        currency: string;
        currencySymbol: string;
        recentExpenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            institutionId: string;
            title: string;
            amount: number;
            paymentMethod: string;
            category: string;
            expenseDate: Date;
            receiptUrl: string | null;
        }[];
    }>;
    getExpenses(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        amount: number;
        paymentMethod: string;
        category: string;
        expenseDate: Date;
        receiptUrl: string | null;
    }[]>;
    createExpense(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        amount: number;
        paymentMethod: string;
        category: string;
        expenseDate: Date;
        receiptUrl: string | null;
    }>;
    deleteExpense(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        amount: number;
        paymentMethod: string;
        category: string;
        expenseDate: Date;
        receiptUrl: string | null;
    }>;
}
