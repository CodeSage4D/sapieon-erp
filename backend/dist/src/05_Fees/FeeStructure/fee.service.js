"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let FeeService = class FeeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStructures(institutionId) {
        return this.prisma.feeStructure.findMany({
            where: { institutionId },
            orderBy: { dueDate: 'asc' },
        });
    }
    async createStructure(institutionId, data) {
        return this.prisma.feeStructure.create({
            data: {
                name: data.name,
                amount: parseFloat(data.amount),
                dueDate: new Date(data.dueDate),
                description: data.description || '',
                institutionId,
            },
        });
    }
    async getAllocations(institutionId, classId, status) {
        const where = {
            student: { institutionId },
        };
        if (classId) {
            where.student = { classId, institutionId };
        }
        if (status) {
            where.status = status;
        }
        return this.prisma.studentFeeAllocation.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        rollNumber: true,
                        scholarNumber: true,
                        class: { select: { name: true } },
                    },
                },
                feeStructure: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async allocateBulk(institutionId, data) {
        const students = await this.prisma.student.findMany({
            where: { classId: data.classId, institutionId },
            select: { id: true },
        });
        const feeStructure = await this.prisma.feeStructure.findFirst({
            where: { id: data.feeStructureId, institutionId },
        });
        if (!feeStructure) {
            throw new common_1.NotFoundException('Fee structure not found');
        }
        const operations = students.map((student) => {
            return this.prisma.studentFeeAllocation.create({
                data: {
                    studentId: student.id,
                    feeStructureId: data.feeStructureId,
                    amountDue: feeStructure.amount,
                    amountPaid: 0,
                    status: 'UNPAID',
                },
            });
        });
        return this.prisma.$transaction(operations);
    }
    async recordPayment(institutionId, data) {
        return this.prisma.$transaction(async (tx) => {
            const allocation = await tx.studentFeeAllocation.findUnique({
                where: { id: data.allocationId },
                include: { feeStructure: true, student: true },
            });
            if (!allocation || allocation.student.institutionId !== institutionId) {
                throw new common_1.NotFoundException('Fee allocation record not found');
            }
            const newPaid = allocation.amountPaid + parseFloat(data.amount);
            let status = 'PARTIAL';
            if (newPaid >= allocation.amountDue) {
                status = 'PAID';
            }
            const receiptNumber = `RCPT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
            const payment = await tx.payment.create({
                data: {
                    allocationId: data.allocationId,
                    amount: parseFloat(data.amount),
                    paymentMethod: data.paymentMethod,
                    receiptNumber,
                    remarks: data.remarks || '',
                },
            });
            await tx.studentFeeAllocation.update({
                where: { id: data.allocationId },
                data: {
                    amountPaid: newPaid,
                    status,
                },
            });
            return payment;
        });
    }
    async getPaymentsHistory(institutionId) {
        return this.prisma.payment.findMany({
            where: {
                allocation: {
                    student: { institutionId },
                },
            },
            include: {
                allocation: {
                    include: {
                        student: { select: { firstName: true, lastName: true, rollNumber: true, scholarNumber: true } },
                        feeStructure: { select: { name: true } },
                    },
                },
            },
            orderBy: { paymentDate: 'desc' },
        });
    }
    async getFeeOverview(institutionId) {
        const allocations = await this.prisma.studentFeeAllocation.findMany({
            where: { student: { institutionId } },
            select: {
                amountDue: true,
                amountPaid: true,
                status: true,
            },
        });
        let totalDue = 0;
        let totalPaid = 0;
        for (const alloc of allocations) {
            totalDue += alloc.amountDue;
            totalPaid += alloc.amountPaid;
        }
        return {
            totalDue,
            totalPaid,
            totalPending: totalDue - totalPaid,
            collectedRate: totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0,
            countPaid: allocations.filter((a) => a.status === 'PAID').length,
            countPartial: allocations.filter((a) => a.status === 'PARTIAL').length,
            countUnpaid: allocations.filter((a) => a.status === 'UNPAID').length,
        };
    }
    async getFinanceOverview(institutionId) {
        const allocations = await this.prisma.studentFeeAllocation.findMany({
            where: { student: { institutionId } },
            select: { amountPaid: true },
        });
        const totalRevenue = allocations.reduce((sum, a) => sum + a.amountPaid, 0);
        const expenses = await this.prisma.expense.findMany({
            where: { institutionId },
            orderBy: { expenseDate: 'desc' },
        });
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const staffMembers = await this.prisma.staff.findMany({
            where: { institutionId, status: 'ACTIVE' },
            select: { salary: true },
        });
        const totalSalaries = staffMembers.reduce((sum, s) => sum + s.salary, 0);
        const netProfit = totalRevenue - totalExpenses - totalSalaries;
        const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
        return {
            totalRevenue,
            totalExpenses,
            totalSalaries,
            netProfit,
            profitMargin,
            currency: 'INR',
            currencySymbol: '₹',
            recentExpenses: expenses,
        };
    }
    async getExpenses(institutionId) {
        return this.prisma.expense.findMany({
            where: { institutionId },
            orderBy: { expenseDate: 'desc' },
        });
    }
    async createExpense(institutionId, data) {
        return this.prisma.expense.create({
            data: {
                title: data.title,
                amount: parseFloat(data.amount),
                category: data.category,
                paymentMethod: data.paymentMethod || 'CASH',
                receiptUrl: data.receiptUrl || null,
                institutionId,
            },
        });
    }
    async deleteExpense(institutionId, id) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, institutionId },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense ledger not found');
        }
        return this.prisma.expense.delete({
            where: { id },
        });
    }
};
exports.FeeService = FeeService;
exports.FeeService = FeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeeService);
//# sourceMappingURL=fee.service.js.map