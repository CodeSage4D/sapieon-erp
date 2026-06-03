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
exports.TimetableController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const timetable_service_1 = require("./timetable.service");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let TimetableController = class TimetableController {
    timetableService;
    prisma;
    constructor(timetableService, prisma) {
        this.timetableService = timetableService;
        this.prisma = prisma;
    }
    async validateClassInchargeOrAdmin(reqUser, classId) {
        if (reqUser.role === 'SUPER_ADMIN' || reqUser.role === 'INSTITUTE_ADMIN') {
            return;
        }
        const classRecord = await this.prisma.class.findFirst({
            where: { id: classId, institutionId: reqUser.institutionId },
        });
        if (!classRecord) {
            throw new common_1.NotFoundException('Class not found');
        }
        const staff = await this.prisma.staff.findUnique({
            where: { userId: reqUser.id },
        });
        if (!staff || staff.id !== classRecord.classTeacherId) {
            throw new common_1.ForbiddenException('Only the Class Incharge (Class Teacher) or administrators are authorized to perform this operation.');
        }
    }
    async getTimetable(req, classId) {
        return this.timetableService.getTimetable(req.user.institutionId, classId);
    }
    async generateTimetable(req, classId, body) {
        await this.validateClassInchargeOrAdmin(req.user, classId);
        const periodsPerDay = Number(body.periodsPerDay || 6);
        const durationMin = Number(body.durationMin || 45);
        const startTime = body.startTime || '08:30';
        return this.timetableService.generateTimetable(req.user.institutionId, classId, periodsPerDay, durationMin, startTime);
    }
    async saveTimetable(req, classId, body) {
        await this.validateClassInchargeOrAdmin(req.user, classId);
        return this.timetableService.saveTimetable(req.user.institutionId, classId, body.entries);
    }
};
exports.TimetableController = TimetableController;
__decorate([
    (0, common_1.Get)(':classId'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'STUDENT', 'PARENT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "getTimetable", null);
__decorate([
    (0, common_1.Post)(':classId/generate'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "generateTimetable", null);
__decorate([
    (0, common_1.Post)(':classId/save'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "saveTimetable", null);
exports.TimetableController = TimetableController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('timetable'),
    __metadata("design:paramtypes", [timetable_service_1.TimetableService,
        prisma_service_1.PrismaService])
], TimetableController);
//# sourceMappingURL=timetable.controller.js.map