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
exports.NoticeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let NoticeService = class NoticeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotices(institutionId, role) {
        const notices = await this.prisma.notice.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' },
        });
        return notices.filter((notice) => {
            const roles = notice.targetRoles.split(',');
            return roles.includes(role) || roles.includes('ALL') || role === 'SUPER_ADMIN' || role === 'INSTITUTE_ADMIN';
        });
    }
    async createNotice(institutionId, authorName, data) {
        const targetRoles = Array.isArray(data.targetRoles)
            ? data.targetRoles.join(',')
            : data.targetRoles || 'ALL';
        return this.prisma.notice.create({
            data: {
                title: data.title,
                content: data.content,
                targetRoles,
                institutionId,
                authorName,
            },
        });
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NoticeService);
//# sourceMappingURL=notice.service.js.map