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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const student_service_1 = require("./student.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
let StudentController = class StudentController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    async findAll(req, classId, search) {
        return this.studentService.findAll(req.user.institutionId, classId, search, req.user.role, req.user.profileId);
    }
    async findOne(req, id) {
        if (req.user.role === 'STUDENT' && req.user.profileId !== id) {
            throw new common_1.ForbiddenException('You can only access your own profile');
        }
        const student = await this.studentService.findOne(req.user.institutionId, id, req.user.role, req.user.profileId);
        if (req.user.role === 'PARENT' && student.parentId !== req.user.profileId) {
            throw new common_1.ForbiddenException('You can only access profiles of your linked children');
        }
        return student;
    }
    async create(req, body) {
        return this.studentService.create(req.user.institutionId, body);
    }
    async update(req, id, body) {
        return this.studentService.update(req.user.institutionId, id, body);
    }
    async promote(req, body) {
        return this.studentService.promote(req.user.institutionId, body, req.user.id);
    }
    async getPromotionHistory(req) {
        return this.studentService.getPromotionHistory(req.user.institutionId);
    }
    async remove(req, id) {
        return this.studentService.remove(req.user.institutionId, id);
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'ACCOUNTANT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('classId')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'ACCOUNTANT', 'STUDENT', 'PARENT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('promote'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "promote", null);
__decorate([
    (0, common_1.Get)('promotions/history'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getPromotionHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "remove", null);
exports.StudentController = StudentController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentController);
//# sourceMappingURL=student.controller.js.map