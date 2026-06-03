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
exports.VisitorController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const visitor_service_1 = require("./visitor.service");
let VisitorController = class VisitorController {
    visitorService;
    constructor(visitorService) {
        this.visitorService = visitorService;
    }
    async getVisitors(req) {
        return this.visitorService.getVisitors(req.user.institutionId);
    }
    async createVisitor(req, body) {
        return this.visitorService.createVisitor(req.user.institutionId, body);
    }
    async checkOutVisitor(req, id) {
        return this.visitorService.checkOutVisitor(req.user.institutionId, id);
    }
};
exports.VisitorController = VisitorController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "getVisitors", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "createVisitor", null);
__decorate([
    (0, common_1.Patch)(':id/checkout'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "checkOutVisitor", null);
exports.VisitorController = VisitorController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('visitors'),
    __metadata("design:paramtypes", [visitor_service_1.VisitorService])
], VisitorController);
//# sourceMappingURL=visitor.controller.js.map