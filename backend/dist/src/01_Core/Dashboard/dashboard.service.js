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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats(institutionId) {
        const studentCount = await this.prisma.student.count({ where: { institutionId } });
        const staffCount = await this.prisma.staff.count({ where: { institutionId } });
        const classCount = await this.prisma.class.count({ where: { institutionId } });
        const notices = await this.prisma.notice.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });
        const allocations = await this.prisma.studentFeeAllocation.findMany({
            where: { student: { institutionId } },
            select: { amountDue: true, amountPaid: true },
        });
        let totalDue = 0;
        let totalPaid = 0;
        for (const alloc of allocations) {
            totalDue += alloc.amountDue;
            totalPaid += alloc.amountPaid;
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const attendanceRecords = await this.prisma.attendance.findMany({
            where: {
                date: { gte: sevenDaysAgo },
                student: { institutionId },
            },
            select: { status: true },
        });
        const totalAttendance = attendanceRecords.length;
        const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 96.5;
        const classes = await this.prisma.class.findMany({
            where: { institutionId },
            select: {
                id: true,
                name: true,
                _count: { select: { students: true } },
            },
        });
        const studentsWithRecords = await this.prisma.student.findMany({
            where: { institutionId, status: 'ACTIVE' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
                scholarNumber: true,
                class: { select: { name: true } },
                attendance: { select: { status: true } },
                examResults: {
                    select: {
                        marksObtained: true,
                        exam: { select: { maxMarks: true } },
                    },
                },
            },
        });
        const weakStudents = [];
        for (const student of studentsWithRecords) {
            const sTotalAttendance = student.attendance.length;
            const sPresentCount = student.attendance.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
            const sAttendanceRate = sTotalAttendance > 0 ? (sPresentCount / sTotalAttendance) * 100 : 100;
            let totalMaxMarks = 0;
            let totalMarksObtained = 0;
            for (const res of student.examResults) {
                totalMaxMarks += res.exam.maxMarks;
                totalMarksObtained += res.marksObtained;
            }
            const examPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 100;
            if (sAttendanceRate < 70 && examPercentage < 40) {
                weakStudents.push({
                    studentId: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    scholarNumber: student.scholarNumber,
                    rollNumber: student.rollNumber,
                    className: student.class?.name || 'Unassigned',
                    attendanceRate: Math.round(sAttendanceRate * 10) / 10,
                    examAverage: Math.round(examPercentage * 10) / 10,
                    reason: 'Attendance < 70% and Marks < 40%',
                });
            }
        }
        return {
            studentCount,
            staffCount,
            classCount,
            feeOverview: {
                totalDue,
                totalPaid,
                totalPending: totalDue - totalPaid,
                collectionRate: totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 90,
            },
            attendanceRate: Math.round(attendanceRate * 10) / 10,
            recentNotices: notices,
            classes: classes.map((c) => ({
                id: c.id,
                name: c.name,
                studentCount: c._count.students,
            })),
            weakStudents,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map