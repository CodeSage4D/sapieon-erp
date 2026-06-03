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
exports.LibraryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../01_Core/Auth/jwt-auth.guard");
const roles_guard_1 = require("../../01_Core/Auth/roles.guard");
const library_service_1 = require("./library.service");
let LibraryController = class LibraryController {
    libraryService;
    constructor(libraryService) {
        this.libraryService = libraryService;
    }
    async getBooks(req, search) {
        return this.libraryService.getBooks(req.user.institutionId, search);
    }
    async getBookById(req, id) {
        return this.libraryService.getBookById(req.user.institutionId, id);
    }
    async createBook(req, body) {
        return this.libraryService.createBook(req.user.institutionId, body);
    }
    async updateBook(req, id, body) {
        return this.libraryService.updateBook(req.user.institutionId, id, body);
    }
    async deleteBook(req, id) {
        return this.libraryService.deleteBook(req.user.institutionId, id);
    }
    async getIssues(req) {
        return this.libraryService.getIssues(req.user.institutionId);
    }
    async getStudentIssues(studentId) {
        return this.libraryService.getStudentIssues(studentId);
    }
    async issueBook(req, body) {
        return this.libraryService.issueBook(req.user.institutionId, body);
    }
    async returnBook(req, issueId) {
        return this.libraryService.returnBook(req.user.institutionId, issueId);
    }
};
exports.LibraryController = LibraryController;
__decorate([
    (0, common_1.Get)('books'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getBooks", null);
__decorate([
    (0, common_1.Get)('books/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getBookById", null);
__decorate([
    (0, common_1.Post)('books'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "createBook", null);
__decorate([
    (0, common_1.Put)('books/:id'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "updateBook", null);
__decorate([
    (0, common_1.Delete)('books/:id'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "deleteBook", null);
__decorate([
    (0, common_1.Get)('issues'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF', 'TEACHER'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getIssues", null);
__decorate([
    (0, common_1.Get)('issues/student/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "getStudentIssues", null);
__decorate([
    (0, common_1.Post)('issue'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "issueBook", null);
__decorate([
    (0, common_1.Post)('return/:issueId'),
    (0, roles_guard_1.Roles)('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'STAFF'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('issueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LibraryController.prototype, "returnBook", null);
exports.LibraryController = LibraryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('library'),
    __metadata("design:paramtypes", [library_service_1.LibraryService])
], LibraryController);
//# sourceMappingURL=library.controller.js.map