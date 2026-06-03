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
exports.FeeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const fee_service_1 = require("./fee.service");
let FeeController = class FeeController {
    feeService;
    constructor(feeService) {
        this.feeService = feeService;
    }
    async getStructures(req) {
        return this.feeService.getStructures(req.user.institutionId);
    }
    async createStructure(req, body) {
        return this.feeService.createStructure(req.user.institutionId, body);
    }
    async getAllocations(req, classId, status) {
        return this.feeService.getAllocations(req.user.institutionId, classId, status);
    }
    async allocateBulk(req, body) {
        return this.feeService.allocateBulk(req.user.institutionId, body);
    }
    async recordPayment(req, body) {
        return this.feeService.recordPayment(req.user.institutionId, body);
    }
    async getPaymentsHistory(req) {
        return this.feeService.getPaymentsHistory(req.user.institutionId);
    }
    async getOverview(req) {
        return this.feeService.getFeeOverview(req.user.institutionId);
    }
    async getFinanceOverview(req) {
        return this.feeService.getFinanceOverview(req.user.institutionId);
    }
    async getExpenses(req) {
        return this.feeService.getExpenses(req.user.institutionId);
    }
    async createExpense(req, body) {
        return this.feeService.createExpense(req.user.institutionId, body);
    }
    async deleteExpense(req, id) {
        return this.feeService.deleteExpense(req.user.institutionId, id);
    }
};
exports.FeeController = FeeController;
__decorate([
    (0, common_1.Get)('structures'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getStructures", null);
__decorate([
    (0, common_1.Post)('structures'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "createStructure", null);
__decorate([
    (0, common_1.Get)('allocations'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('classId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getAllocations", null);
__decorate([
    (0, common_1.Post)('allocations/bulk'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "allocateBulk", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)('payments/history'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getPaymentsHistory", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('finance/overview'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getFinanceOverview", null);
__decorate([
    (0, common_1.Get)('expenses'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Post)('expenses'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FeeController.prototype, "deleteExpense", null);
exports.FeeController = FeeController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('fees'),
    __metadata("design:paramtypes", [fee_service_1.FeeService])
], FeeController);
//# sourceMappingURL=fee.controller.js.map