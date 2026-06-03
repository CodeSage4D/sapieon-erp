import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class FeeService {
    private prisma;
    constructor(prisma: PrismaService);
    getStructures(institutionId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        description: string | null;
        amount: number;
        dueDate: Date;
    }[]>;
    createStructure(institutionId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        description: string | null;
        amount: number;
        dueDate: Date;
    }>;
    getAllocations(institutionId: string, classId?: string, status?: string): Promise<({
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
    allocateBulk(institutionId: string, data: {
        feeStructureId: string;
        classId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        studentId: string;
        amountDue: number;
        amountPaid: number;
        feeStructureId: string;
    }[]>;
    recordPayment(institutionId: string, data: {
        allocationId: string;
        amount: number;
        paymentMethod: string;
        remarks?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        remarks: string | null;
        amount: number;
        paymentDate: Date;
        paymentMethod: string;
        receiptNumber: string;
        allocationId: string;
    }>;
    getPaymentsHistory(institutionId: string): Promise<({
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
    getFeeOverview(institutionId: string): Promise<{
        totalDue: number;
        totalPaid: number;
        totalPending: number;
        collectedRate: number;
        countPaid: number;
        countPartial: number;
        countUnpaid: number;
    }>;
    getFinanceOverview(institutionId: string): Promise<{
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
    getExpenses(institutionId: string): Promise<{
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
    createExpense(institutionId: string, data: any): Promise<{
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
    deleteExpense(institutionId: string, id: string): Promise<{
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
