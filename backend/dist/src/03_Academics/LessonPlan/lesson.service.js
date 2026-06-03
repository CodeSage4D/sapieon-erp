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
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let LessonService = class LessonService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlans(institutionId, teacherId, subjectId) {
        const where = {
            subject: { class: { institutionId } },
        };
        if (teacherId) {
            where.teacherId = teacherId;
        }
        if (subjectId) {
            where.subjectId = subjectId;
        }
        return this.prisma.lessonPlan.findMany({
            where,
            include: {
                subject: { select: { id: true, name: true, code: true, class: { select: { id: true, name: true } } } },
                teacher: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPlan(institutionId, teacherUserId, data) {
        const teacher = await this.prisma.staff.findFirst({
            where: { userId: teacherUserId, institutionId },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher profile not found for this institution');
        }
        return this.prisma.lessonPlan.create({
            data: {
                title: data.title,
                content: data.content,
                status: 'PENDING',
                syllabusPercent: parseInt(data.syllabusPercent || '0'),
                subjectId: data.subjectId,
                teacherId: teacher.id,
            },
        });
    }
    async updatePlan(institutionId, id, data) {
        const plan = await this.prisma.lessonPlan.findFirst({
            where: {
                id,
                subject: { class: { institutionId } },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Lesson plan not found');
        }
        return this.prisma.lessonPlan.update({
            where: { id },
            data: {
                status: data.status,
                syllabusPercent: data.syllabusPercent !== undefined ? parseInt(data.syllabusPercent) : undefined,
            },
        });
    }
    async deletePlan(institutionId, id) {
        const plan = await this.prisma.lessonPlan.findFirst({
            where: {
                id,
                subject: { class: { institutionId } },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Lesson plan not found');
        }
        return this.prisma.lessonPlan.delete({
            where: { id },
        });
    }
};
exports.LessonService = LessonService;
exports.LessonService = LessonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonService);
//# sourceMappingURL=lesson.service.js.map