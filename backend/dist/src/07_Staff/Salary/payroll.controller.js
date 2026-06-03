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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const payroll_service_1 = require("./payroll.service");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async getPayrolls(req, month) {
        return this.payrollService.getPayrolls(req.user.institutionId, month);
    }
    async getStaffPayrolls(req, staffId) {
        if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'INSTITUTE_ADMIN' && req.user.role !== 'ACCOUNTANT' && req.user.role !== 'HR_MANAGER') {
            if (req.user.profileId !== staffId) {
                throw new common_1.ForbiddenException('Access denied to other employee payroll details');
            }
        }
        return this.payrollService.getStaffPayrolls(req.user.institutionId, staffId);
    }
    async getPayrollById(req, id) {
        const payroll = await this.payrollService.getPayrollById(id, req.user.institutionId);
        if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'INSTITUTE_ADMIN' && req.user.role !== 'ACCOUNTANT' && req.user.role !== 'HR_MANAGER') {
            if (req.user.profileId !== payroll.staffId) {
                throw new common_1.ForbiddenException('Access denied to other employee payroll details');
            }
        }
        return payroll;
    }
    async createPayroll(req, body) {
        return this.payrollService.createPayroll(req.user.institutionId, body);
    }
    async updatePayrollStatus(req, id, body) {
        return this.payrollService.updatePayrollStatus(id, req.user.institutionId, body.status);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'ACCOUNTANT', 'HR_MANAGER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayrolls", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'ACCOUNTANT', 'HR_MANAGER', 'TEACHER', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getStaffPayrolls", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'ACCOUNTANT', 'HR_MANAGER', 'TEACHER', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayrollById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'ACCOUNTANT', 'HR_MANAGER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "createPayroll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "updatePayrollStatus", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map