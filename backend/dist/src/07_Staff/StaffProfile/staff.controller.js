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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const staff_service_1 = require("./staff.service");
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    async getStaff(req, designation) {
        return this.staffService.getStaff(req.user.institutionId, designation);
    }
    async createStaff(req, body) {
        return this.staffService.createStaff(req.user.institutionId, body);
    }
    async getStaffById(req, id) {
        return this.staffService.getStaffById(req.user.institutionId, id);
    }
    async updateStaff(req, id, body) {
        return this.staffService.updateStaff(req.user.institutionId, id, body);
    }
    async getLeaves(req, staffId) {
        if (req.user.role !== 'INSTITUTE_ADMIN' && req.user.role !== 'STAFF') {
            return this.staffService.getLeaves(req.user.institutionId, req.user.profileId);
        }
        return this.staffService.getLeaves(req.user.institutionId, staffId);
    }
    async createLeaveRequest(req, body) {
        return this.staffService.createLeaveRequest(req.user.id, body);
    }
    async updateLeaveStatus(req, id, body) {
        return this.staffService.updateLeaveStatus(req.user.institutionId, id, body.status, req.user.id);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'HR_MANAGER', 'SUPER_ADMIN'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('designation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaff", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'HR_MANAGER', 'SUPER_ADMIN'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'HR_MANAGER', 'SUPER_ADMIN', 'TEACHER', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'HR_MANAGER', 'SUPER_ADMIN'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Get)('leaves'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getLeaves", null);
__decorate([
    (0, common_1.Post)('leaves'),
    (0, roles_guard_1.Roles)('TEACHER', 'ACCOUNTANT', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Patch)('leaves/:id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateLeaveStatus", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map