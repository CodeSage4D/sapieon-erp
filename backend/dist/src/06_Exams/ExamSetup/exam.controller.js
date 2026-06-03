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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const exam_service_1 = require("./exam.service");
let ExamController = class ExamController {
    examService;
    constructor(examService) {
        this.examService = examService;
    }
    async getExams(req, subjectId) {
        return this.examService.getExams(req.user.institutionId, subjectId);
    }
    async createExam(req, body) {
        return this.examService.createExam(req.user.institutionId, body);
    }
    async getExamResults(req, id) {
        return this.examService.getExamResults(req.user.institutionId, id);
    }
    async recordResultsBulk(req, id, body) {
        return this.examService.recordResultsBulk(req.user.institutionId, id, body);
    }
    async getStudentReport(studentId) {
        return this.examService.getStudentReport(studentId);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'STUDENT', 'PARENT'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExams", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "createExam", null);
__decorate([
    (0, common_1.Get)(':id/results'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExamResults", null);
__decorate([
    (0, common_1.Post)(':id/results/bulk'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "recordResultsBulk", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_guard_1.Roles)('INSTITUTE_ADMIN', 'STAFF', 'TEACHER', 'STUDENT', 'PARENT'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getStudentReport", null);
exports.ExamController = ExamController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exam_service_1.ExamService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map