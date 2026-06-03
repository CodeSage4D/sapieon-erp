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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let PayrollService = class PayrollService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPayrolls(institutionId, month) {
        const where = {
            staff: { institutionId },
        };
        if (month) {
            where.month = month;
        }
        return this.prisma.payroll.findMany({
            where,
            include: {
                staff: {
                    select: {
                        id: true,
                        employeeId: true,
                        firstName: true,
                        lastName: true,
                        designation: true,
                    },
                },
            },
            orderBy: { paymentDate: 'desc' },
        });
    }
    async getStaffPayrolls(institutionId, staffId) {
        const staff = await this.prisma.staff.findFirst({
            where: { id: staffId, institutionId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return this.prisma.payroll.findMany({
            where: { staffId },
            orderBy: { paymentDate: 'desc' },
        });
    }
    async getPayrollById(id, institutionId) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id },
            include: {
                staff: true,
            },
        });
        if (!payroll || payroll.staff.institutionId !== institutionId) {
            throw new common_1.NotFoundException('Payroll record not found');
        }
        return payroll;
    }
    async createPayroll(institutionId, data) {
        const staff = await this.prisma.staff.findFirst({
            where: { id: data.staffId, institutionId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        const existing = await this.prisma.payroll.findFirst({
            where: {
                staffId: data.staffId,
                month: data.month,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Salary slip for ${data.month} already generated for this employee`);
        }
        const baseSalary = parseFloat(data.baseSalary) || staff.salary;
        const hra = parseFloat(data.hra) || 0;
        const da = parseFloat(data.da) || 0;
        const allowances = parseFloat(data.allowances) || 0;
        const deductions = parseFloat(data.deductions) || 0;
        const netPay = baseSalary + hra + da + allowances - deductions;
        const receiptNumber = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        return this.prisma.payroll.create({
            data: {
                staffId: data.staffId,
                month: data.month,
                baseSalary,
                hra,
                da,
                allowances,
                deductions,
                netPay,
                paymentMethod: data.paymentMethod || 'BANK_TRANSFER',
                receiptNumber,
                status: 'PAID',
            },
            include: {
                staff: true,
            },
        });
    }
    async updatePayrollStatus(id, institutionId, status) {
        const payroll = await this.getPayrollById(id, institutionId);
        return this.prisma.payroll.update({
            where: { id },
            data: { status },
            include: { staff: true },
        });
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map