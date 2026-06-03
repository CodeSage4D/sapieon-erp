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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let ExamService = class ExamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExams(institutionId, subjectId) {
        const where = {
            subject: {
                class: { institutionId },
            },
        };
        if (subjectId) {
            where.subjectId = subjectId;
        }
        return this.prisma.exam.findMany({
            where,
            include: {
                subject: {
                    select: {
                        name: true,
                        code: true,
                        class: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { examDate: 'desc' },
        });
    }
    async createExam(institutionId, data) {
        const subject = await this.prisma.subject.findFirst({
            where: {
                id: data.subjectId,
                class: { institutionId },
            },
        });
        if (!subject) {
            throw new common_1.NotFoundException('Subject not found');
        }
        return this.prisma.exam.create({
            data: {
                name: data.name,
                subjectId: data.subjectId,
                maxMarks: parseFloat(data.maxMarks),
                examDate: new Date(data.examDate),
            },
        });
    }
    async getExamResults(institutionId, examId) {
        const exam = await this.prisma.exam.findFirst({
            where: {
                id: examId,
                subject: { class: { institutionId } },
            },
            include: {
                subject: { select: { classId: true } },
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exam not found');
        }
        const students = await this.prisma.student.findMany({
            where: { classId: exam.subject.classId, institutionId },
            select: { id: true, firstName: true, lastName: true, rollNumber: true },
            orderBy: { rollNumber: 'asc' },
        });
        const results = await this.prisma.examResult.findMany({
            where: { examId },
        });
        const resultsMap = new Map(results.map((r) => [r.studentId, r]));
        return students.map((student) => {
            const existing = resultsMap.get(student.id);
            return {
                studentId: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                rollNumber: student.rollNumber,
                marksObtained: existing ? existing.marksObtained : 0,
                remarks: existing ? existing.remarks : '',
                resultId: existing ? existing.id : null,
            };
        });
    }
    async recordResultsBulk(institutionId, examId, data) {
        const exam = await this.prisma.exam.findFirst({
            where: {
                id: examId,
                subject: { class: { institutionId } },
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exam not found');
        }
        const operations = data.results.map((record) => {
            return this.prisma.examResult.upsert({
                where: {
                    examId_studentId: {
                        examId,
                        studentId: record.studentId,
                    },
                },
                update: {
                    marksObtained: parseFloat(record.marksObtained),
                    remarks: record.remarks || '',
                },
                create: {
                    examId,
                    studentId: record.studentId,
                    marksObtained: parseFloat(record.marksObtained),
                    remarks: record.remarks || '',
                },
            });
        });
        await this.prisma.$transaction(operations);
        return { success: true, count: data.results.length };
    }
    async getStudentReport(studentId) {
        const results = await this.prisma.examResult.findMany({
            where: { studentId },
            include: {
                exam: {
                    include: {
                        subject: true,
                    },
                },
            },
            orderBy: { exam: { examDate: 'desc' } },
        });
        return results.map((r) => {
            const percentage = (r.marksObtained / r.exam.maxMarks) * 100;
            let grade = 'F';
            if (percentage >= 90)
                grade = 'A+';
            else if (percentage >= 80)
                grade = 'A';
            else if (percentage >= 70)
                grade = 'B';
            else if (percentage >= 60)
                grade = 'C';
            else if (percentage >= 50)
                grade = 'D';
            else if (percentage >= 40)
                grade = 'E';
            return {
                examId: r.exam.id,
                examName: r.exam.name,
                subjectName: r.exam.subject.name,
                marksObtained: r.marksObtained,
                maxMarks: r.exam.maxMarks,
                percentage: Math.round(percentage),
                grade,
                remarks: r.remarks,
            };
        });
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamService);
//# sourceMappingURL=exam.service.js.map